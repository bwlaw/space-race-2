import type { Country } from './countries';

/** A milestone and the year each country first reached it with its own spacecraft. */
export type Milestone = {
  name: string;
  points: number;
  first: string;
  reachedBy: [Country, number][];
};

/** Real milestones. Russia carries the Soviet Union's achievements. Point values are a draft. */
export const MILESTONES: Milestone[] = [
  { name: 'Satellite launch on its own rocket', points: 10, first: 'Soviet Union, 1957 (Sputnik 1)', reachedBy: [['Russia', 1957], ['USA', 1958], ['Japan', 1970], ['China', 1970], ['Europe', 1979], ['India', 1980]] },
  { name: 'Spacecraft reaches the Moon', points: 10, first: 'Soviet Union, 1959 (Luna 2)', reachedBy: [['Russia', 1959], ['USA', 1962], ['Japan', 1990], ['Europe', 2004], ['China', 2007], ['India', 2008]] },
  { name: 'Human in orbit on its own rocket', points: 15, first: 'Soviet Union, 1961 (Vostok 1)', reachedBy: [['Russia', 1961], ['USA', 1962], ['China', 2003]] },
  { name: 'Spacewalk', points: 5, first: 'Soviet Union, 1965 (Voskhod 2)', reachedBy: [['Russia', 1965], ['USA', 1965], ['China', 2008]] },
  { name: 'Soft landing on the Moon', points: 15, first: 'Soviet Union, 1966 (Luna 9)', reachedBy: [['Russia', 1966], ['USA', 1966], ['China', 2013], ['India', 2023], ['Japan', 2024]] },
  { name: 'Humans walk on the Moon', points: 25, first: 'USA, 1969 (Apollo 11)', reachedBy: [['USA', 1969]] },
  { name: 'Moon rocks brought to Earth', points: 10, first: 'USA, 1969 (Apollo 11)', reachedBy: [['USA', 1969], ['Russia', 1970], ['China', 2020]] },
  { name: 'Landing on Venus', points: 5, first: 'Soviet Union, 1970 (Venera 7)', reachedBy: [['Russia', 1970]] },
  { name: 'Own space station', points: 15, first: 'Soviet Union, 1971 (Salyut 1)', reachedBy: [['Russia', 1971], ['USA', 1973], ['China', 2021]] },
  { name: 'Spacecraft orbits Mars', points: 10, first: 'USA, 1971 (Mariner 9)', reachedBy: [['USA', 1971], ['Russia', 1971], ['Europe', 2003], ['India', 2014], ['China', 2021]] },
  { name: 'Working rover on Mars', points: 15, first: 'USA, 1997 (Sojourner)', reachedBy: [['USA', 1997], ['China', 2021]] },
  { name: 'Landing on Saturn’s moon Titan', points: 10, first: 'Europe, 2005 (Huygens)', reachedBy: [['Europe', 2005]] },
  { name: 'Asteroid samples brought to Earth', points: 10, first: 'Japan, 2010 (Hayabusa)', reachedBy: [['Japan', 2010], ['USA', 2023]] },
  { name: 'Probe reaches interstellar space', points: 5, first: 'USA, 2012 (Voyager 1)', reachedBy: [['USA', 2012]] },
  { name: 'Landing on a comet', points: 5, first: 'Europe, 2014 (Philae)', reachedBy: [['Europe', 2014]] },
  { name: 'Rocket booster lands after orbital launch', points: 10, first: 'USA, 2015 (Falcon 9)', reachedBy: [['USA', 2015]] },
  { name: 'Landing on the Moon’s far side', points: 10, first: 'China, 2019 (Chang’e 4)', reachedBy: [['China', 2019]] },
  { name: 'Samples from the Moon’s far side', points: 10, first: 'China, 2024 (Chang’e 6)', reachedBy: [['China', 2024]] },
  { name: 'Landing near the Moon’s south pole', points: 5, first: 'India, 2023 (Chandrayaan-3)', reachedBy: [['India', 2023]] },
];

export const FUTURE_MILESTONES: { name: string; points: number }[] = [
  { name: 'Humans land on Mars', points: 40 },
  { name: 'Permanent crewed base on the Moon', points: 25 },
  { name: 'Mars samples brought to Earth', points: 20 },
  { name: 'Landing on Jupiter’s moon Europa', points: 15 },
];

/** SAMPLE DATA – replaced by the live feed in a later step. Month = 1–12. */
export const RECENT_HIGHLIGHTS: { name: string; points: number; reachedBy: [Country, number][] }[] = [
  { name: 'Crewed flight to a space station', points: 5, reachedBy: [['USA', 2], ['Russia', 3], ['China', 4]] },
  { name: 'Booster landed and flown again', points: 3, reachedBy: [['USA', 1], ['China', 5]] },
  { name: 'Mission launched towards the Moon', points: 5, reachedBy: [['China', 6], ['India', 8]] },
  { name: 'First flight of a new rocket', points: 5, reachedBy: [['Europe', 7], ['Japan', 9]] },
  { name: 'Ten launches in a single month', points: 3, reachedBy: [['USA', 3], ['China', 9]] },
  { name: 'Probe arrives at its destination', points: 5, reachedBy: [['Japan', 10]] },
];

/** SAMPLE DATA – launches, success rate (%), most flown rocket. */
export const LAUNCH_STATS: Record<'allTime' | 'last5' | 'last12', Record<Country, [number, number, string]>> = {
  allTime: { USA: [2400, 94, 'Falcon 9'], Russia: [3300, 95, 'Soyuz'], China: [560, 96, 'Long March 2'], Europe: [330, 95, 'Ariane 5'], India: [100, 88, 'PSLV'], Japan: [120, 93, 'H-IIA'] },
  last5: { USA: [420, 97, 'Falcon 9'], China: [280, 96, 'Long March 2'], Russia: [95, 98, 'Soyuz'], Europe: [22, 91, 'Ariane 6'], India: [30, 90, 'PSLV'], Japan: [16, 88, 'H3'] },
  last12: { USA: [100, 98, 'Falcon 9'], China: [62, 97, 'Long March 2'], Russia: [18, 100, 'Soyuz'], Europe: [9, 100, 'Ariane 6'], India: [7, 86, 'PSLV'], Japan: [6, 100, 'H3'] },
};
