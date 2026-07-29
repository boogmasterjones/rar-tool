"use client";

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
  const bound = action.bind(null, id);
  return (
    <form
      action={bound}
      onSubmit={(e) => {
        if (!confirm(`Delete "${niche}" — ${city}? This can't be undone.`)) {
          e.preventDefault();
        }
      }}
      className="inline"
    >
      <button type="submit" className="text-red-600 text-sm hover:underline">
        Delete
      </button>
    </form>
  );
}
