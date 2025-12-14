import React from "react";

const CANONICAL_FIELDS: { key: string; label: string }[] = [
  { key: "srl_no", label: "Srl No" },
  { key: "dealer_name", label: "Dealer Name" },
  { key: "dealer_city", label: "Dealer City" },
  { key: "location", label: "Location" },
  { key: "registration_no", label: "Registration No" },
  { key: "bill_no", label: "Bill No" },
  { key: "job_card_no", label: "Job Card No" },
  { key: "jc_date_time", label: "JC Date & Time" },
  { key: "service_type", label: "Service Type" },
  { key: "repeat_revisit", label: "Repeat/Revisit" },
  { key: "customer_name", label: "Customer Name" },
  { key: "mobile_no", label: "Mobile No" },
  { key: "customer_catg", label: "Customer Catg" },
  { key: "psf_status", label: "PSF Status" },
  { key: "chassis", label: "Chassis" },
  { key: "engine_num", label: "Engine Num" },
  { key: "color", label: "Color" },
  { key: "variant", label: "Variant" },
  { key: "model", label: "Model" },
  { key: "mi_yn", label: "MI_YN" },
  { key: "sale_date", label: "Sale Date" },
  { key: "group", label: "Group" },
  { key: "sa", label: "S.A" },
  { key: "technician", label: "Technician" },
  { key: "circular_no", label: "Circular No" },
  { key: "mileage", label: "Mileage" },
  { key: "est_lab_amt", label: "Est. Lab Amt" },
  { key: "est_part_amt", label: "Est. Part Amt" },
  { key: "promised_dt", label: "Promised Dt" },
  { key: "ready_date_time", label: "Ready Date & Time" },
  { key: "rev_est_part_amt", label: "Rev. Est. Part Amt" },
  { key: "rev_est_lab_amt", label: "Rev Est Lab Amt" },
  { key: "jc_source", label: "JC Source" },
  { key: "app_sent_date", label: "App Sent Date" },
  { key: "app_rej_date", label: "App REJ Date" },
  { key: "approval_status", label: "Approval Status" },
  { key: "cust_remarks", label: "Cust Remarks" },
  { key: "dlr_remarks", label: "Dlr Remarks" },
  { key: "status", label: "Status" },
  { key: "bill_date", label: "Bill Date" },
  { key: "labour_amt", label: "Labour Amt" },
  { key: "part_amt", label: "Part Amt" },
  { key: "pickup_required", label: "Pickup Required" },
  { key: "pickup_date", label: "Pickup Date" },
  { key: "pickup_location", label: "Pickup Location" },
  { key: "bill_amount", label: "Bill Amount" },
  { key: "address1", label: "Address1" },
  { key: "address2", label: "Address2" },
  { key: "address3", label: "Address3" },
  { key: "city", label: "City" },
  { key: "pin", label: "Pin" },
  { key: "dob", label: "DOB" },
  { key: "doa", label: "DOA" },
  { key: "email", label: "Email" },
  { key: "chkin_dt", label: "CHKIN_DT" },
  { key: "group_name", label: "Group Name" },
  { key: "callback_date", label: "Callback Date" }
];

type Props = {
  headers: string[];
  onMappingChange: (mapping: Record<string, string>) => void;
};

export default function CsvMapper({ headers, onMappingChange }: Props) {
  // initialize default mapping by trying to auto-match sanitized header
  const sanitize = (h: string) => h.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_");

  const autoMap = (header: string) => {
    const s = sanitize(header);
    // try exact key match
    const found = CANONICAL_FIELDS.find((f) => f.key === s || sanitize(f.label) === s || sanitize(f.label).includes(s));
    return found ? found.key : "";
  };

  const [mapping, setMapping] = React.useState<Record<string, string>>(() => {
    const m: Record<string, string> = {};
    headers.forEach((h) => (m[h] = autoMap(h)));
    return m;
  });

  React.useEffect(() => {
    onMappingChange(mapping);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapping]);

  return (
    <div className="p-3 border rounded bg-white">
      <h4 className="text-sm font-medium mb-2">Map CSV headers to job fields</h4>
      <div className="grid grid-cols-1 gap-2">
        {headers.map((h) => (
          <div key={h} className="flex items-center gap-2">
            <div className="flex-1 text-xs text-gray-700">{h}</div>
            <select
              value={mapping[h] ?? ""}
              onChange={(e) => setMapping((prev) => ({ ...prev, [h]: e.target.value }))}
              className="text-sm border rounded p-1"
            >
              <option value="">(ignore)</option>
              {CANONICAL_FIELDS.map((f) => (
                <option key={f.key} value={f.key}>{f.label}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
