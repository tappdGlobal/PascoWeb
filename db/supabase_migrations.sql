-- Supabase/Postgres migration statements for Pascobodyshopwebapp
-- Run these in the Supabase SQL editor or via psql against your database.

-- Ensure pgcrypto extension for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1) mapping_presets: store header mapping presets per user
CREATE TABLE IF NOT EXISTS mapping_presets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  mapping jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS mapping_presets_user_id_idx ON mapping_presets(user_id);

-- 2) profiles: user profile mirror/upsert table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  email text,
  phone text,
  metadata jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 3) inventory: optional inventory table used by the UI
CREATE TABLE IF NOT EXISTS inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  quantity int DEFAULT 0,
  min_required int DEFAULT 0,
  unit_price numeric(12,2),
  category text,
  supplier text,
  metadata jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS inventory_name_idx ON inventory(name);

-- 4) Jobs table alterations: add billing/profit and follow-up related fields
-- NOTE: replace `jobs` with your actual jobs table name if different.
ALTER TABLE IF EXISTS jobs
  ADD COLUMN IF NOT EXISTS labour_amt numeric(12,2),
  ADD COLUMN IF NOT EXISTS part_amt numeric(12,2),
  ADD COLUMN IF NOT EXISTS bill_amount numeric(12,2),
  ADD COLUMN IF NOT EXISTS profit numeric(12,2),
  ADD COLUMN IF NOT EXISTS group_name text,
  ADD COLUMN IF NOT EXISTS callback_date timestamptz,
  ADD COLUMN IF NOT EXISTS technician text,
  ADD COLUMN IF NOT EXISTS advisor text;

-- Optional: ensure queries by callback_date are efficient
CREATE INDEX IF NOT EXISTS jobs_callback_date_idx ON jobs(callback_date);

-- 5) quick_messages: optional templates for SMS/Call dialogs
CREATE TABLE IF NOT EXISTS quick_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  message text NOT NULL,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

-- Done. Review these changes before applying in production.
-- If your `jobs` table has a different schema or name, adapt the ALTER TABLE command accordingly.
