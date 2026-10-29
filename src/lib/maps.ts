/** Elliptical map projection used by all three maps (map units 350 × 240). */
export const MAP_W = 350;
export const MAP_H = 240;

export function project(lon: number, lat: number): [number, number] {
  const f = Math.sqrt(Math.max(0, 1 - (lat / 90) ** 2));
  return [175 + (lon / 180) * 165 * f, 120 - (lat / 90) * 110];
}

/** Simplified ground track of a station with the given orbit tilt. */
export function trackPath(inclination: number, offset: number): string {
  let d = '';
  for (let lon = -180; lon <= 180; lon += 5) {
    const [x, y] = project(lon, inclination * Math.sin(((lon - offset) * Math.PI) / 180));
    d += `${lon === -180 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return d;
}

export function stationAt(lon: number, inclination: number, offset: number): [number, number] {
  return project(lon, inclination * Math.sin(((lon - offset) * Math.PI) / 180));
}

export const ORBITS = {
  ISS: { inclination: 51.6, offset: 30, color: '#5AB0FF' },
  Tiangong: { inclination: 41.5, offset: 120, color: '#FFC857' },
} as const;
