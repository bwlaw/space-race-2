import { COUNTRIES, type Country } from '@/data/countries';
import { LAUNCH_STATS } from '@/data/race';
import type { Period } from '@/lib/race';

/** Daily statistics built by the GitHub Actions job (scripts/update-stats.mjs). */
export const STATS_URL = 'https://raw.githubusercontent.com/bwlaw/space-race-2/main/data/stats.json';

export type CountryStat = { launches: number; successRate: number | null; rocket?: string | null; crewed?: number; astronauts?: number };
export type Stats = {
  updated: string;
  periods: Record<Period, Record<Country, CountryStat>>;
  world: { launches: number; successRate: number | null; crewed?: number; astronauts?: number };
};

export function parseStats(raw: unknown): Stats {
  const s = raw as Stats;
  if (!s?.periods?.allTime || !s.periods.last5 || !s.periods.last12) throw new Error('Bad stats');
  for (const p of ['allTime', 'last5', 'last12'] as const)
    for (const c of COUNTRIES) if (typeof s.periods[p][c]?.launches !== 'number') throw new Error('Bad stats');
  return s;
}

/** Launch count, success rate and most flown rocket: live if available, otherwise the sample figures. */
export function launchStat(stats: Stats | null, period: Period, c: Country): [number, number, string] {
  const sample = LAUNCH_STATS[period][c];
  const live = stats?.periods[period][c];
  if (!live) return sample;
  return [live.launches, live.successRate ?? sample[1], (period !== 'allTime' && live.rocket) || sample[2]];
}

/** Latest successful launch for each calendar day (MM-DD), from the nightly job. */
export const ON_THIS_DAY_URL = 'https://raw.githubusercontent.com/bwlaw/space-race-2/main/data/onthisday.json';
export type DayLaunch = { year: number; country: Country; rocket: string; mission: string };
export function parseOnThisDay(raw: unknown): Record<string, DayLaunch> {
  if (!raw || typeof raw !== 'object') throw new Error('Bad data');
  return raw as Record<string, DayLaunch>;
}
