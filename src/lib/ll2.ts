import type { Country } from '@/data/countries';

/** Launch Library 2 by The Space Devs (free tier, cached on the device). */
const BASE = 'https://ll.thespacedevs.com/2.3.0';

export const UPCOMING_URL = `${BASE}/launches/upcoming/?limit=40&mode=detailed&hide_recent_previous=true`;
export const PREVIOUS_URL = `${BASE}/launches/previous/?limit=40&mode=detailed`;
export const EXPEDITIONS_URL = `${BASE}/expeditions/?is_active=true&mode=detailed&limit=20`;

const EUROPE = new Set(['GUF', 'FRA', 'DEU', 'ITA', 'ESP', 'GBR', 'NLD', 'BEL', 'SWE', 'DNK', 'CHE', 'POL', 'HUN', 'CZE', 'AUT', 'NOR', 'PRT', 'FIN', 'IRL', 'GRC', 'ROU', 'LUX', 'EST', 'SVN', 'SVK', 'LTU', 'LVA', 'BGR', 'HRV']);

/** Maps an ISO alpha-3 code to one of the six race countries (null for everyone else). */
export function countryFromCode(code?: string | null): Country | null {
  if (!code) return null;
  if (code === 'USA') return 'USA';
  if (code === 'CHN') return 'China';
  if (code === 'RUS' || code === 'KAZ') return 'Russia';
  if (code === 'IND') return 'India';
  if (code === 'JPN') return 'Japan';
  if (EUROPE.has(code)) return 'Europe';
  return null;
}

export type Launch = {
  id: string;
  rocket: string;
  mission: string;
  site: string;
  net: number;
  status: string;
  stream?: string;
  /** True when the link is a real livestream, false for the provider's launch page. */
  streamIsLive: boolean;
  country: Country;
};

/** Official launch pages, used when no livestream link is listed yet. */
const PROVIDER_PAGES: [RegExp, string][] = [
  [/spacex/i, 'https://www.spacex.com/launches/'],
  [/indian space research|isro/i, 'https://www.isro.gov.in/'],
  [/united launch alliance|ula/i, 'https://www.ulalaunch.com/'],
  [/arianespace|european space agency/i, 'https://www.arianespace.com/'],
  [/japan aerospace|jaxa|mitsubishi/i, 'https://global.jaxa.jp/'],
  [/blue origin/i, 'https://www.blueorigin.com/'],
  [/nasa|national aeronautics/i, 'https://plus.nasa.gov/'],
  [/rocket lab/i, 'https://www.rocketlabusa.com/'],
];

type RawLaunch = {
  id: string;
  net: string;
  status?: { abbrev?: string };
  rocket?: { configuration?: { name?: string } };
  launch_service_provider?: { name?: string; abbrev?: string };
  mission?: { name?: string; vid_urls?: { url?: string }[] } | null;
  vid_urls?: { url?: string }[];
  pad?: { name?: string; country?: { alpha_3_code?: string }; location?: { name?: string; country?: { alpha_3_code?: string } } };
};

export function parseLaunches(raw: unknown): Launch[] {
  const results = ((raw as { results?: RawLaunch[] })?.results ?? []) as RawLaunch[];
  const out: Launch[] = [];
  for (const l of results) {
    const code = l.pad?.country?.alpha_3_code ?? l.pad?.location?.country?.alpha_3_code;
    const country = countryFromCode(code);
    if (!country) continue;
    const video = [...(l.vid_urls ?? []), ...(l.mission?.vid_urls ?? [])].find((v) => v.url)?.url;
    const provider = `${l.launch_service_provider?.name ?? ''} ${l.launch_service_provider?.abbrev ?? ''}`;
    const page = PROVIDER_PAGES.find(([re]) => re.test(provider))?.[1];
    const stream = video ?? page;
    out.push({
      id: l.id,
      rocket: l.rocket?.configuration?.name ?? 'Rocket',
      mission: l.mission?.name ?? 'Mission',
      site: (l.pad?.location?.name ?? l.pad?.name ?? '').split(',')[0],
      net: Date.parse(l.net),
      status: l.status?.abbrev ?? 'TBD',
      stream,
      streamIsLive: !!video,
      country,
    });
  }
  return out;
}

export type CrewMember = {
  id: number;
  name: string;
  role: string;
  country: Country | null;
  code: string;
  nationality: string;
  station: 'ISS' | 'Tiangong' | 'Other';
  lastFlight: number;
  totalDays: number;
  agency: string;
};

type RawCrew = {
  role?: { role?: string };
  astronaut?: {
    id: number;
    name: string;
    in_space?: boolean;
    last_flight?: string;
    time_in_space?: string;
    agency?: { abbrev?: string };
    nationality?: { alpha_3_code?: string; name?: string }[];
  };
};

function durationDays(iso?: string): number {
  const m = iso?.match(/^P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)D)?/);
  if (!m) return 0;
  return Number(m[1] ?? 0) * 365 + Number(m[2] ?? 0) * 30 + Number(m[3] ?? 0);
}

export function parseExpeditions(raw: unknown): CrewMember[] {
  const results = ((raw as { results?: { spacestation?: { name?: string }; crew?: RawCrew[] }[] })?.results ?? []);
  const seen = new Set<number>();
  const out: CrewMember[] = [];
  for (const e of results) {
    const sn = e.spacestation?.name ?? '';
    const station = sn.includes('International') ? 'ISS' : sn.includes('Tiangong') ? 'Tiangong' : 'Other';
    for (const c of e.crew ?? []) {
      const a = c.astronaut;
      if (!a || a.in_space === false || seen.has(a.id)) continue;
      seen.add(a.id);
      const nat = a.nationality?.[0];
      out.push({
        id: a.id,
        name: a.name,
        role: c.role?.role ?? 'Crew member',
        country: countryFromCode(nat?.alpha_3_code),
        code: nat?.alpha_3_code ?? '',
        nationality: nat?.name ?? '',
        station,
        lastFlight: a.last_flight ? Date.parse(a.last_flight) : Date.now(),
        totalDays: durationDays(a.time_in_space),
        agency: a.agency?.abbrev ?? '',
      });
    }
  }
  return out;
}

/** Relative time like "in 3 days", "in 5 h", "2 days ago". */
export function relative(ms: number, now = Date.now()): string {
  const diff = ms - now;
  const abs = Math.abs(diff);
  const h = Math.round(abs / 3600000);
  const d = Math.round(abs / 86400000);
  const text = abs < 3600000 ? 'less than an hour' : h < 36 ? `${h} h` : `${d} days`;
  return diff >= 0 ? `in ${text}` : `${text} ago`;
}
