import type { Country } from './countries';

export type UpcomingLaunch = {
  country: Country;
  rocket: string;
  mission: string;
  site: string;
  /** Seconds from now until lift-off (sample data only). */
  inSeconds: number;
  status: 'Go' | 'TBC';
  stream?: string;
};

const DAY = 86400;

/** SAMPLE DATA – replaced by the Launch Library 2 feed in the data step. */
export const UPCOMING: UpcomingLaunch[] = [
  { country: 'USA', rocket: 'Falcon 9', mission: 'Starlink group', site: 'Cape Canaveral, USA', inSeconds: 2 * DAY + 4 * 3600 + 12 * 60 + 30, status: 'Go', stream: 'https://www.spacex.com/launches/' },
  { country: 'China', rocket: 'Long March 5', mission: 'Satellite mission', site: 'Wenchang, China', inSeconds: 5 * DAY + 3 * 3600, status: 'Go' },
  { country: 'Russia', rocket: 'Soyuz-2.1b', mission: 'Satellite mission', site: 'Plesetsk, Russia', inSeconds: 8 * DAY, status: 'TBC' },
  { country: 'India', rocket: 'LVM3', mission: 'Satellite mission', site: 'Sriharikota, India', inSeconds: 12 * DAY, status: 'Go', stream: 'https://www.isro.gov.in/' },
  { country: 'Japan', rocket: 'H3', mission: 'Satellite mission', site: 'Tanegashima, Japan', inSeconds: 16 * DAY, status: 'TBC' },
  { country: 'Europe', rocket: 'Ariane 6', mission: 'Satellite mission', site: 'Kourou, French Guiana', inSeconds: 19 * DAY, status: 'TBC' },
];

export function inDays(seconds: number): string {
  const d = Math.round(seconds / DAY);
  if (d <= 0) return 'today';
  return d === 1 ? 'in 1 day' : `in ${d} days`;
}
