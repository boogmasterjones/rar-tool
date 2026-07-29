"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function DeleteButton({
  id,
  action,
  niche,
  city,
}: {
  id: number;
  action: (id: number) => Promise<void>;
  niche: string;
  city: string;
}) {
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="text-red-600 text-sm hover:underline"
      >
        Delete
      </button>
    );
  }

  return (
    <span className="inline-flex items-center gap-2 text-sm whitespace-nowrap">
      <span className="text-slate-500">Delete {niche} — {city}?</span>
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            await action(id);
            router.refresh();
          })
        }
        className="text-red-600 font-semibold hover:underline disabled:opacity-50"
      >
        {pending ? "Deleting..." : "Yes"}
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() => setConfirming(false)}
        className="text-slate-500 hover:underline"
      >
        No
      </button>
    </span>
  );
}
