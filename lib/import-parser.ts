import { NewListing, Tier, Verdict, TIERS, VERDICTS } from "./types";

export interface ParsedRow {
  line: number;
  raw: string;
  data: NewListing;
}

export interface ParseOutcome {
  rows: ParsedRow[];
  errors: string[];
}

const TIER_ALIASES: Record<string, Tier> = {
  "institutional": "Institutional/B2B",
  "institutional/b2b": "Institutional/B2B",
  "b2b": "Institutional/B2B",
  "small-business": "Small-Business",
  "small business": "Small-Business",
  "smallbiz": "Small-Business",
  "moderate": "Moderate (Tier 2)",
  "moderate (tier 2)": "Moderate (Tier 2)",
  "tier 2": "Moderate (Tier 2)",
  "avoid": "Avoid (Tier 3)",
  "avoid (tier 3)": "Avoid (Tier 3)",
  "tier 3": "Avoid (Tier 3)",
};

function normalizeTier(raw: string): Tier | null {
  if (!raw) return null;
  const key = raw.trim().toLowerCase();
  if (TIERS.includes(raw.trim() as Tier)) return raw.trim() as Tier;
  return TIER_ALIASES[key] ?? null;
}

function normalizeVerdict(raw: string): Verdict | null {
  const v = raw.trim().toUpperCase();
  return (VERDICTS as string[]).includes(v) ? (v as Verdict) : null;
}

// Expected pipe-delimited format, one listing per line:
// Niche | City | State | Population | Top-3 Reviews | Verdict | Tier | Notes
// Tier and Notes are optional (Tier defaults to "Small-Business").
// Population may be blank. Lines starting with "#" and a recognized header
// row are ignored.
export function parseImportText(text: string): ParseOutcome {
  const rows: ParsedRow[] = [];
  const errors: string[] = [];

  const lines = text.split(/\r?\n/);

  lines.forEach((rawLine, idx) => {
    const lineNum = idx + 1;
    const line = rawLine.trim();
    if (!line) return;
    if (line.startsWith("#")) return;

    const cells = line.split("|").map((c) => c.trim());
    if (cells[0]?.toLowerCase() === "niche") return; // header row

    if (cells.length < 6) {
      errors.push(
        `Line ${lineNum}: expected at least 6 fields (Niche | City | State | Population | Reviews | Verdict), found ${cells.length}. Skipped.`
      );
      return;
    }

    const [nicheRaw, cityRaw, stateRaw, popRaw, reviewsRaw, verdictRaw, tierRaw, ...notesParts] = cells;

    const niche = nicheRaw?.trim();
    const city = cityRaw?.trim();
    if (!niche || !city) {
      errors.push(`Line ${lineNum}: niche and city are required. Skipped.`);
      return;
    }

    const verdict = normalizeVerdict(verdictRaw ?? "");
    if (!verdict) {
      errors.push(
        `Line ${lineNum}: verdict "${verdictRaw}" is not one of GOOD, MODERATE, AVOID. Skipped.`
      );
      return;
    }

    const tier = normalizeTier(tierRaw ?? "") ?? "Small-Business";

    const popClean = (popRaw ?? "").replace(/[^0-9]/g, "");
    const population = popClean ? Number(popClean) : null;

    const data: NewListing = {
      niche,
      city,
      state: (stateRaw ?? "").trim() || null,
      population,
      reviews: (reviewsRaw ?? "").trim(),
      verdict,
      tier,
      notes: notesParts.join(" | ").trim(),
    };

    rows.push({ line: lineNum, raw: rawLine, data });
  });

  return { rows, errors };
}
