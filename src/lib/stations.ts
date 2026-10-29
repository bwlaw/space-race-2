import { degreesLat, degreesLong, eciToGeodetic, gstime, propagate, twoline2satrec, type SatRec } from 'satellite.js';

/** CelesTrak orbital elements (TLE) for the ISS (25544) and Tiangong's core module Tianhe (48274). */
export const TLE_URLS = {
  ISS: 'https://celestrak.org/NORAD/elements/gp.php?CATNR=25544&FORMAT=TLE',
  Tiangong: 'https://celestrak.org/NORAD/elements/gp.php?CATNR=48274&FORMAT=TLE',
} as const;

export type Tle = { line1: string; line2: string };

export function parseTle(raw: unknown): Tle {
  const lines = String(raw).split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const line1 = lines.find((l) => l.startsWith('1 '));
  const line2 = lines.find((l) => l.startsWith('2 '));
  if (!line1 || !line2) throw new Error('No TLE');
  return { line1, line2 };
}

export function satrecFrom(tle: Tle | null): SatRec | null {
  if (!tle) return null;
  try {
    return twoline2satrec(tle.line1, tle.line2);
  } catch {
    return null;
  }
}

export type Fix = { lon: number; lat: number; altKm: number; speedKmh: number };

export function fixAt(sat: SatRec, date: Date): Fix | null {
  const pv = propagate(sat, date);
  if (!pv || typeof pv.position === 'boolean' || typeof pv.velocity === 'boolean') return null;
  const g = eciToGeodetic(pv.position, gstime(date));
  const v = pv.velocity;
  return {
    lon: degreesLong(g.longitude),
    lat: degreesLat(g.latitude),
    altKm: g.height,
    speedKmh: Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z) * 3600,
  };
}

/** Ground track from 10 minutes ago to one orbit ahead, split where it crosses the date line. */
export function groundTrack(sat: SatRec, now: number): [number, number][][] {
  const segments: [number, number][][] = [];
  let cur: [number, number][] = [];
  let prevLon: number | null = null;
  for (let m = -10; m <= 95; m += 1) {
    const f = fixAt(sat, new Date(now + m * 60000));
    if (!f) continue;
    if (prevLon !== null && Math.abs(f.lon - prevLon) > 180) {
      if (cur.length > 1) segments.push(cur);
      cur = [];
    }
    cur.push([f.lon, f.lat]);
    prevLon = f.lon;
  }
  if (cur.length > 1) segments.push(cur);
  return segments;
}
