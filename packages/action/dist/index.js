"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
function hashString(input) {
    let hash = 2166136261;
    for (let i = 0; i < input.length; i++) {
        hash ^= input.charCodeAt(i);
        hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
    }
    return hash >>> 0;
}
function getIntensity(region, date) {
    const h = hashString(region);
    const hour = date.getUTCHours();
    const day = Math.floor((date.getTime() / 86400000) % 365);
    const v = (h % 100) * 0.35 + (hour * 7) + (day * 3);
    const s = Math.sin((v % 360) * (Math.PI / 180));
    const base = (s + 1) * 50;
    const noise = ((h >> (hour % 16)) & 255) / 10;
    const value = Math.max(0, Math.min(100, base + noise - 12));
    return Math.round(value);
}
function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}
function readInput(name, def) {
    const v = process.env[`INPUT_${name.toUpperCase()}`];
    return v && v.length > 0 ? v : def;
}
async function measure(mode, apiUrl, region, threshold) {
    if (mode === 'service' && apiUrl) {
        const u = new URL('/api/intensity', apiUrl);
        u.searchParams.set('region', region);
        u.searchParams.set('threshold', String(threshold));
        const r = await fetch(u.toString());
        const j = await r.json();
        return { intensity: j.intensity, clean: j.clean, reason: j.clean ? 'clean' : 'dirty' };
    }
    const intensity = getIntensity(region, new Date());
    return { intensity, clean: intensity <= threshold, reason: intensity <= threshold ? 'clean' : 'dirty' };
}
function setOutput(key, value) {
    const file = process.env.GITHUB_OUTPUT;
    if (file)
        (0, fs_1.appendFileSync)(file, `${key}=${value}\n`);
}
async function run() {
    const region = readInput('region', 'us-east-1');
    const threshold = parseInt(readInput('threshold', '50'), 10);
    const maxWaitMinutes = parseInt(readInput('max_wait_minutes', '60'), 10);
    const intervalSeconds = parseInt(readInput('interval_seconds', '300'), 10);
    const mode = readInput('mode', 'local');
    const apiUrl = readInput('api_url', '');
    const failOnTimeout = readInput('fail_on_timeout', 'false') === 'true';
    let waited = 0;
    while (true) {
        const { intensity, clean, reason } = await measure(mode, apiUrl, region, threshold);
        if (clean) {
            setOutput('proceed', 'true');
            setOutput('intensity', String(intensity));
            setOutput('reason', reason);
            setOutput('waited_seconds', String(waited));
            process.stdout.write(`Proceed intensity=${intensity} threshold=${threshold} waited=${waited}s\n`);
            return;
        }
        const maxWait = maxWaitMinutes * 60;
        if (waited >= maxWait) {
            setOutput('proceed', 'false');
            setOutput('intensity', String(intensity));
            setOutput('reason', 'timeout');
            setOutput('waited_seconds', String(waited));
            process.stdout.write(`Timeout intensity=${intensity} threshold=${threshold} waited=${waited}s\n`);
            if (failOnTimeout)
                process.exit(1);
            return;
        }
        await sleep(intervalSeconds * 1000);
        waited += intervalSeconds;
    }
}
run().catch(e => {
    process.stderr.write(String(e ? e.stack || e.message || e : e));
    process.exit(1);
});
