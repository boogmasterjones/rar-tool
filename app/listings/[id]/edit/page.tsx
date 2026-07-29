import { notFound } from "next/navigation";
import ListingForm from "../../ListingForm";
import { getListing } from "@/lib/db";
import { updateListingAction } from "@/lib/actions";

export default async function EditListingPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (Number.isNaN(id)) notFound();

  const listing = await getListing(id);
  if (!listing) notFound();

  const boundAction = updateListingAction.bind(null, id);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Edit Listing</h1>
      <ListingForm action={boundAction} initial={listing} submitLabel="Save Changes" />
    </div>
  );
}
