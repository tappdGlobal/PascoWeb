import express from 'express';
import bodyParser from 'body-parser';

// Import the existing API handlers (they export default handler(req,res))
// We use require to allow ts-node-dev to load them seamlessly.
const uploadHandler = require('../api/upload-csv').default;
const mappingHandler = require('../api/mapping_presets').default;
const jobsHandler = require('../api/jobs').default;
const healthHandler = require('../api/supabase-health').default;

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

app.get('/api/supabase-health', (req: any, res: any) => {
  return healthHandler(req, res);
});

const port = Number(process.env.DEV_API_PORT || 3001);
app.listen(port, () => {
  console.log(`Dev API server listening on http://localhost:${port}`);
});
