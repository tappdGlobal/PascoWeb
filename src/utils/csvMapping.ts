export function sanitizeHeader(h: string) {
  return h
    .trim()
    .replace(/\r/g, "")
    .replace(/\n/g, "")
    .replace(/\s+/g, "_")
    .replace(/[^\w_]/g, "")
    .toLowerCase();
}

export function cleanValue(v: any) {
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  if (s === "" || s.toLowerCase() === "null") return null;
  return s;
}

export function mapRowToRaw(row: Record<string, any>) {
  const out: Record<string, string | null> = {};
  for (const k of Object.keys(row)) {
    const key = sanitizeHeader(k);
    out[key] = cleanValue(row[k]);
  }
  return out;
}

export function toSnakeCaseKeyMap(obj: Record<string, any>) {
  // maps known camelCase keys to snake_case DB columns for upsert
  const m: Record<string, any> = { ...obj };
  const mapping: Record<string, string> = {
    labourAmt: 'labour_amt',
    partAmt: 'part_amt',
    billAmount: 'bill_amount',
    groupName: 'group_name',
    callbackDate: 'callback_date',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    jobCardNumber: 'job_card_number',
    customerName: 'customer_name',
    customerMobile: 'customer_mobile',
    regNo: 'reg_no',
    vehicleModel: 'vehicle_model',
    vehicleRegNo: 'vehicle_reg_no',
  };

  const out: Record<string, any> = {};
  for (const k of Object.keys(m)) {
    const mapped = mapping[k] ?? k;
    out[mapped] = (m as any)[k];
  }
  return out;
}
