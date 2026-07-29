"use client";

import { useFormState } from "react-dom";
import { previewImportAction, commitImportAction, ImportResult } from "@/lib/actions";

const initialState: ImportResult = { inserted: 0, errors: [], preview: [] };

export default function ImportForm() {
  const [previewState, previewAction] = useFormState(previewImportAction, initialState);
  const [commitState, commitFormAction] = useFormState(commitImportAction, initialState);

  const result = commitState.inserted > 0 ? commitState : previewState;
  const showingCommitResult = commitState.inserted > 0;

  return (
    <form className="grid gap-4">
      <textarea
        name="text"
        rows={10}
        className="w-full border rounded px-3 py-2 text-sm font-mono"
        placeholder={"Niche | City | State | Population | Top-3 Reviews | Verdict | Category | Notes\nGutter cleaning | Ocala | FL | 65000 | 3, 5, 9 | GOOD | Small-Business | Watch for pressure washers polluting results"}
      />
      <div className="flex gap-3">
        <button
          formAction={previewAction}
          className="bg-white border border-slate-900 text-slate-900 rounded px-4 py-2 text-sm"
        >
          Preview
        </button>
        <button
          formAction={commitFormAction}
          className="bg-slate-900 text-white rounded px-4 py-2 text-sm"
        >
          Import Now
        </button>
      </div>

      {result.errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded p-3 text-sm text-red-800">
          <p className="font-semibold mb-1">{result.errors.length} line(s) skipped:</p>
          <ul className="list-disc list-inside">
            {result.errors.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      {showingCommitResult && (
        <div className="bg-green-50 border border-green-200 rounded p-3 text-sm text-green-800">
          Imported {commitState.inserted} listing{commitState.inserted === 1 ? "" : "s"}. Go to{" "}
          <a href="/" className="underline">the dataset</a> to see them.
        </div>
      )}

      {!showingCommitResult && previewState.preview.length > 0 && (
        <div className="border rounded overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b">
              <tr className="text-left">
                <th className="px-2 py-1">Niche</th>
                <th className="px-2 py-1">City</th>
                <th className="px-2 py-1">State</th>
                <th className="px-2 py-1">Reviews</th>
                <th className="px-2 py-1">Verdict</th>
                <th className="px-2 py-1">Category</th>
              </tr>
            </thead>
            <tbody>
              {previewState.preview.map((r) => (
                <tr key={r.line} className="border-b last:border-0">
                  <td className="px-2 py-1">{r.data.niche}</td>
                  <td className="px-2 py-1">{r.data.city}</td>
                  <td className="px-2 py-1">{r.data.state ?? "—"}</td>
                  <td className="px-2 py-1">{r.data.reviews}</td>
                  <td className="px-2 py-1">{r.data.verdict}</td>
                  <td className="px-2 py-1">{r.data.tier}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-slate-500 px-2 py-2">
            {previewState.preview.length} row(s) parsed. Looks right? Click "Import Now" to save.
          </p>
        </div>
      )}
    </form>
  );
}
