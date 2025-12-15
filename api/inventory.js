const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabaseAdmin;
function makeAdminStub(reason) {
  console.error('Supabase admin client unavailable:', reason);
  return {
    auth: { getUser: async () => ({ data: null, error: { message: reason } }) },
    from: () => ({ select: async () => ({ data: null, error: { message: reason } }) }),
  };
}

try {
  new URL(SUPABASE_URL);
  supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
} catch (err) {
  supabaseAdmin = makeAdminStub(String(err?.message || err));
}

async function verifyUserFromAuthHeader(req) {
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

module.exports = async function handler(req, res) {
  try {
    const user = await verifyUserFromAuthHeader(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    if (req.method === 'GET') {
      const { data, error } = await supabaseAdmin.from('inventory').select('*').limit(500);
      if (error) {
        console.error('Failed to fetch inventory', error);
        return res.status(500).json({ error });
      }
      return res.status(200).json({ data });
    }

    res.setHeader('Allow', 'GET');
    return res.status(405).end('Method not allowed');
  } catch (err) {
    console.error('api/inventory error', err);
    return res.status(500).json({ error: String(err) });
  }
};
