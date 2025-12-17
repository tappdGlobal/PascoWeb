# PASCO Bodyshop Dashboard — PascoWeb

Highlights in this release

- CSV/XLSX upload with header-mapper and per-user mapping presets.
- Upload pipeline that inserts rows into a RAW staging table and best-effort upserts into `jobs` (server-side profit calculation).
- Many UI screens replaced mock data with computations derived from persisted `jobs`.
- Supabase Auth scaffolding and profile handling; client forwards session Authorization tokens to server API endpoints.
- New job metadata persisted: labour, parts, bill amount, profit, group name, callback date (DB migration provided).
- Hardened server endpoints: mapping_presets, upload-csv, and jobs endpoints verify bearer tokens server-side before writing user-scoped data.

Quick start (dev)

1. Install dependencies

```bash
npm install
```

2. Run dev server

```bash
npm run dev
```

3. Open the app

Open http://localhost:3000 in your browser.

Build & test

```bash
npm run build
npm test
```

Required environment variables (recommended for production or full integration)

- VITE_SUPABASE_URL — your Supabase project URL
- VITE_SUPABASE_ANON_KEY — anon/public key (for client-side reads)
- SUPABASE_URL — server (service) URL (used by server-side pages)
- SUPABASE_SERVICE_ROLE_KEY — service-role key (server-only; keep secret)
- SUPABASE_TABLE_RAW — optional: name of RAW staging table (defaults to `bhiwani_service_jobs_raw`)

Database migrations

See `db/supabase_migrations.sql` for SQL that creates `mapping_presets`, `profiles`, `inventory`, and adds columns to the `jobs` table (labour_amt, part_amt, bill_amount, profit, group_name, callback_date, etc.). Apply these to your Supabase project before performing end-to-end uploads.

Notes & debugging

- A temporary runtime error overlay is installed in `src/main.tsx` during dev to surface uncaught exceptions in the browser. Remove it when no longer needed.
- If you get a white screen, open DevTools → Console and copy errors; many issues are caused by missing env vars or missing npm packages.

CI & release

This repository includes a GitHub Actions workflow at `.github/workflows/ci.yml` that runs install, build, and tests on `push` and `pull_request`.

Contact

If something behaves unexpectedly, please open an issue or reach out with the app logs and browser console output.
## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.
  
