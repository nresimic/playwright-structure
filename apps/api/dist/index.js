"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const fs_1 = require("fs");
const path_1 = require("path");
const carbon_1 = require("./carbon");
const port = parseInt(process.env.PORT || '8787', 10);
const publicDir = (0, path_1.join)(__dirname, '..', 'public');
function sendJson(res, status, data) {
    const body = JSON.stringify(data);
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Length', Buffer.byteLength(body));
    res.end(body);
}
function serveStatic(res, filePath) {
    const map = {
        '.html': 'text/html; charset=utf-8',
        '.js': 'application/javascript; charset=utf-8',
        '.css': 'text/css; charset=utf-8',
        '.svg': 'image/svg+xml',
        '.json': 'application/json; charset=utf-8'
    };
    const ext = (0, path_1.extname)(filePath);
    const type = map[ext] || 'application/octet-stream';
    res.statusCode = 200;
    res.setHeader('Content-Type', type);
    (0, fs_1.createReadStream)(filePath).pipe(res);
}
function safeJoin(base, target) {
    const p = (0, path_1.normalize)((0, path_1.join)(base, target));
    if (!p.startsWith(base))
        return null;
    return p;
}
const server = http.createServer((req, res) => {
    const url = new URL(req.url || '/', `http://${req.headers.host}`);
    if (url.pathname === '/api/health') {
        return sendJson(res, 200, { ok: true });
    }
    if (url.pathname === '/api/intensity') {
        const region = url.searchParams.get('region') || 'us-east-1';
        const threshold = parseInt(url.searchParams.get('threshold') || '50', 10);
        const windowHours = parseInt(url.searchParams.get('windowHours') || '12', 10);
        const now = new Date();
        const intensity = (0, carbon_1.getIntensity)(region, now);
        const clean = intensity <= threshold;
        const next = clean ? now : (0, carbon_1.findNextCleanTime)(region, now, threshold, windowHours);
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
        if (!filePath || !(0, fs_1.existsSync)(filePath)) {
            filePath = (0, path_1.join)(publicDir, 'index.html');
        }
        return serveStatic(res, filePath);
    }
    res.statusCode = 404;
    res.end();
});
server.listen(port);
