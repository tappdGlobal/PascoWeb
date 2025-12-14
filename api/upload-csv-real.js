// Serverless JS implementation that persists uploaded rows to Supabase.
// Expects environment variables: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
// Frontend should POST JSON: { rows: [ {...}, ... ], mapping?: { origHeader: canonicalKey } }

module.exports = async (req, res) => {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res.status(405).end('Method not allowed');
    }

    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const SUPABASE_TABLE_RAW = process.env.SUPABASE_TABLE_RAW || 'bhiwani_service_jobs_raw';

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment');
      return res.status(500).json({ error: 'Server misconfigured: missing Supabase env vars' });
    }

    const { createClient } = await import('@supabase/supabase-js');
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const body = req.body || {};
    const rows = Array.isArray(body.rows) ? body.rows : [];
    const mapping = body.mapping || undefined;

    if (!rows.length) return res.status(400).json({ error: 'No rows provided' });

    // Helper: sanitize header keys (simple)
    const sanitizeHeader = (h) => String(h || '').trim().replace(/\r|\n/g, '').replace(/\s+/g, '_').replace(/[^\w_]/g, '').toLowerCase();
    const cleanValue = (v) => { if (v === null || v === undefined) return null; const s = String(v).trim(); if (s === '' || s.toLowerCase() === 'null') return null; return s; };

    const mapped = rows.map((row) => {
      const out = {};
      for (const k of Object.keys(row)) out[sanitizeHeader(k)] = cleanValue(row[k]);
      return out;
    });

    // Insert into RAW table in batches
    const batchSize = 500;
    let insertedCount = 0;
    const errors = [];
    for (let i = 0; i < mapped.length; i += batchSize) {
      const batch = mapped.slice(i, i + batchSize);
      const { error } = await supabaseAdmin.from(SUPABASE_TABLE_RAW).insert(batch, { returning: 'minimal' });
      if (error) {
        console.error('Supabase RAW insert error:', error);
        errors.push({ batchStart: i, error });
      } else {
        insertedCount += batch.length;
      }
    }

    // NOTE: this endpoint writes to RAW table. If you want automatic upsert into `jobs`,
    // we can add mapping & upsert logic here (requires careful column mapping and ids).

    return res.status(200).json({ insertedCount, errors });
  } catch (err) {
    console.error('upload-csv-real error', err);
    return res.status(500).json({ error: String(err) });
  }
};
