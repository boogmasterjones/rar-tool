export default function MethodologyPage() {
  return (
    <div className="max-w-3xl bg-white border rounded-lg p-6 space-y-4 text-sm leading-relaxed">
      <h1 className="text-2xl font-bold mb-2">How This Data Was Gathered</h1>
      <p>
        Every (niche, city) pair in the dataset was evaluated using this process:
      </p>
      <ol className="list-decimal list-outside pl-5 space-y-3">
        <li>
          Search Google Maps for <code className="bg-slate-100 px-1 rounded">[niche] [city, state]</code> and
          read the actual local 3-pack / map pack results — business name, category, review count.
        </li>
        <li>
          <strong>Relevance-filter the results.</strong> Google Maps text search often returns
          businesses that share a keyword but don&apos;t actually compete for the specific
          service (examples encountered repeatedly: piano tuners showing up for &ldquo;pipe organ
          repair,&rdquo; dentist offices showing up for &ldquo;dental equipment repair,&rdquo;
          thrift/clothing stores showing up for &ldquo;closet organization,&rdquo; truck weigh
          stations showing up for &ldquo;scale calibration,&rdquo; a replacement-window company
          showing up for &ldquo;historic window restoration.&rdquo; These are excluded from the
          competitive read entirely, regardless of review count.
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            <div className="bg-red-50 border border-red-200 rounded p-3">
              <p className="font-semibold text-red-800">GOOD</p>
              <p className="text-slate-600 mt-1">
                Only one of the top 3 sits in the ~50–100+ review range; the other two are well
                under 50. Winnable — fighting for #2/#3, which still means real leads.
              </p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded p-3">
              <p className="font-semibold text-amber-800">MODERATE</p>
              <p className="text-slate-600 mt-1">
                Two or all three of the top results sit at/above ~50–100 reviews. Harder, still
                possibly worth it.
              </p>
            </div>
            <div className="bg-slate-100 border border-slate-300 rounded p-3">
              <p className="font-semibold text-slate-800">AVOID</p>
              <p className="text-slate-600 mt-1">
                Real dominant incumbents (multiple in the hundreds), or a single wildly dominant
                outlier (200+) combined with a non-trivial #2/#3 too.
              </p>
            </div>
          </div>
        </li>
        <li>
          A franchise or company merely <em>claiming</em> to serve a wide area does not count
          against a niche — only what actually shows up with real reviews in that specific
          city&apos;s map pack counts.
        </li>
        <li>
          <strong>
            Every niche marked GOOD or MODERATE was tested in at least two different,
            comparably-sized towns in different regions of the country
          </strong>{" "}
          before being trusted — single-city results were repeatedly shown to be misleading in
          both directions (regional climate effects, cultural/historical depth of a trade in a
          given region, and town population size all change competition levels independently of
          the niche itself).
        </li>
        <li>
          Two extra failure modes to watch for, independent of review count:
          <ul className="list-disc list-outside pl-5 mt-2 space-y-2">
            <li>
              <strong>Channel mismatch</strong> — the map pack returns almost nothing relevant
              because real buyers of that service don&apos;t discover vendors through Google Maps
              at all (e.g. grain bin cleaning — farm co-ops source vendors through industry
              relationships, not search).
            </li>
            <li>
              <strong>Category collision</strong> — the search term itself returns an entirely
              different, unrelated business type (e.g. &ldquo;EV charger installation&rdquo;
              returning physical charging stations; &ldquo;tower clock repair&rdquo; returning
              consumer watch/jewelry shops).
            </li>
          </ul>
        </li>
      </ol>
      <p className="text-xs text-slate-500 pt-2 border-t">
        Population figures in the dataset are approximate (city-proper estimates, current as of
        mid-2026) — close enough for comparing town sizes, not meant to be authoritative census
        data.
      </p>
    </div>
  );
}
