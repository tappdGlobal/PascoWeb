import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export default async function handler(req: any, res: any) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(500).json({ ok: false, error: 'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment' });
  }

  try {
    let supabaseAdmin: any;
    try {
      new URL(SUPABASE_URL);
      supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    } catch (err: any) {
      return res.status(500).json({ ok: false, error: 'Invalid SUPABASE_URL or missing SUPABASE_SERVICE_ROLE_KEY', details: String(err?.message || err) });
    }

    // Try a light-weight read from mapping_presets (if present) to validate connectivity
    const { data, error } = await supabaseAdmin.from('mapping_presets').select('id').limit(1);
    if (error) {
      return res.status(500).json({ ok: false, error: 'Supabase query failed', details: error });
    }
    return res.status(200).json({ ok: true, sampleRows: (data && data.length) || 0 });
  } catch (err: any) {
    return res.status(500).json({ ok: false, error: String(err) });
  }
}
