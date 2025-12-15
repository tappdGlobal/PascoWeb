import express from 'express';
import bodyParser from 'body-parser';

// Import the existing API handlers (they export default handler(req,res))
// We use require to allow ts-node-dev to load them seamlessly. Handlers live in a
// few locations in this repo (root /api for some legacy handlers, and src/Pages
// for the newer TypeScript handlers). Require from both areas as needed.
const uploadHandler = require('../api/upload-csv').default;
const mappingHandler = require('../api/mapping_presets').default;
const jobsHandler = require('../api/jobs').default;
const healthHandler = require('../api/supabase-health').default;
// Additional handlers we added under src/Pages
const inventoryHandler = require('../src/Pages/api_inventory').default;
const profilesHandler = require('../src/Pages/api_profiles').default;
const quickMessagesHandler = require('../src/Pages/api_quick_messages').default;
// existing metrics handler (JS) in root api folder
const metricsHandler = require('../api/metrics').default;

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
