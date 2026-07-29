import { createClient, type Client } from "@libsql/client";
import fs from "fs";
import path from "path";
import { Listing, NewListing } from "./types";
import { SEED_DATA } from "./seed-data";

let client: Client | null = null;
let ready: Promise<void> | null = null;

function getClient(): Client {
  if (client) return client;

  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (url) {
    client = createClient({ url, authToken });
  } else {
    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    client = createClient({ url: `file:${path.join(dataDir, "local.db")}` });
  }
  return client;
}

async function init(): Promise<void> {
  const db = getClient();
  await db.execute(`
    CREATE TABLE IF NOT EXISTS listings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      niche TEXT NOT NULL,
      tier TEXT NOT NULL,
      city TEXT NOT NULL,
      state TEXT,
      population INTEGER,
      reviews TEXT NOT NULL DEFAULT '',
      verdict TEXT NOT NULL,
      notes TEXT NOT NULL DEFAULT '',
      starred INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  // Older databases created before "starred" existed won't have the column yet.
  const columns = await db.execute("PRAGMA table_info(listings)");
  const hasStarred = columns.rows.some((c) => c.name === "starred");
  if (!hasStarred) {
    await db.execute("ALTER TABLE listings ADD COLUMN starred INTEGER NOT NULL DEFAULT 0");
  }

  const countRes = await db.execute("SELECT COUNT(*) as c FROM listings");
  const count = Number(countRes.rows[0].c);
  if (count === 0) {
    for (const row of SEED_DATA) {
      await db.execute({
        sql: `INSERT INTO listings (niche, tier, city, state, population, reviews, verdict, notes)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          row.niche,
          row.tier,
          row.city,
          row.state,
          row.population,
          row.reviews,
          row.verdict,
          row.notes,
        ],
      });
    }
  }
}

async function db(): Promise<Client> {
  if (!ready) ready = init();
  await ready;
  return getClient();
}

export interface ListingFilters {
  verdict?: string;
  tier?: string;
  state?: string;
  q?: string;
  starred?: boolean;
  sort?: string;
  dir?: "asc" | "desc";
}

const SORTABLE_COLUMNS = new Set([
  "niche",
  "city",
  "state",
  "population",
  "verdict",
  "tier",
  "updated_at",
]);

export async function listListings(filters: ListingFilters = {}): Promise<Listing[]> {
  const client = await db();
  const clauses: string[] = [];
  const args: (string | number)[] = [];

  if (filters.verdict) {
    clauses.push("verdict = ?");
    args.push(filters.verdict);
  }
  if (filters.tier) {
    clauses.push("tier = ?");
    args.push(filters.tier);
  }
  if (filters.state) {
    clauses.push("state = ?");
    args.push(filters.state);
  }
  if (filters.q) {
    clauses.push("(niche LIKE ? OR city LIKE ? OR notes LIKE ?)");
    const like = `%${filters.q}%`;
    args.push(like, like, like);
  }
  if (filters.starred) {
    clauses.push("starred = 1");
  }

  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  const sortCol = filters.sort && SORTABLE_COLUMNS.has(filters.sort) ? filters.sort : "niche";
  const dir = filters.dir === "desc" ? "DESC" : "ASC";

  const res = await client.execute({
    sql: `SELECT * FROM listings ${where} ORDER BY ${sortCol} ${dir}, city ASC`,
    args,
  });

  return res.rows.map(rowToListing);
}

export async function getListingsByNiche(niche: string): Promise<Listing[]> {
  const client = await db();
  const res = await client.execute({
    sql: "SELECT * FROM listings WHERE niche = ? ORDER BY city ASC",
    args: [niche],
  });
  return res.rows.map(rowToListing);
}

export async function getListing(id: number): Promise<Listing | null> {
  const client = await db();
  const res = await client.execute({
    sql: "SELECT * FROM listings WHERE id = ?",
    args: [id],
  });
  if (res.rows.length === 0) return null;
  return rowToListing(res.rows[0]);
}

export async function createListing(data: NewListing): Promise<Listing> {
  const client = await db();
  const res = await client.execute({
    sql: `INSERT INTO listings (niche, tier, city, state, population, reviews, verdict, notes)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?) RETURNING *`,
    args: [
      data.niche,
      data.tier,
      data.city,
      data.state,
      data.population,
      data.reviews,
      data.verdict,
      data.notes,
    ],
  });
  return rowToListing(res.rows[0]);
}

export async function updateListing(id: number, data: NewListing): Promise<Listing | null> {
  const client = await db();
  const res = await client.execute({
    sql: `UPDATE listings SET niche = ?, tier = ?, city = ?, state = ?, population = ?,
          reviews = ?, verdict = ?, notes = ?, updated_at = datetime('now')
          WHERE id = ? RETURNING *`,
    args: [
      data.niche,
      data.tier,
      data.city,
      data.state,
      data.population,
      data.reviews,
      data.verdict,
      data.notes,
      id,
    ],
  });
  if (res.rows.length === 0) return null;
  return rowToListing(res.rows[0]);
}

export async function toggleStarred(id: number): Promise<Listing | null> {
  const client = await db();
  const res = await client.execute({
    sql: `UPDATE listings SET starred = NOT starred WHERE id = ? RETURNING *`,
    args: [id],
  });
  if (res.rows.length === 0) return null;
  return rowToListing(res.rows[0]);
}

export async function deleteListing(id: number): Promise<boolean> {
  const client = await db();
  const res = await client.execute({
    sql: "DELETE FROM listings WHERE id = ?",
    args: [id],
  });
  return res.rowsAffected > 0;
}

export async function bulkInsertListings(rows: NewListing[]): Promise<number> {
  const client = await db();
  let inserted = 0;
  for (const row of rows) {
    await client.execute({
      sql: `INSERT INTO listings (niche, tier, city, state, population, reviews, verdict, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        row.niche,
        row.tier,
        row.city,
        row.state,
        row.population,
        row.reviews,
        row.verdict,
        row.notes,
      ],
    });
    inserted++;
  }
  return inserted;
}

export async function distinctStates(): Promise<string[]> {
  const client = await db();
  const res = await client.execute(
    "SELECT DISTINCT state FROM listings WHERE state IS NOT NULL AND state != '' ORDER BY state ASC"
  );
  return res.rows.map((r) => String(r.state));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToListing(row: any): Listing {
  return {
    id: Number(row.id),
    niche: String(row.niche),
    tier: row.tier,
    city: String(row.city),
    state: row.state ? String(row.state) : null,
    population: row.population === null || row.population === undefined ? null : Number(row.population),
    reviews: String(row.reviews ?? ""),
    verdict: row.verdict,
    notes: String(row.notes ?? ""),
    starred: Boolean(Number(row.starred ?? 0)),
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}
