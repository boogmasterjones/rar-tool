# Setup & Deployment Guide

This app is a normal Next.js app with a SQLite-compatible database (via
[Turso](https://turso.tech), a free hosted SQLite service). Locally it just
writes to a `data/local.db` file — nothing to configure. To use it from your
phone anywhere (not just on your home WiFi), you deploy it to Vercel and point
it at a free Turso database instead.

## Running it locally (already working)

```bash
npm install
npm run dev
```

Then open http://localhost:3000. Data is stored in `data/local.db` in this
folder — delete that file if you ever want to reset back to the seed dataset.

## Deploying so you can use it from your phone anywhere

This is a one-time setup. Total cost: $0/month on the free tiers of both
services below.

### 1. Create a free Turso database

Install the Turso CLI (run in PowerShell):

```bash
irm get.tur.so/install.ps1 | iex
```

If that doesn't work, see https://docs.turso.tech/quickstart for the current
install command — installers occasionally change.

Then sign up and create a database:

```bash
turso auth signup
turso db create rank-and-rent-tool
```

Get the two values you'll need:

```bash
turso db show rank-and-rent-tool --url
turso db tokens create rank-and-rent-tool
```

The first command prints a URL starting with `libsql://...` — that's your
`TURSO_DATABASE_URL`. The second prints a long token — that's your
`TURSO_AUTH_TOKEN`. Save both somewhere.

### 2. Create a free Vercel account and deploy

Install the Vercel CLI and deploy from this folder:

```bash
npm install -g vercel
vercel login
vercel
```

Follow the prompts (accept the defaults — link to a new project). When it
asks about settings, just accept the detected Next.js settings.

### 3. Add your database credentials to Vercel

Either through the CLI:

```bash
vercel env add TURSO_DATABASE_URL production
vercel env add TURSO_AUTH_TOKEN production
```

(paste in the values from step 1 when prompted), or through the Vercel
dashboard: your project → **Settings → Environment Variables**.

### 4. Redeploy so the new env vars take effect

```bash
vercel --prod
```

You'll get a real URL (e.g. `rank-and-rent-tool.vercel.app`, or add your own
custom domain later in Vercel's dashboard). The first time it loads, the app
automatically creates the table and seeds it with the full dataset from the
briefing — same 125 rows you see locally.

### After that

Any time you `git push` (if you connect this folder to a GitHub repo through
Vercel's dashboard) or run `vercel --prod` again, it redeploys. Your data
lives in Turso, not in the deployment, so it's never wiped by a redeploy.

## Bulk import format reference

See the in-app "Bulk Import" page for the live version of this, but the
format is:

```
Niche | City | State | Population | Top-3 Reviews | Verdict | Category | Notes
```

- **Niche** and **City** are required.
- **Verdict** must be `GOOD`, `MODERATE`, or `AVOID`.
- **Category** is optional (defaults to `Small-Business`) — one of
  `Institutional/B2B`, `Small-Business`, `Moderate (Tier 2)`, `Avoid (Tier 3)`.
- **Population** and **Notes** are optional and can be left blank.
- Lines starting with `#` are ignored (handy for a header row).
