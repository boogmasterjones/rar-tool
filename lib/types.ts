export type Verdict = "GOOD" | "MODERATE" | "AVOID";

export type Tier =
  | "Institutional/B2B"
  | "Small-Business"
  | "Moderate (Tier 2)"
  | "Avoid (Tier 3)";

export interface Listing {
  id: number;
  niche: string;
  tier: Tier;
  city: string;
  state: string | null;
  population: number | null;
  reviews: string;
  verdict: Verdict;
  notes: string;
  created_at: string;
  updated_at: string;
}

export type NewListing = Omit<Listing, "id" | "created_at" | "updated_at">;

export const TIERS: Tier[] = [
  "Institutional/B2B",
  "Small-Business",
  "Moderate (Tier 2)",
  "Avoid (Tier 3)",
];

export const VERDICTS: Verdict[] = ["GOOD", "MODERATE", "AVOID"];
