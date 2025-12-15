// Load environment variables from .env.local when running the local dev API server.
// This lets you put SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY into .env.local
// and have the API process pick them up when started via `npm run dev:api`.
/* eslint-disable @typescript-eslint/no-var-requires */
// Load dotenv if available, but don't crash if it's not installed yet.
try {
  require('dotenv').config();
} catch (err) {
  // dotenv is convenient for local dev but may not be installed in every environment.
  // If it's missing, warn and continue; the user can run `npm install --save-dev dotenv`.
  // eslint-disable-next-line no-console
  console.warn('dotenv not installed; skipping .env.local load. Run `npm install --save-dev dotenv` to enable.');
}
import express from 'express';
import bodyParser from 'body-parser';

// Import the existing API handlers (they export default handler(req,res))
// We use require to allow ts-node-dev to load them seamlessly. Handlers live in a
// few locations in this repo (root /api for some legacy handlers, and src/Pages
// for the newer TypeScript handlers). Require from both areas as needed.
const _upload = require('../api/upload-csv');
const uploadHandler = _upload && (_upload.default || _upload);
const _mapping = require('../api/mapping_presets');
const mappingHandler = _mapping && (_mapping.default || _mapping);
const _jobs = require('../api/jobs');
const jobsHandler = _jobs && (_jobs.default || _jobs);
const _health = require('../api/supabase-health');
const healthHandler = _health && (_health.default || _health);
// Additional handlers we added under src/Pages
const _inventory = require('../src/Pages/api_inventory');
const inventoryHandler = _inventory && (_inventory.default || _inventory);
const _profiles = require('../src/Pages/api_profiles');
const profilesHandler = _profiles && (_profiles.default || _profiles);
const _quick = require('../src/Pages/api_quick_messages');
const quickMessagesHandler = _quick && (_quick.default || _quick);
// existing metrics handler (JS) in root api folder (CommonJS exports a function)
const _metrics = require('../api/metrics');
const metricsHandler = _metrics && (_metrics.default || _metrics);

const app = express();
app.use(bodyParser.json({ limit: '50mb' }));

app.post('/api/upload-csv', (req: any, res: any) => {
  return uploadHandler(req, res);
});

// Root handler to make it obvious the dev API server is running
app.get('/', (_req: any, res: any) => {
  res.status(200).json({
    ok: true,
    message: 'Dev API server running. Available routes: /api/upload-csv (POST), /api/mapping_presets (GET/POST), /api/jobs (POST/PATCH), /api/supabase-health (GET)'
  });
});

app.all('/api/mapping_presets', (req: any, res: any) => {
  return mappingHandler(req, res);
});

app.all('/api/jobs', (req: any, res: any) => {
  return jobsHandler(req, res);
});

// Inventory endpoints (GET)
app.all('/api/inventory', (req: any, res: any) => {
  return inventoryHandler(req, res);
});

// Profiles endpoint (GET, POST/PUT)
app.all('/api/profiles', (req: any, res: any) => {
  return profilesHandler(req, res);
});

// Quick messages (GET)
app.all('/api/quick_messages', (req: any, res: any) => {
  return quickMessagesHandler(req, res);
});

// Metrics (GET)
app.get('/api/metrics', (req: any, res: any) => {
  return metricsHandler(req, res);
});

app.get('/api/supabase-health', (req: any, res: any) => {
  return healthHandler(req, res);
});

const port = Number(process.env.DEV_API_PORT || 3001);
app.listen(port, () => {
  console.log(`Dev API server listening on http://localhost:${port}`);
});
