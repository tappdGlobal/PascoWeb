// Central router for /api/* — delegates to specific JS handlers present in /api
const url = require('url');

function sendNotFound(res) {
  res.statusCode = 404;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.end('Not found');
}

module.exports = (req, res) => {
  try {
    const parsed = url.parse(req.url || req.originalUrl || '/');
    const path = parsed.pathname || '/';

    // Map known API routes to files that we control and that are plain JS.
    if (path === '/api/' || path === '/api') {
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ ok: true, message: 'API router active' }));
    }

    // route to upload-csv JS fallback
    if (path === '/api/upload-csv' || path === '/api/upload-csv.js') {
      const h = require('./upload-csv.js');
      return h(req, res);
    }

    if (path === '/api/upload-csv-fallback') {
      const h = require('./upload-csv-fallback.js');
      return h(req, res);
    }

    if (path === '/api/debug-probe') {
      const h = require('./debug-probe.js');
      return h(req, res);
    }

    // If route not matched, fall back to 404
    return sendNotFound(res);
  } catch (err) {
    console.error('api/index router error', err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: String(err) }));
  }
};
