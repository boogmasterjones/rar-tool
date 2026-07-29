import ListingForm from "../ListingForm";
import { createListingAction } from "@/lib/actions";

export default function NewListingPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Add Listing</h1>
      <ListingForm action={createListingAction} submitLabel="Create Listing" />
    </div>
  );
}
