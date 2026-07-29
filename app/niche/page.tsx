import Link from "next/link";
import { notFound } from "next/navigation";
import { getListingsByNiche } from "@/lib/db";
import { deleteListingAction, toggleStarredAction } from "@/lib/actions";
import DeleteButton from "../DeleteButton";
import StarButton from "../StarButton";

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

export const dynamic = "force-dynamic";

export default async function NicheDetailPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const name = typeof searchParams.name === "string" ? searchParams.name : undefined;
  if (!name) notFound();

  const rows = await getListingsByNiche(name);
  if (rows.length === 0) notFound();

  const verdict = typeof searchParams.verdict === "string" ? searchParams.verdict : undefined;
  const tier = typeof searchParams.tier === "string" ? searchParams.tier : undefined;
  const state = typeof searchParams.state === "string" ? searchParams.state : undefined;
  const q = typeof searchParams.q === "string" ? searchParams.q : undefined;
  const sort = typeof searchParams.sort === "string" ? searchParams.sort : undefined;
  const dir = typeof searchParams.dir === "string" ? searchParams.dir : undefined;
  const backHref = `/${qs({ verdict, tier, state, q, sort, dir })}`;

  const tiers = Array.from(new Set(rows.map((r) => r.tier)));

  return (
    <div>
      <Link href={backHref} className="text-sm text-blue-600 hover:underline">
        ← Back to dataset
      </Link>

      <div className="flex items-baseline justify-between mb-4 mt-2 flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-bold">{name}</h1>
          <p className="text-sm text-slate-500 mt-1">{tiers.join(", ")}</p>
        </div>
        <Link
          href={`/listings/new${qs({ niche: name, tier: tiers[0] })}`}
          className="bg-slate-900 text-white rounded px-3 py-1.5 text-sm whitespace-nowrap"
        >
          + Add Another Location
        </Link>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto border rounded-lg bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-slate-50 text-left">
              <th className="px-3 py-2"></th>
              <th className="px-3 py-2">City</th>
              <th className="px-3 py-2">State</th>
              <th className="px-3 py-2">Pop.</th>
              <th className="px-3 py-2">Top-3 Reviews</th>
              <th className="px-3 py-2">Verdict</th>
              <th className="px-3 py-2">Notes</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((l) => (
              <tr key={l.id} className="border-b last:border-0 align-top hover:bg-slate-50">
                <td className="px-3 py-2">
                  <StarButton id={l.id} starred={l.starred} action={toggleStarredAction} />
                </td>
                <td className="px-3 py-2 font-medium whitespace-nowrap">{l.city}</td>
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
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden grid gap-3">
        {rows.map((l) => (
          <div key={l.id} className="bg-white border rounded-lg p-4">
            <div className="flex justify-between items-start gap-2">
              <div className="flex items-start gap-2">
                <StarButton id={l.id} starred={l.starred} action={toggleStarredAction} size="lg" />
                <div>
                  <div className="font-semibold">
                    {l.city}
                    {l.state ? `, ${l.state}` : ""}
                  </div>
                  {l.population && (
                    <div className="text-sm text-slate-500">~{l.population.toLocaleString()}</div>
                  )}
                </div>
              </div>
              {verdictBadge(l.verdict)}
            </div>
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
      </div>
    </div>
  );
}
