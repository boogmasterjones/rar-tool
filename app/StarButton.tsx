export default function StarButton({
  id,
  starred,
  action,
  size = "base",
}: {
  id: number;
  starred: boolean;
  action: (id: number) => Promise<void>;
  size?: "base" | "lg";
}) {
  const bound = action.bind(null, id);
  return (
    <form action={bound} className="inline">
      <button
        type="submit"
        title={starred ? "Unstar this listing" : "Star this listing"}
        aria-pressed={starred}
        className={`leading-none ${size === "lg" ? "text-xl" : "text-base"} ${
          starred ? "text-amber-500" : "text-slate-300 hover:text-slate-400"
        }`}
      >
        {starred ? "★" : "☆"}
      </button>
    </form>
  );
}
