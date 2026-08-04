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
    return client;
  }

  try {
    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    client = createClient({ url: `file:${path.join(dataDir, "local.db")}` });
    return client;
  } catch (err) {
    throw new Error(
      "No TURSO_DATABASE_URL is configured, and this environment's filesystem isn't writable " +
        "(expected on Netlify/Vercel/most serverless hosts — the local SQLite file fallback only " +
        "works for local development). Create a free Turso database and set TURSO_DATABASE_URL and " +
        "TURSO_AUTH_TOKEN as environment variables on your host, then redeploy. See SETUP.md for " +
        `exact steps. Original error: ${err instanceof Error ? err.message : String(err)}`
    );
  }
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

  // Databases from before the unique constraint existed may have accumulated
  // duplicate (niche, city) rows — e.g. concurrent serverless cold-starts
  // racing to seed an empty table at the same time. Clean those up before
  // adding the constraint, keeping a starred copy over an unstarred one.
  await dedupeByNicheCity(db);
  await db.execute(
    "CREATE UNIQUE INDEX IF NOT EXISTS idx_listings_niche_city ON listings(niche, city)"
  );

  // Tracks one-time setup facts (currently just "have we ever seeded the
  // starter dataset"), independent of the listings table's row count — a
  // deliberate "clear all" shouldn't cause the seed data to silently come
  // back the next time the table is empty.
  await db.execute("CREATE TABLE IF NOT EXISTS _meta (key TEXT PRIMARY KEY, value TEXT)");
  const seededRes = await db.execute({
    sql: "SELECT value FROM _meta WHERE key = 'seeded'",
    args: [],
  });
  if (seededRes.rows.length === 0) {
    for (const row of SEED_DATA) {
      // INSERT OR IGNORE (rather than a plain INSERT) means this is safe to
      // run from multiple concurrent cold starts without creating duplicates,
      // now that (niche, city) is a unique constraint.
      await db.execute({
        sql: `INSERT OR IGNORE INTO listings (niche, tier, city, state, population, reviews, verdict, notes)
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
    await db.execute({
      sql: "INSERT OR IGNORE INTO _meta (key, value) VALUES ('seeded', '1')",
      args: [],
    });
  }
}

async function dedupeByNicheCity(db: Client): Promise<void> {
  const res = await db.execute("SELECT id, niche, city, starred FROM listings ORDER BY id ASC");
  const groups = new Map<string, { id: number; starred: boolean }[]>();
  for (const row of res.rows) {
    const key = `${row.niche}|||${row.city}`;
    const entry = { id: Number(row.id), starred: Boolean(Number(row.starred ?? 0)) };
    const list = groups.get(key);
    if (list) list.push(entry);
    else groups.set(key, [entry]);
  }

  const idsToDelete: number[] = [];
  for (const group of groups.values()) {
    if (group.length <= 1) continue;
    const survivor = group.find((r) => r.starred) ?? group[0];
    for (const r of group) {
      if (r.id !== survivor.id) idsToDelete.push(r.id);
    }
  }

  for (const id of idsToDelete) {
    await db.execute({ sql: "DELETE FROM listings WHERE id = ?", args: [id] });
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
  // If this (niche, city) pair already exists, update it in place instead of
  // erroring on the unique constraint — matches the "hand it updated numbers
  // for something already tracked" workflow.
  const res = await client.execute({
    sql: `INSERT INTO listings (niche, tier, city, state, population, reviews, verdict, notes)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(niche, city) DO UPDATE SET
            tier = excluded.tier,
            state = excluded.state,
            population = excluded.population,
            reviews = excluded.reviews,
            verdict = excluded.verdict,
            notes = excluded.notes,
            updated_at = datetime('now')
          RETURNING *`,
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

export async function clearAllListings(): Promise<number> {
  const client = await db();
  const res = await client.execute("DELETE FROM listings");
  return res.rowsAffected;
}

export async function countListings(): Promise<number> {
  const client = await db();
  const res = await client.execute("SELECT COUNT(*) as c FROM listings");
  return Number(res.rows[0].c);
}

export async function bulkInsertListings(rows: NewListing[]): Promise<number> {
  const client = await db();
  let inserted = 0;
  for (const row of rows) {
    // Same upsert behavior as createListing: re-importing a (niche, city)
    // pair that's already tracked updates it with the new numbers instead of
    // erroring or creating a duplicate.
    await client.execute({
      sql: `INSERT INTO listings (niche, tier, city, state, population, reviews, verdict, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(niche, city) DO UPDATE SET
              tier = excluded.tier,
              state = excluded.state,
              population = excluded.population,
              reviews = excluded.reviews,
              verdict = excluded.verdict,
              notes = excluded.notes,
              updated_at = datetime('now')`,
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
