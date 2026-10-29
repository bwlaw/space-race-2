import { COUNTRIES, type Country } from '@/data/countries';
import { MILESTONES, RECENT_HIGHLIGHTS } from '@/data/race';
import { launchStat, type Stats } from '@/lib/stats';

export type Metric = 'milestones' | 'launches';
export type Period = 'allTime' | 'last5' | 'last12';

/** Milestones within the last five calendar years (this year and the four before). */
export const FIVE_YEAR_START = new Date().getFullYear() - 4;

function inPeriod(period: Period, year: number) {
  return period !== 'last5' || year >= FIVE_YEAR_START;
}
export type Standing = { country: Country; value: number };

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const byValue = (a: Standing, b: Standing) => b.value - a.value;

export function milestonePoints(period: Period = 'allTime'): Record<Country, number> {
  const pts = Object.fromEntries(COUNTRIES.map((c) => [c, 0])) as Record<Country, number>;
  for (const m of MILESTONES) for (const [c, y] of m.reachedBy) if (inPeriod(period, y)) pts[c] += m.points;
  return pts;
}

export function standings(metric: Metric, period: Period, stats: Stats | null = null): Standing[] {
  if (metric === 'launches') {
    return COUNTRIES.map((c) => ({ country: c, value: launchStat(stats, period, c)[0] })).sort(byValue);
  }
  if (period !== 'last12') {
    const pts = milestonePoints(period);
    return COUNTRIES.map((c) => ({ country: c, value: pts[c] })).sort(byValue);
  }
  const pts = Object.fromEntries(COUNTRIES.map((c) => [c, 0])) as Record<Country, number>;
  for (const h of RECENT_HIGHLIGHTS) for (const [c] of h.reachedBy) pts[c] += h.points;
  return COUNTRIES.map((c) => ({ country: c, value: pts[c] })).sort(byValue);
}

export type MilestoneRow = {
  name: string;
  points: number;
  first?: string;
  latest: string;
  latestLabel: 'Latest' | 'Reached';
  showLatest: boolean;
  countries: Country[];
  sortKey: number;
};

export function milestoneRows(period: Period, pick: Country | null): MilestoneRow[] {
  if (period !== 'last12') {
    return MILESTONES.map((m) => ({ ...m, reachedBy: m.reachedBy.filter(([, y]) => inPeriod(period, y)) }))
      .filter((m) => m.reachedBy.length > 0 && (!pick || m.reachedBy.some(([c]) => c === pick)))
      .map((m) => {
        const mine = pick ? m.reachedBy.find(([c]) => c === pick) : undefined;
        const last = mine ?? m.reachedBy.reduce((x, a) => (a[1] >= x[1] ? a : x), m.reachedBy[0]);
        return {
          name: m.name,
          points: m.points,
          first: m.first,
          latest: `${last[0]}, ${last[1]}`,
          latestLabel: mine || m.reachedBy.length === 1 ? 'Reached' : 'Latest',
          showLatest: period !== 'allTime' || m.reachedBy.length > 1 || !!mine,
          countries: m.reachedBy.map(([c]) => c),
          sortKey: last[1],
        } satisfies MilestoneRow;
      })
      .sort((a, b) => b.sortKey - a.sortKey);
  }
  return RECENT_HIGHLIGHTS.filter((m) => !pick || m.reachedBy.some(([c]) => c === pick))
    .map((m) => {
      const mine = pick ? m.reachedBy.find(([c]) => c === pick) : undefined;
      const last = mine ?? m.reachedBy.reduce((x, a) => (a[1] >= x[1] ? a : x), m.reachedBy[0]);
      return {
        name: m.name,
        points: m.points,
        latest: `${last[0]}, ${MONTHS[last[1] - 1]}`,
        latestLabel: mine ? 'Reached' : 'Latest',
        showLatest: true,
        countries: m.reachedBy.map(([c]) => c),
        sortKey: last[1],
      } satisfies MilestoneRow;
    })
    .sort((a, b) => b.sortKey - a.sortKey);
}

export const formatNumber = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
