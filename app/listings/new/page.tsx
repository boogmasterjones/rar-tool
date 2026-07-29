import ListingForm from "../ListingForm";
import { createListingAction } from "@/lib/actions";
import { Tier } from "@/lib/types";

export default function NewListingPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const niche = typeof searchParams.niche === "string" ? searchParams.niche : undefined;
  const tier = typeof searchParams.tier === "string" ? (searchParams.tier as Tier) : undefined;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Add Listing</h1>
      <ListingForm
        action={createListingAction}
        submitLabel="Create Listing"
        initial={niche ? { niche, tier } : undefined}
      />
    </div>
  );
}
