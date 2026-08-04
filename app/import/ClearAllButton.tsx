"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function ClearAllButton({
  count,
  action,
}: {
  count: number;
  action: () => Promise<void>;
}) {
  const [confirming, setConfirming] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  if (count === 0) {
    return <p className="text-sm text-slate-400">No listings to clear — the dataset is already empty.</p>;
  }

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="text-red-700 border border-red-300 bg-red-50 hover:bg-red-100 rounded px-3 py-1.5 text-sm font-medium"
      >
        Clear All {count} Listings
      </button>
    );
  }

  return (
    <div className="border border-red-300 bg-red-50 rounded-lg p-4 max-w-md">
      <p className="text-sm text-red-800 font-medium mb-2">
        This permanently deletes all {count} listings (including any stars). This can&apos;t be undone.
      </p>
      <p className="text-sm text-red-800 mb-2">
        Type <strong>DELETE</strong> below to confirm:
      </p>
      <input
        type="text"
        value={confirmText}
        onChange={(e) => setConfirmText(e.target.value)}
        disabled={pending}
        className="w-full border border-red-300 rounded px-2 py-1.5 text-sm mb-3"
        placeholder="DELETE"
        autoFocus
      />
      <div className="flex gap-3">
        <button
          type="button"
          disabled={confirmText !== "DELETE" || pending}
          onClick={() =>
            startTransition(async () => {
              await action();
              router.push("/");
              router.refresh();
            })
          }
          className="bg-red-700 text-white rounded px-3 py-1.5 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {pending ? "Clearing..." : "Permanently Delete Everything"}
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => {
            setConfirming(false);
            setConfirmText("");
          }}
          className="text-slate-600 text-sm hover:underline"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
