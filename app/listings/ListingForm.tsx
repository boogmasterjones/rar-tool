import { Listing, TIERS, VERDICTS } from "@/lib/types";

export default function ListingForm({
  action,
  initial,
  submitLabel,
}: {
  action: (formData: FormData) => Promise<void>;
  initial?: Partial<Listing>;
  submitLabel: string;
}) {
  return (
    <form action={action} className="bg-white border rounded-lg p-5 grid gap-4 max-w-2xl">
      <div>
        <label className="block text-sm font-medium mb-1">Niche *</label>
        <input
          name="niche"
          required
          defaultValue={initial?.niche ?? ""}
          className="w-full border rounded px-3 py-2 text-sm"
          placeholder="e.g. Pipe organ tuning/repair"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">City *</label>
          <input
            name="city"
            required
            defaultValue={initial?.city ?? ""}
            className="w-full border rounded px-3 py-2 text-sm"
            placeholder="e.g. Boise"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">State</label>
          <input
            name="state"
            defaultValue={initial?.state ?? ""}
            className="w-full border rounded px-3 py-2 text-sm"
            placeholder="e.g. ID"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Population (approx.)</label>
          <input
            name="population"
            defaultValue={initial?.population ?? ""}
            className="w-full border rounded px-3 py-2 text-sm"
            placeholder="e.g. 235000"
            inputMode="numeric"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Verdict *</label>
          <select
            name="verdict"
            defaultValue={initial?.verdict ?? "GOOD"}
            className="w-full border rounded px-3 py-2 text-sm"
          >
            {VERDICTS.map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Category *</label>
        <select
          name="tier"
          defaultValue={initial?.tier ?? "Small-Business"}
          className="w-full border rounded px-3 py-2 text-sm"
        >
          {TIERS.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Top-3 reviews *</label>
        <input
          name="reviews"
          required
          defaultValue={initial?.reviews ?? ""}
          className="w-full border rounded px-3 py-2 text-sm"
          placeholder="e.g. 0, 3, 8 (or a range / description)"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Notes</label>
        <textarea
          name="notes"
          defaultValue={initial?.notes ?? ""}
          rows={3}
          className="w-full border rounded px-3 py-2 text-sm"
          placeholder="Pollution risks, caveats, region-dependence, etc."
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" className="bg-slate-900 text-white rounded px-4 py-2 text-sm">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
