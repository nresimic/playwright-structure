export function hashString(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return hash >>> 0;
}

export function getIntensity(region: string, date: Date): number {
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

export function findNextCleanTime(region: string, from: Date, threshold: number, windowHours: number): Date | null {
  const stepMs = 5 * 60 * 1000;
  const end = new Date(from.getTime() + windowHours * 3600000);
  for (let t = from.getTime() + stepMs; t <= end.getTime(); t += stepMs) {
    const d = new Date(t);
    if (getIntensity(region, d) <= threshold) return d;
  }
  return null;
}