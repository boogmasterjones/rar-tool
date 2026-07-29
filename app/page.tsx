import Link from "next/link";
import { listListings, distinctStates } from "@/lib/db";
import { TIERS, VERDICTS, Listing } from "@/lib/types";

export const dynamic = "force-dynamic";

function qs(params: Record<string, string | undefined>): string {
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v) usp.set(k, v);
  });
  const s = usp.toString();
  return s ? `?${s}` : "";
}

function verdictBadge(verdict: string) {
  const colors: Record<string, string> = {
    GOOD: "bg-green-100 text-green-800 border-green-300",
    MODERATE: "bg-amber-100 text-amber-800 border-amber-300",
    AVOID: "bg-red-100 text-red-800 border-red-300",
  };
  return (
    <span
      key={verdict}
      className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold border ${colors[verdict] ?? ""}`}
    >
      {verdict}
    </span>
  );
}

const VERDICT_ORDER: Record<string, number> = { GOOD: 0, MODERATE: 1, AVOID: 2 };

interface NicheGroup {
  niche: string;
  tiers: string[];
  verdicts: string[];
  rows: Listing[];
  notes: string;
}

function groupByNiche(listings: Listing[]): NicheGroup[] {
  const map = new Map<string, NicheGroup>();
  for (const l of listings) {
    let group = map.get(l.niche);
    if (!group) {
      group = { niche: l.niche, tiers: [], verdicts: [], rows: [], notes: "" };
      map.set(l.niche, group);
    }
    group.rows.push(l);
    if (!group.tiers.includes(l.tier)) group.tiers.push(l.tier);
    if (!group.verdicts.includes(l.verdict)) group.verdicts.push(l.verdict);
    if (!group.notes && l.notes) group.notes = l.notes;
  }
  const groups = Array.from(map.values());
  groups.forEach((g) => g.verdicts.sort((a, b) => (VERDICT_ORDER[a] ?? 9) - (VERDICT_ORDER[b] ?? 9)));
  return groups;
}

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const verdict = typeof searchParams.verdict === "string" ? searchParams.verdict : undefined;
  const tier = typeof searchParams.tier === "string" ? searchParams.tier : undefined;
  const state = typeof searchParams.state === "string" ? searchParams.state : undefined;
  const q = typeof searchParams.q === "string" ? searchParams.q : undefined;
  const sort = typeof searchParams.sort === "string" ? searchParams.sort : "niche";
  const dir = searchParams.dir === "desc" ? "desc" : "asc";

  const [listings, states] = await Promise.all([
    listListings({ verdict, tier, state, q, sort: "niche", dir: "asc" }),
    distinctStates(),
  ]);

  let groups = groupByNiche(listings);

  groups.sort((a, b) => {
    let cmp = 0;
    if (sort === "tier") cmp = (a.tiers[0] ?? "").localeCompare(b.tiers[0] ?? "");
    else if (sort === "locations") cmp = a.rows.length - b.rows.length;
    else cmp = a.niche.localeCompare(b.niche);
    return dir === "desc" ? -cmp : cmp;
  });

  const currentParams = { verdict, tier, state, q, sort, dir };
  const backQs = qs(currentParams);

  function sortLink(col: string, label: string) {
    const active = sort === col;
    const linkDir = active && dir === "asc" ? "desc" : "asc";
    return (
      <Link
        href={qs({ ...currentParams, sort: col, dir: linkDir })}
        className={`hover:underline ${active ? "font-semibold text-slate-900" : "text-slate-500"}`}
      >
        {label}
        {active ? (dir === "asc" ? " ▲" : " ▼") : ""}
      </Link>
    );
  }

  return (
    <div>
      <div className="flex items-baseline justify-between mb-4 flex-wrap gap-2">
        <h1 className="text-2xl font-bold">Target Dataset</h1>
        <p className="text-sm text-slate-500">
          {groups.length} niche{groups.length === 1 ? "" : "s"} · {listings.length} location
          {listings.length === 1 ? "" : "s"} tested
        </p>
      </div>

      <form method="get" className="bg-white border rounded-lg p-4 mb-6 grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="col-span-2 md:col-span-1">
          <label className="block text-xs font-medium text-slate-500 mb-1">Search</label>
          <input
            type="text"
            name="q"
            defaultValue={q ?? ""}
            placeholder="niche, city, notes..."
            className="w-full border rounded px-2 py-1.5 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Verdict</label>
          <select name="verdict" defaultValue={verdict ?? ""} className="w-full border rounded px-2 py-1.5 text-sm">
            <option value="">All</option>
            {VERDICTS.map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Category</label>
          <select name="tier" defaultValue={tier ?? ""} className="w-full border rounded px-2 py-1.5 text-sm">
            <option value="">All</option>
            {TIERS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">State</label>
          <select name="state" defaultValue={state ?? ""} className="w-full border rounded px-2 py-1.5 text-sm">
            <option value="">All</option>
            {states.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="flex items-end gap-2">
          <button type="submit" className="bg-slate-900 text-white rounded px-3 py-1.5 text-sm w-full">
            Filter
          </button>
          <Link href="/" className="text-sm text-slate-500 underline whitespace-nowrap py-1.5">
            Reset
          </Link>
        </div>
      </form>

      <p className="text-xs text-slate-500 mb-2">
        {verdict || tier || state || q
          ? "Showing niches with at least one matching location. Click a niche to see all locations tested for it."
          : "Click a niche to see all the locations tested for it."}
      </p>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto border rounded-lg bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-slate-50 text-left">
              <th className="px-3 py-2">{sortLink("niche", "Niche")}</th>
              <th className="px-3 py-2">{sortLink("tier", "Category")}</th>
              <th className="px-3 py-2">{sortLink("locations", "Locations")}</th>
              <th className="px-3 py-2">Verdicts</th>
              <th className="px-3 py-2">Notes</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((g) => (
              <tr key={g.niche} className="border-b last:border-0 align-top hover:bg-slate-50">
                <td className="px-3 py-2 font-medium">
                  <Link
                    href={`/niche${qs({ name: g.niche, ...currentParams })}`}
                    className="text-blue-700 hover:underline"
                  >
                    {g.niche}
                  </Link>
                </td>
                <td className="px-3 py-2 text-slate-500 whitespace-nowrap">{g.tiers.join(", ")}</td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {g.rows.length} {g.rows.length === 1 ? "city" : "cities"}
                </td>
                <td className="px-3 py-2">
                  <div className="flex gap-1 flex-wrap">{g.verdicts.map((v) => verdictBadge(v))}</div>
                </td>
                <td className="px-3 py-2 max-w-sm text-slate-500">{g.notes || "—"}</td>
              </tr>
            ))}
            {groups.length === 0 && (
              <tr>
                <td colSpan={5} className="px-3 py-8 text-center text-slate-400">
                  No niches match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden grid gap-3">
        {groups.map((g) => (
          <Link
            key={g.niche}
            href={`/niche${qs({ name: g.niche, ...currentParams })}`}
            className="block bg-white border rounded-lg p-4"
          >
            <div className="flex justify-between items-start gap-2">
              <div className="font-semibold text-blue-700">{g.niche}</div>
            </div>
            <div className="text-xs text-slate-400 mt-1">{g.tiers.join(", ")}</div>
            <div className="flex gap-1 flex-wrap mt-2">{g.verdicts.map((v) => verdictBadge(v))}</div>
            <div className="text-sm text-slate-600 mt-2">
              {g.rows.length} {g.rows.length === 1 ? "city" : "cities"} tested
            </div>
            {g.notes && <div className="text-sm text-slate-500 mt-1">{g.notes}</div>}
          </Link>
        ))}
        {groups.length === 0 && (
          <p className="text-center text-slate-400 py-8">No niches match these filters.</p>
        )}
      </div>
    </div>
  );
}
