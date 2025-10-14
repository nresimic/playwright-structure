import * as http from 'http';
import { existsSync, createReadStream } from 'fs';
import { extname, join, normalize } from 'path';
import { getIntensity, findNextCleanTime } from './carbon';

const port = parseInt(process.env.PORT || '8787', 10);
const publicDir = join(__dirname, '..', 'public');

function sendJson(res: http.ServerResponse, status: number, data: unknown) {
  const body = JSON.stringify(data);
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Length', Buffer.byteLength(body));
  res.end(body);
}

function serveStatic(res: http.ServerResponse, filePath: string) {
  const map: Record<string, string> = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.json': 'application/json; charset=utf-8'
  };
  const ext = extname(filePath);
  const type = map[ext] || 'application/octet-stream';
  res.statusCode = 200;
  res.setHeader('Content-Type', type);
  createReadStream(filePath).pipe(res);
}

function safeJoin(base: string, target: string): string | null {
  const p = normalize(join(base, target));
  if (!p.startsWith(base)) return null;
  return p;
}

const server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
  const url = new URL(req.url || '/', `http://${req.headers.host}`);
  if (url.pathname === '/api/health') {
    return sendJson(res, 200, { ok: true });
  }
  if (url.pathname === '/api/intensity') {
    const region = url.searchParams.get('region') || 'us-east-1';
    const threshold = parseInt(url.searchParams.get('threshold') || '50', 10);
    const windowHours = parseInt(url.searchParams.get('windowHours') || '12', 10);
    const now = new Date();
    const intensity = getIntensity(region, now);
    const clean = intensity <= threshold;
    const next = clean ? now : findNextCleanTime(region, now, threshold, windowHours);
    return sendJson(res, 200, {
      region,
      now: now.toISOString(),
      intensity,
      threshold,
      clean,
      nextCleanAt: next ? next.toISOString() : null
    });
  }
  if (url.pathname === '/api/metrics') {
    return sendJson(res, 200, {
      runsDeferred: 0,
      co2SavedKg: 0,
      costSavedUsd: 0
    });
  }
  if (req.method === 'GET') {
    let filePath = safeJoin(publicDir, url.pathname === '/' ? 'index.html' : url.pathname);
    if (!filePath || !existsSync(filePath)) {
      filePath = join(publicDir, 'index.html');
    }
    return serveStatic(res, filePath);
  }
  res.statusCode = 404;
  res.end();
});

server.listen(port);