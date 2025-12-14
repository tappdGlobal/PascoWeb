import { createClient } from "@supabase/supabase-js";
import { sanitizeHeader, mapRowToRaw, cleanValue, toSnakeCaseKeyMap } from "../src/utils/csvMapping";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const SUPABASE_TABLE_RAW = process.env.SUPABASE_TABLE_RAW || "bhiwani_service_jobs_raw";

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing Supabase env vars (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)");
}

// Create a guarded admin client. If env vars are missing or malformed, fall back
// to a stub that surfaces clear errors instead of throwing at module init time.
let supabaseAdmin: any;
function makeAdminStub(reason: string) {
  console.error("Supabase admin client unavailable:", reason);
  return {
    auth: { getUser: async (_: any) => ({ data: null, error: { message: reason } }) },
    from: (_: string) => ({
      select: async () => ({ data: null, error: { message: reason } }),
      insert: async () => ({ data: null, error: { message: reason } }),
      upsert: async () => ({ data: null, error: { message: reason } }),
      update: async () => ({ data: null, error: { message: reason } }),
      delete: async () => ({ data: null, error: { message: reason } }),
    }),
    rpc: async () => ({ data: null, error: { message: reason } }),
  };
}

try {
  // validate URL format early
  new URL(SUPABASE_URL);
  supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
} catch (err: any) {
  supabaseAdmin = makeAdminStub(String(err?.message || err || 'Invalid SUPABASE_URL or missing SERVICE_ROLE_KEY'));
}

// Helper to verify a user by access token passed in Authorization header
async function verifyUserFromAuthHeader(req: any) {
  const auth = req.headers.authorization || req.headers.Authorization;
  if (!auth || typeof auth !== 'string') {
    console.warn('verifyUserFromAuthHeader: missing Authorization header');
    return null;
  }
  const parts = auth.split(' ');
  if (parts.length !== 2) return null;
  const token = parts[1];
  try {
    const { data, error } = await supabaseAdmin.auth.getUser(token);
    if (error) {
      console.error('verifyUserFromAuthHeader: supabase getUser returned error', error);
      return null;
    }
    if (!data) {
      console.warn('verifyUserFromAuthHeader: supabase getUser returned no data');
      return null;
    }
    return data.user;
  } catch (err) {
    console.error('verifyUserFromAuthHeader: unexpected error', err);
    return null;
  }
}

export default async function handler(req: any, res: any) {
  try {
    console.log('api/upload-csv called', { method: req.method, headers: { authorization: !!(req.headers && (req.headers.authorization || req.headers.Authorization)) }, bodyKeys: req.body ? Object.keys(req.body) : null });
  } catch (e) {
    console.warn('failed to log request metadata', e);
  }
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Method not allowed");
  }

  try {
    const { rows } = req.body as { rows?: any[] };
    if (!rows || !Array.isArray(rows) || rows.length === 0) {
      return res.status(400).json({ error: "No rows provided" });
    }

    const user = await verifyUserFromAuthHeader(req as any);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const mapped = rows.map(mapRowToRaw);
    const mapping: Record<string, string> | undefined = (req.body && req.body.mapping) || undefined;

    function valueForCanonical(mappedRow: Record<string, any>, canonicalKey: string) {
      if (!mapping) return mappedRow[canonicalKey] ?? mappedRow[canonicalKey.replace(/_/g, "_")];
      const foundOrig = Object.keys(mapping).find((orig) => mapping[orig] === canonicalKey);
      if (!foundOrig) return mappedRow[canonicalKey] ?? null;
      const sanitized = sanitizeHeader(foundOrig);
      return mappedRow[sanitized];
    }

    const batchSize = 500;
    const errors: any[] = [];
    let insertedCount = 0;
    for (let i = 0; i < mapped.length; i += batchSize) {
      const batch = mapped.slice(i, i + batchSize);
      const { data, error } = await supabaseAdmin
        .from(SUPABASE_TABLE_RAW)
        .insert(batch, { returning: "minimal" });
      if (error) {
        console.error("Supabase insert error:", error);
        errors.push({ batchStart: i, error });
      } else {
        insertedCount += batch.length;
      }
    }

    try {
      const jobsToInsert: any[] = [];
      for (const r of mapped) {
        const job: any = {};
        const idVal = valueForCanonical(r, 'job_card_no') || valueForCanonical(r, 'bill_no') || `job-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
        job.id = idVal;
        job.jobCardNumber = valueForCanonical(r, 'job_card_no') ?? valueForCanonical(r, 'bill_no') ?? job.id;
        job.regNo = valueForCanonical(r, 'registration_no') ?? null;
        job.model = valueForCanonical(r, 'model') ?? null;
        job.color = valueForCanonical(r, 'color') ?? null;
        job.customerName = valueForCanonical(r, 'customer_name') ?? valueForCanonical(r, 'customer') ?? null;
        job.customerMobile = valueForCanonical(r, 'mobile_no') ?? valueForCanonical(r, 'phone') ?? null;
        const st = valueForCanonical(r, 'service_type') ?? undefined;
        job.jobType = (st && ['Insurance','Cash','Warranty'].includes(st)) ? st : 'Cash';
        job.advisor = valueForCanonical(r, 'sa') ?? valueForCanonical(r, 'advisor') ?? null;
        job.technician = valueForCanonical(r, 'technician') ?? null;
        job.status = valueForCanonical(r, 'status') ?? 'Service';
        job.currentStage = 'Job Created';
        job.completedStages = [];
        job.notes = [];
        job.callLogs = [];
        job.services = [];
        job.activityLog = [];
        const labour = valueForCanonical(r, 'labour_amt') ?? valueForCanonical(r, 'est_lab_amt') ?? valueForCanonical(r, 'labouramt') ?? null;
        const part = valueForCanonical(r, 'part_amt') ?? valueForCanonical(r, 'est_part_amt') ?? valueForCanonical(r, 'partamt') ?? null;
        const bill = valueForCanonical(r, 'bill_amount') ?? valueForCanonical(r, 'bill') ?? null;
        job.labourAmt = labour ? Number(String(labour).replace(/[^0-9.-]/g, '')) : null;
        job.partAmt = part ? Number(String(part).replace(/[^0-9.-]/g, '')) : null;
        job.billAmount = bill ? Number(String(bill).replace(/[^0-9.-]/g, '')) : null;
        job.profit = (job.billAmount != null) ? (job.billAmount - ((job.labourAmt || 0) + (job.partAmt || 0))) : null;
        job.createdAt = valueForCanonical(r, 'jc_date_time') ?? valueForCanonical(r, 'created_at') ?? new Date().toISOString();
        job.updatedAt = new Date().toISOString();
        job.arrivalDate = valueForCanonical(r, 'jc_date_time') ?? null;
        job.followUpDate = valueForCanonical(r, 'callback_date') ?? valueForCanonical(r, 'follow_up_date') ?? null;
        job.groupName = valueForCanonical(r, 'group') ?? valueForCanonical(r, 'group_name') ?? null;
        job.createdBy = user.id;
        job.dealerName = valueForCanonical(r, 'dealer_name') ?? null;
        job.dealerCity = valueForCanonical(r, 'dealer_city') ?? null;
        job.location = valueForCanonical(r, 'location') ?? null;
        job.chassis = valueForCanonical(r, 'chassis') ?? null;
        job.engineNum = valueForCanonical(r, 'engine_num') ?? null;
        job.variant = valueForCanonical(r, 'variant') ?? null;
        job.saleDate = valueForCanonical(r, 'sale_date') ?? null;
        job.circularNo = valueForCanonical(r, 'circular_no') ?? null;
        job.mileage = valueForCanonical(r, 'mileage') ?? null;
        job.promisedDt = valueForCanonical(r, 'promised_dt') ?? null;
        job.readyDateTime = valueForCanonical(r, 'ready_date_time') ?? null;
        job.jcSource = valueForCanonical(r, 'jc_source') ?? null;
        job.approvalStatus = valueForCanonical(r, 'approval_status') ?? null;
        job.custRemarks = valueForCanonical(r, 'cust_remarks') ?? null;
        job.dlrRemarks = valueForCanonical(r, 'dlr_remarks') ?? null;
        job.pickupRequired = valueForCanonical(r, 'pickup_required') ?? null;
        job.pickupDate = valueForCanonical(r, 'pickup_date') ?? null;
        job.pickupLocation = valueForCanonical(r, 'pickup_location') ?? null;
        job.address1 = valueForCanonical(r, 'address1') ?? null;
        job.address2 = valueForCanonical(r, 'address2') ?? null;
        job.address3 = valueForCanonical(r, 'address3') ?? null;
        job.city = valueForCanonical(r, 'city') ?? null;
        job.pin = valueForCanonical(r, 'pin') ?? null;
        job.dob = valueForCanonical(r, 'dob') ?? null;
        job.doa = valueForCanonical(r, 'doa') ?? null;
        job.email = valueForCanonical(r, 'email') ?? null;
        job.chkin_dt = valueForCanonical(r, 'chkin_dt') ?? null;
        jobsToInsert.push(job);
      }

      const jobsSnake = jobsToInsert.map(j => {
        const s = toSnakeCaseKeyMap(j);
        if (s.labour_amt != null) s.labour_amt = Number(String(s.labour_amt).replace(/[^0-9.-]/g,'')) || 0;
        if (s.part_amt != null) s.part_amt = Number(String(s.part_amt).replace(/[^0-9.-]/g,'')) || 0;
        if (s.bill_amount != null) s.bill_amount = Number(String(s.bill_amount).replace(/[^0-9.-]/g,'')) || 0;
        if (s.bill_amount != null) s.profit = s.bill_amount - ((s.labour_amt || 0) + (s.part_amt || 0));
        return s;
      });

      for (let i = 0; i < jobsSnake.length; i += batchSize) {
        const batch = jobsSnake.slice(i, i + batchSize);
        const { error } = await supabaseAdmin.from("jobs").upsert(batch, { returning: "minimal" });
        if (error) {
          console.error("Failed to upsert jobs batch:", error);
        }
      }
    } catch (err) {
      console.error("Mapping raw rows to jobs failed:", err);
    }

    return res.status(200).json({ insertedCount, errors });
  } catch (err: any) {
    // Log stack if available for easier debugging in server logs
    console.error("Upload CSV handler error:", err && (err.stack || err.message || String(err)));
    try {
      return res.status(500).json({ error: err && (err.message || String(err)) });
    } catch (sendErr) {
      // If sending JSON fails (platform-level issue), at least log and end
      console.error('Failed to send error JSON response:', sendErr);
      try {
        return res.status(500).end(String(err));
      } catch (endErr) {
        console.error('Failed to end response after error:', endErr);
        // last resort: throw so the platform captures the crash in its logs
        throw err;
      }
    }
  }
}
