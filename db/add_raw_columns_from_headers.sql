-- db/add_raw_columns_from_headers.sql
-- Add commonly-seen columns from uploaded CSV headers to the RAW table.
-- Run this in Supabase SQL editor or via supabase CLI.

ALTER TABLE IF EXISTS public.bhiwani_service_jobs_raw
-- identification / text
ADD COLUMN IF NOT EXISTS srl_no TEXT,
ADD COLUMN IF NOT EXISTS dealer_name TEXT,
ADD COLUMN IF NOT EXISTS dealer_city TEXT,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS registration_no TEXT,
ADD COLUMN IF NOT EXISTS registration_no_1 TEXT,
ADD COLUMN IF NOT EXISTS bill_no TEXT,
ADD COLUMN IF NOT EXISTS bill_no_1 TEXT,
ADD COLUMN IF NOT EXISTS job_card_number TEXT,
ADD COLUMN IF NOT EXISTS chassis TEXT,
ADD COLUMN IF NOT EXISTS engine_num TEXT,
ADD COLUMN IF NOT EXISTS model TEXT,
ADD COLUMN IF NOT EXISTS variant TEXT,
ADD COLUMN IF NOT EXISTS color TEXT,
ADD COLUMN IF NOT EXISTS vehicle_model TEXT,

-- contact / customer
ADD COLUMN IF NOT EXISTS customer_name TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS mobile_no TEXT,
ADD COLUMN IF NOT EXISTS customer_mobile TEXT,
ADD COLUMN IF NOT EXISTS customer_catg TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,

-- addresses
ADD COLUMN IF NOT EXISTS address1 TEXT,
ADD COLUMN IF NOT EXISTS address2 TEXT,
ADD COLUMN IF NOT EXISTS address3 TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS pin TEXT,

-- billing / amounts
ADD COLUMN IF NOT EXISTS estlab_amt NUMERIC,
ADD COLUMN IF NOT EXISTS estpart_amt NUMERIC,
ADD COLUMN IF NOT EXISTS rev_est_part_amt NUMERIC,
ADD COLUMN IF NOT EXISTS rev_est_lab_amt NUMERIC,
ADD COLUMN IF NOT EXISTS labour_amt NUMERIC,
ADD COLUMN IF NOT EXISTS part_amt NUMERIC,
ADD COLUMN IF NOT EXISTS bill_amount NUMERIC,
ADD COLUMN IF NOT EXISTS profit NUMERIC,

-- dates / timestamps
ADD COLUMN IF NOT EXISTS jc_date_time timestamptz,
ADD COLUMN IF NOT EXISTS sale_date timestamptz,
ADD COLUMN IF NOT EXISTS promised_dt timestamptz,
ADD COLUMN IF NOT EXISTS rev_promised_dt timestamptz,
ADD COLUMN IF NOT EXISTS ready_date_time timestamptz,
ADD COLUMN IF NOT EXISTS pickup_date timestamptz,
ADD COLUMN IF NOT EXISTS bill_date timestamptz,
ADD COLUMN IF NOT EXISTS dob timestamptz,
ADD COLUMN IF NOT EXISTS doa timestamptz,
ADD COLUMN IF NOT EXISTS chkin_dt timestamptz,
ADD COLUMN IF NOT EXISTS created_at timestamptz,
ADD COLUMN IF NOT EXISTS updated_at timestamptz,
ADD COLUMN IF NOT EXISTS callback_date timestamptz,
ADD COLUMN IF NOT EXISTS app_sent_date timestamptz,
ADD COLUMN IF NOT EXISTS app_rej_date timestamptz,

-- misc
ADD COLUMN IF NOT EXISTS service_type TEXT,
ADD COLUMN IF NOT EXISTS repeat_revisit TEXT,
ADD COLUMN IF NOT EXISTS psf_status TEXT,
ADD COLUMN IF NOT EXISTS circular_no TEXT,
ADD COLUMN IF NOT EXISTS jc_source TEXT,
ADD COLUMN IF NOT EXISTS approval_status TEXT,
ADD COLUMN IF NOT EXISTS cust_remarks TEXT,
ADD COLUMN IF NOT EXISTS dlr_remarks TEXT,
ADD COLUMN IF NOT EXISTS status TEXT,
ADD COLUMN IF NOT EXISTS pickup_required TEXT,
ADD COLUMN IF NOT EXISTS pickup_location TEXT,
ADD COLUMN IF NOT EXISTS mileage TEXT;

-- ------------------------------
-- Ensure `raw` is never NULL (coerce to empty jsonb) and make
-- several commonly-nullable columns actually nullable.
-- This block is safe to run repeatedly.
-- ------------------------------

-- Make `raw` temporarily nullable so we can update existing rows.
ALTER TABLE IF EXISTS public.bhiwani_service_jobs_raw
ALTER COLUMN raw DROP NOT NULL;

-- Create trigger function to coerce NULL -> '{}'::jsonb for raw
CREATE OR REPLACE FUNCTION public.ensure_raw_not_null()
RETURNS trigger AS $$
BEGIN
	IF NEW.raw IS NULL THEN
		NEW.raw := '{}'::jsonb;
	END IF;
	RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach trigger (idempotent)
DROP TRIGGER IF EXISTS ensure_raw_not_null_trg ON public.bhiwani_service_jobs_raw;
CREATE TRIGGER ensure_raw_not_null_trg
BEFORE INSERT OR UPDATE ON public.bhiwani_service_jobs_raw
FOR EACH ROW EXECUTE FUNCTION public.ensure_raw_not_null();

-- Update existing rows with NULL raw
UPDATE public.bhiwani_service_jobs_raw
SET raw = '{}'::jsonb
WHERE raw IS NULL;

-- Set default and re-enable NOT NULL on raw
ALTER TABLE IF EXISTS public.bhiwani_service_jobs_raw
ALTER COLUMN raw SET DEFAULT '{}'::jsonb;

-- Re-enable NOT NULL (trigger makes this safe)
ALTER TABLE IF EXISTS public.bhiwani_service_jobs_raw
ALTER COLUMN raw SET NOT NULL;

-- Make list of columns explicitly nullable (if they exist)
DO $$
DECLARE
	col TEXT;
	cols TEXT[] := ARRAY[
		'repeat_revisit', 'phone', 'customer_catg', 'circular_no',
		'app_sent_date', 'app_rej_date', 'cust_remarks', 'dlr_remarks',
		'pickup_date', 'pickup_location', 'address2', 'address3',
		'dob', 'doa'
	];
BEGIN
	FOREACH col IN ARRAY cols LOOP
		IF EXISTS (
			SELECT 1 FROM information_schema.columns
			WHERE table_schema = 'public'
				AND table_name = 'bhiwani_service_jobs_raw'
				AND column_name = col
		) THEN
			EXECUTE format('ALTER TABLE public.bhiwani_service_jobs_raw ALTER COLUMN %I DROP NOT NULL', col);
		END IF;
	END LOOP;
END
$$;

-- Add a source_hash column to enable idempotent uploads and deduplication
ALTER TABLE IF EXISTS public.bhiwani_service_jobs_raw
ADD COLUMN IF NOT EXISTS source_hash TEXT;

-- Create a unique index on source_hash for deduplication (only when not null)
CREATE UNIQUE INDEX IF NOT EXISTS idx_bhiwani_raw_source_hash
ON public.bhiwani_service_jobs_raw (source_hash)
WHERE source_hash IS NOT NULL;

