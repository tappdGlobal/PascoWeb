// Lightweight health endpoint for Vercel to ensure /api root exists.
// Some TypeScript setups treat the Vercel types as namespaces which can
// cause `TS2709: Cannot use namespace 'VercelRequest' as a type`.
// Using `any` here keeps the endpoint simple and avoids type-loading issues
// for serverless runtime code while remaining fully functional.
export default function handler(_req: any, res: any) {
  res.status(200).json({ ok: true, message: 'API root - serverless functions are present' });
}
