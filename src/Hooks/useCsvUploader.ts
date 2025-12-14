import { useState } from "react";
import supabase from "../supabase/client";

export default function useCsvUploader({
  apiPath = "/api/upload-csv",
  batchSize = 500,
}: {
  apiPath?: string;
  batchSize?: number;
}) {
  const [progress, setProgress] = useState({ sent: 0, total: 0 });

  async function uploadRows(rows: any[], mapping?: Record<string, string>) {
    setProgress({ sent: 0, total: rows.length });
    const errors: any[] = [];
    let inserted = 0;

    // Send in batches to reduce payload size
    for (let i = 0; i < rows.length; i += batchSize) {
      const batch = rows.slice(i, i + batchSize);
      // attach Authorization token if available
      const sess = await supabase.auth.getSession();
      const token = (sess as any)?.data?.session?.access_token || (sess as any)?.access_token || null;
      const headers: any = { "Content-Type": "application/json" };
      if (token) headers.Authorization = `Bearer ${token}`;
      const res = await fetch(apiPath, {
        method: "POST",
        headers,
        body: JSON.stringify({ rows: batch, mapping }),
      });

      if (!res.ok) {
        const text = await res.text();
        errors.push({ i, status: res.status, body: text });
        // optional: break on fatal error
        continue;
      }

      const json = await res.json();
      if (json.errors && json.errors.length) {
        errors.push(...json.errors);
      }
      inserted += json.insertedCount || 0;
      setProgress((p) => ({ ...p, sent: Math.min(rows.length, p.sent + batch.length) }));
    }

    return { inserted, errors, progress };
  }

  return { uploadRows, progress };
}