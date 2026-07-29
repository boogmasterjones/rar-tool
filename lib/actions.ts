"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createListing,
  updateListing,
  deleteListing,
  bulkInsertListings,
  toggleStarred,
} from "./db";
import { NewListing, Tier, Verdict } from "./types";
import { parseImportText, ParsedRow } from "./import-parser";

function toNewListing(formData: FormData): NewListing {
  const populationRaw = String(formData.get("population") ?? "").trim();
  return {
    niche: String(formData.get("niche") ?? "").trim(),
    tier: String(formData.get("tier") ?? "Small-Business") as Tier,
    city: String(formData.get("city") ?? "").trim(),
    state: String(formData.get("state") ?? "").trim() || null,
    population: populationRaw ? Number(populationRaw.replace(/[^0-9]/g, "")) : null,
    reviews: String(formData.get("reviews") ?? "").trim(),
    verdict: String(formData.get("verdict") ?? "GOOD") as Verdict,
    notes: String(formData.get("notes") ?? "").trim(),
  };
}

export async function createListingAction(formData: FormData): Promise<void> {
  const data = toNewListing(formData);
  await createListing(data);
  revalidatePath("/");
  redirect("/");
}

export async function updateListingAction(id: number, formData: FormData): Promise<void> {
  const data = toNewListing(formData);
  await updateListing(id, data);
  revalidatePath("/");
  redirect("/");
}

export async function deleteListingAction(id: number): Promise<void> {
  await deleteListing(id);
  revalidatePath("/");
  revalidatePath("/niche");
}

export async function toggleStarredAction(id: number): Promise<void> {
  await toggleStarred(id);
  revalidatePath("/");
  revalidatePath("/niche");
}

export interface ImportResult {
  inserted: number;
  errors: string[];
  preview: ParsedRow[];
}

export async function previewImportAction(_prev: ImportResult | null, formData: FormData): Promise<ImportResult> {
  const text = String(formData.get("text") ?? "");
  const { rows, errors } = parseImportText(text);
  return { inserted: 0, errors, preview: rows };
}

export async function commitImportAction(_prev: ImportResult | null, formData: FormData): Promise<ImportResult> {
  const text = String(formData.get("text") ?? "");
  const { rows, errors } = parseImportText(text);
  if (rows.length > 0) {
    await bulkInsertListings(rows.map((r) => r.data));
    revalidatePath("/");
  }
  return { inserted: rows.length, errors, preview: [] };
}
