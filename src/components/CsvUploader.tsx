import React, { useState } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import useCsvUploader from "../Hooks/useCsvUploader";
import CsvMapper from "./CsvMapper";
import supabase from "../supabase/client";

type PreviewRow = Record<string, string>;

export default function CsvUploader({
  apiPath = "/api/upload-csv",
  maxPreview = 10,
}: {
  apiPath?: string;
  maxPreview?: number;
}) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [previewRows, setPreviewRows] = useState<PreviewRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [presetName, setPresetName] = useState<string>("default");
  const [presets, setPresets] = useState<any[]>([]);
  const [parsing, setParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const csvUploader = useCsvUploader({ apiPath });

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null);
    setSuccessMessage(null);
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    setParsing(true);
    // Support CSV and Excel (.xls / .xlsx). For CSV use Papa, for Excel use xlsx library.
    const name = file.name.toLowerCase();
  if (name.endsWith(".csv")) {
      // Parse only first N rows for preview, but capture full file to upload
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: false,
        chunkSize: 1024 * 1024,
        complete: (results) => {
          const data = results.data as PreviewRow[];
          if (!data || data.length === 0) {
            setError("CSV parse returned no rows.");
            setParsing(false);
            return;
          }
          setHeaders(Object.keys(data[0] || {}));
          setPreviewRows(data.slice(0, maxPreview));
          setParsing(false);
        },
        error: (err) => {
          setError(String(err));
          setParsing(false);
        },
      });
  } else if (name.endsWith(".xls") || name.endsWith(".xlsx")) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = ev.target?.result;
          const wb = XLSX.read(data, { type: "array" });
          const firstSheet = wb.Sheets[wb.SheetNames[0]];
          const json = XLSX.utils.sheet_to_json<Record<string, any>>(firstSheet, { defval: null });
          if (!json || json.length === 0) {
            setError("Excel parse returned no rows.");
            setParsing(false);
            return;
          }
          setHeaders(Object.keys(json[0] || {}));
          setPreviewRows(json.slice(0, maxPreview) as PreviewRow[]);
          setParsing(false);
        } catch (err: any) {
          setError(String(err));
          setParsing(false);
        }
      };
      reader.onerror = (err) => {
        setError(String(err));
        setParsing(false);
      };
      reader.readAsArrayBuffer(file);
    } else {
      setError("Unsupported file type. Please upload CSV, XLS or XLSX.");
      setParsing(false);
    }
  }

  async function onUpload(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    if (!fileName) {
      setError("Please select a CSV file first.");
      return;
    }

    try {
      setParsing(true);
      // Re-parse the file but stream rows to the API in batches via web requests.
      // Simpler approach: parse entire CSV into array and send in one request (works for moderate size).
      // For very large files implement streaming/batched upload.
      const inputEl = document.querySelector<HTMLInputElement>(
        'input[type="file"]'
      );
      const file = inputEl?.files?.[0];
      if (!file) throw new Error("CSV file not available");

      // Re-parse the file depending on type (CSV or Excel)
      const results = await new Promise<{ data: any[] }>(async (resolve, reject) => {
        try {
          if (file.name.toLowerCase().endsWith('.csv')) {
            Papa.parse(file, {
              header: true,
              skipEmptyLines: true,
              dynamicTyping: false,
              complete: (r) => resolve({ data: r.data as any[] }),
              error: (err) => reject(err),
            });
          } else {
            const ab = await file.arrayBuffer();
            const wb = XLSX.read(ab, { type: 'array' });
            const firstSheet = wb.Sheets[wb.SheetNames[0]];
            const json = XLSX.utils.sheet_to_json<Record<string, any>>(firstSheet, { defval: null });
            resolve({ data: json as any[] });
          }
        } catch (err) {
          reject(err);
        }
      });

      // Validate minimal
      if (!results.data || results.data.length === 0) {
        throw new Error("No data rows found in CSV.");
      }

      // Send rows to upload hook (handles batching)
  const { inserted, errors } = await csvUploader.uploadRows(results.data, mapping);
      setParsing(false);

      if (errors && errors.length) {
        setError(
          `Upload finished with ${errors.length} error(s). See console for first error.`
        );
        console.error("CSV upload errors sample:", errors.slice(0, 5));
      } else {
        setSuccessMessage(`Uploaded ${inserted} rows successfully.`);
      }
    } catch (err: any) {
      setParsing(false);
      setError(err.message || String(err));
    }
  }

  return (
    <div style={{ maxWidth: 980, margin: "0 auto", padding: 16 }}>
      <h2>Upload CSV to Supabase</h2>
      <form onSubmit={onUpload}>
        <div style={{ marginBottom: 12 }}>
          <input type="file" accept=".csv, .xls, .xlsx" onChange={onFileChange} />
        </div>

        {fileName && <div>Selected file: {fileName}</div>}

        {parsing && <div>Working... (parsing / uploading)</div>}

        {error && (
          <div style={{ color: "white", background: "#c53030", padding: 8 }}>
            {error}
          </div>
        )}
        {successMessage && (
          <div style={{ color: "white", background: "#2f855a", padding: 8 }}>
            {successMessage}
          </div>
        )}

        {headers.length > 0 && (
          <div style={{ marginTop: 12 }}>
            <h4>Detected headers (first {headers.length})</h4>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {headers.map((h) => (
                <div
                  key={h}
                  style={{
                    border: "1px solid #ddd",
                    padding: "4px 8px",
                    margin: 4,
                    borderRadius: 4,
                    fontSize: 12,
                  }}
                >
                  {h}
                </div>
              ))}
            </div>
                <div style={{ marginTop: 12 }}>
                  <CsvMapper headers={headers} onMappingChange={setMapping} />
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <input placeholder="Preset name" value={presetName} onChange={(e) => setPresetName(e.target.value)} />
                    <button type="button" onClick={async () => {
                      // Save preset (use Authorization header)
                      const { data } = await supabase.auth.getSession();
                      const token = (data as any)?.session?.access_token || (data as any)?.access_token || null;
                      if (!token) return alert('Sign in to save presets');
                      const res = await fetch('/api/mapping_presets', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                        body: JSON.stringify({ name: presetName, mapping })
                      });
                      if (!res.ok) return alert('Failed to save preset');
                      alert('Preset saved');
                    }}>Save mapping</button>
                    <button type="button" onClick={async () => {
                      const { data } = await supabase.auth.getSession();
                      const token = (data as any)?.session?.access_token || (data as any)?.access_token || null;
                      if (!token) return alert('Sign in to load presets');
                      const res = await fetch(`/api/mapping_presets`, { headers: { Authorization: `Bearer ${token}` } });
                      const json = await res.json();
                      setPresets(json.presets || []);
                      if (json.presets && json.presets.length) setMapping(json.presets[0].mapping || {});
                    }}>Load last preset</button>
                  </div>
                </div>
          </div>
        )}

        {previewRows.length > 0 && (
          <div style={{ marginTop: 12 }}>
            <h4>Preview (first {previewRows.length} rows)</h4>
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: 12,
                }}
              >
                <thead>
                  <tr>
                    {Object.keys(previewRows[0]).map((col) => (
                      <th
                        key={col}
                        style={{
                          border: "1px solid #eee",
                          padding: 6,
                          textAlign: "left",
                          background: "#fafafa",
                        }}
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewRows.map((row, i) => (
                    <tr key={i}>
                      {Object.keys(row).map((col) => (
                        <td
                          key={col}
                          style={{ border: "1px solid #eee", padding: 6 }}
                        >
                          {String(row[col]).slice(0, 80)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div style={{ marginTop: 16 }}>
          <button type="submit" disabled={parsing}>
            Upload CSV to Supabase
          </button>
        </div>
      </form>
    </div>
  );
}