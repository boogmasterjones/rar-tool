import ImportForm from "./ImportForm";

export default function ImportPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Bulk Import</h1>
      <p className="text-sm text-slate-600 mb-4 max-w-2xl">
        Paste one listing per line, fields separated by a pipe (<code>|</code>). Click{" "}
        <strong>Preview</strong> first to check parsing, then <strong>Import Now</strong> to save.
      </p>

      <div className="bg-white border rounded-lg p-4 mb-6 text-sm max-w-2xl">
        <p className="font-semibold mb-2">Format (one line per niche+city tested):</p>
        <pre className="bg-slate-50 border rounded p-3 overflow-x-auto text-xs whitespace-pre-wrap">
Niche | City | State | Population | Top-3 Reviews | Verdict | Category | Notes
        </pre>
        <ul className="list-disc list-inside mt-3 space-y-1 text-slate-600">
          <li><strong>Niche</strong> and <strong>City</strong> are required.</li>
          <li><strong>Verdict</strong> must be GOOD, MODERATE, or AVOID.</li>
          <li>
            <strong>Category</strong> is optional (defaults to Small-Business) — use Institutional/B2B,
            Small-Business, Moderate (Tier 2), or Avoid (Tier 3).
          </li>
          <li><strong>Population</strong> and <strong>Notes</strong> are optional and can be left blank.</li>
          <li>Lines starting with <code>#</code> are ignored, so you can leave the header row in place.</li>
        </ul>
        <p className="mt-3 font-semibold">Example:</p>
        <pre className="bg-slate-50 border rounded p-3 overflow-x-auto text-xs whitespace-pre-wrap">
{`# Niche | City | State | Population | Top-3 Reviews | Verdict | Category | Notes
Gutter cleaning | Ocala | FL | 65000 | 3, 5, 9 | GOOD | Small-Business | Watch for pressure washers polluting results
Boiler inspection | Manchester | NH | 115000 | 0, 2, 6 | GOOD | Institutional/B2B |`}
        </pre>
      </div>

      <ImportForm />
    </div>
  );
}
