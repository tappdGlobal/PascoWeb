const { createClient } = require('@supabase/supabase-js');
const { toSnakeCaseKeyMap } = require('../src/utils/csvMapping');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabaseAdmin;
function makeAdminStub(reason) {
  console.error('Supabase admin client unavailable:', reason);
  return {
    auth: { getUser: async () => ({ data: null, error: { message: reason } }) },
    from: () => ({ select: async () => ({ data: null, error: { message: reason } }) }),
    rpc: async () => ({ data: null, error: { message: reason } }),
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

function toNumber(v) {
  if (v === null || v === undefined) return null;
  const n = Number(String(v).replace(/[^0-9.-]/g, ''));
  return Number.isFinite(n) ? n : null;
}

module.exports = async function handler(req, res) {
  try {
    const user = await verifyUserFromAuthHeader(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    if (req.method === 'GET') {
      const { data, error } = await supabaseAdmin.from('jobs').select('*');
      if (error) {
        console.error('Failed to fetch jobs', error);
        return res.status(500).json({ error });
      }
      return res.status(200).json({ data });
    }

    if (req.method === 'POST') {
      const job = (req.body && req.body.job) || null;
      if (!job) return res.status(400).json({ error: 'job required' });

      const labour = toNumber(job.labourAmt ?? job.labour_amt ?? job.labourAmount ?? 0) || 0;
      const part = toNumber(job.partAmt ?? job.part_amt ?? job.partAmount ?? 0) || 0;
      const bill = toNumber(job.billAmount ?? job.bill_amount ?? job.bill ?? 0) || 0;
      const profit = bill !== null ? (bill - (labour + part)) : null;

      const payload = Object.assign({}, job, {
        labourAmt: labour,
        partAmt: part,
        billAmount: bill,
        profit,
        groupName: job.groupName ?? job.group_name ?? null,
        callbackDate: job.callbackDate ?? job.callback_date ?? job.followUpDate ?? null,
        createdBy: user.id,
        updatedAt: new Date().toISOString(),
      });

      const payloadSnake = toSnakeCaseKeyMap(payload);
      payloadSnake.payload = payload;
      const { error } = await supabaseAdmin.from('jobs').upsert([payloadSnake], { returning: 'minimal' });
      if (error) {
        console.error('Failed to upsert job', error);
        return res.status(500).json({ error });
      }
      return res.status(200).json({ ok: true });
    }

    if (req.method === 'PATCH') {
      const { id, updates } = req.body || {};
      if (!id || !updates) return res.status(400).json({ error: 'id and updates required' });

      const labour = toNumber(updates.labourAmt ?? updates.labour_amt ?? 0);
      const part = toNumber(updates.partAmt ?? updates.part_amt ?? 0);
      const bill = toNumber(updates.billAmount ?? updates.bill_amount ?? 0);
      const profit = (bill !== null) ? (bill - ((labour || 0) + (part || 0))) : undefined;

      const payload = Object.assign({}, updates, {
        labourAmt: labour ?? undefined,
        partAmt: part ?? undefined,
        billAmount: bill ?? undefined,
        profit: profit ?? undefined,
        updatedAt: new Date().toISOString(),
      });

      const payloadSnake = toSnakeCaseKeyMap(payload);
      payloadSnake.payload = payload;
      const { error } = await supabaseAdmin.from('jobs').update(payloadSnake).eq('id', id);
      if (error) return res.status(500).json({ error });
      return res.status(200).json({ ok: true });
    }

    res.setHeader('Allow', 'GET,POST,PATCH');
    return res.status(405).end('Method not allowed');
  } catch (err) {
    console.error('api/jobs error', err);
    return res.status(500).json({ error: String(err) });
  }
};
