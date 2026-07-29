import Link from "next/link";
import { listListings, distinctStates } from "@/lib/db";
import { TIERS, VERDICTS } from "@/lib/types";
import { deleteListingAction } from "@/lib/actions";
import DeleteButton from "./DeleteButton";

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
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold border ${colors[verdict] ?? ""}`}>
      {verdict}
    </span>
  );
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
    listListings({ verdict, tier, state, q, sort, dir }),
    distinctStates(),
  ]);

  const currentParams = { verdict, tier, state, q, sort, dir };
  const nextDir = dir === "asc" ? "desc" : "asc";

  function sortLink(col: string, label: string) {
    const active = sort === col;
    const linkDir = active && dir === "asc" ? "desc" : "asc";
    return (
      <Link
        href={qs({ ...currentParams, sort: col, dir: linkDir })}
        className={`hover:underline ${active ? "font-semibold text-slate-900" : "text-slate-500"}`}
      >
        {label}{active ? (dir === "asc" ? " ▲" : " ▼") : ""}
      </Link>
    );
  }

  return (
    <div>
      <div className="flex items-baseline justify-between mb-4 flex-wrap gap-2">
        <h1 className="text-2xl font-bold">Target Dataset</h1>
        <p className="text-sm text-slate-500">{listings.length} listing{listings.length === 1 ? "" : "s"}</p>
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

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto border rounded-lg bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-slate-50 text-left">
              <th className="px-3 py-2">{sortLink("niche", "Niche")}</th>
              <th className="px-3 py-2">{sortLink("tier", "Category")}</th>
              <th className="px-3 py-2">{sortLink("city", "City")}</th>
              <th className="px-3 py-2">{sortLink("state", "State")}</th>
              <th className="px-3 py-2">{sortLink("population", "Pop.")}</th>
              <th className="px-3 py-2">Top-3 Reviews</th>
              <th className="px-3 py-2">{sortLink("verdict", "Verdict")}</th>
              <th className="px-3 py-2">Notes</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {listings.map((l) => (
              <tr key={l.id} className="border-b last:border-0 align-top hover:bg-slate-50">
                <td className="px-3 py-2 font-medium">{l.niche}</td>
                <td className="px-3 py-2 text-slate-500 whitespace-nowrap">{l.tier}</td>
                <td className="px-3 py-2 whitespace-nowrap">{l.city}</td>
                <td className="px-3 py-2">{l.state ?? "—"}</td>
                <td className="px-3 py-2">{l.population ? l.population.toLocaleString() : "—"}</td>
                <td className="px-3 py-2 max-w-xs">{l.reviews}</td>
                <td className="px-3 py-2">{verdictBadge(l.verdict)}</td>
                <td className="px-3 py-2 max-w-xs text-slate-500">{l.notes || "—"}</td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <Link href={`/listings/${l.id}/edit`} className="text-blue-600 hover:underline mr-3">
                    Edit
                  </Link>
                  <DeleteButton id={l.id} action={deleteListingAction} niche={l.niche} city={l.city} />
                </td>
              </tr>
            ))}
            {listings.length === 0 && (
              <tr>
                <td colSpan={9} className="px-3 py-8 text-center text-slate-400">
                  No listings match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden grid gap-3">
        {listings.map((l) => (
          <div key={l.id} className="bg-white border rounded-lg p-4">
            <div className="flex justify-between items-start gap-2">
              <div>
                <div className="font-semibold">{l.niche}</div>
                <div className="text-sm text-slate-500">
                  {l.city}{l.state ? `, ${l.state}` : ""}
                  {l.population ? ` (~${l.population.toLocaleString()})` : ""}
                </div>
              </div>
              {verdictBadge(l.verdict)}
            </div>
            <div className="text-xs text-slate-400 mt-2">{l.tier}</div>
            <div className="text-sm mt-2">
              <span className="font-medium">Top-3:</span> {l.reviews}
            </div>
            {l.notes && <div className="text-sm text-slate-500 mt-1">{l.notes}</div>}
            <div className="mt-3 flex gap-3">
              <Link href={`/listings/${l.id}/edit`} className="text-blue-600 text-sm hover:underline">
                Edit
              </Link>
              <DeleteButton id={l.id} action={deleteListingAction} niche={l.niche} city={l.city} />
            </div>
          </div>
        ))}
        {listings.length === 0 && (
          <p className="text-center text-slate-400 py-8">No listings match these filters.</p>
        )}
      </div>
    </div>
  );
}
