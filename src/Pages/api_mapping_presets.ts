import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing Supabase env vars for mapping_presets API");
}

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Helper to verify a user by access token passed in Authorization header
async function verifyUserFromAuthHeader(req: any) {
  const auth = req.headers.authorization || req.headers.Authorization;
  if (!auth || typeof auth !== 'string') return null;
  const parts = auth.split(' ');
  if (parts.length !== 2) return null;
  const token = parts[1];
  try {
    const { data, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !data) return null;
    return data.user;
  } catch (err) {
    return null;
  }
}

export default async function handler(req: any, res: any) {
  try {
    // verify user via Authorization bearer token
    const user = await verifyUserFromAuthHeader(req);
    if (!user) return res.status(401).json({ error: 'Invalid or missing Authorization token' });

    if (req.method === 'POST') {
      const { name, mapping } = req.body as { name?: string; mapping: Record<string,string> };
      if (!mapping) return res.status(400).json({ error: 'mapping required' });
      const payload = { user_id: user.id, name: name || 'default', mapping, created_at: new Date().toISOString() } as any;
      const { error } = await supabaseAdmin.from('mapping_presets').upsert([payload]);
      if (error) return res.status(500).json({ error });
      return res.status(200).json({ ok: true });
    }

    if (req.method === 'GET') {
      const { data, error } = await supabaseAdmin.from('mapping_presets').select('*').eq('user_id', user.id);
      if (error) return res.status(500).json({ error });
      return res.status(200).json({ presets: data || [] });
    }

    res.setHeader('Allow', 'GET,POST');
    return res.status(405).end('Method not allowed');
  } catch (err: any) {
    console.error('mapping_presets handler error', err);
    return res.status(500).json({ error: err.message || String(err) });
  }
}
