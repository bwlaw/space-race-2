import type { Country } from './countries';

/** Exact dates of key milestones, for the "On this day" card. Format MM-DD. */
export const DAY_FACTS: { md: string; year: number; text: string; country: Country }[] = [
  { md: '10-04', year: 1957, text: 'Sputnik 1, the first satellite, reaches orbit', country: 'Russia' },
  { md: '01-31', year: 1958, text: 'Explorer 1, the first US satellite, is launched', country: 'USA' },
  { md: '04-12', year: 1961, text: 'Yuri Gagarin becomes the first human in orbit', country: 'Russia' },
  { md: '10-27', year: 1961, text: 'First test flight of the Saturn I rocket', country: 'USA' },
  { md: '03-18', year: 1965, text: 'Alexei Leonov makes the first spacewalk', country: 'Russia' },
  { md: '02-03', year: 1966, text: 'Luna 9 makes the first soft landing on the Moon', country: 'Russia' },
  { md: '07-20', year: 1969, text: 'Apollo 11 lands on the Moon', country: 'USA' },
  { md: '12-15', year: 1970, text: 'Venera 7 lands on Venus', country: 'Russia' },
  { md: '04-19', year: 1971, text: 'Salyut 1, the first space station, is launched', country: 'Russia' },
  { md: '11-14', year: 1971, text: 'Mariner 9 becomes the first spacecraft to orbit Mars', country: 'USA' },
  { md: '07-20', year: 1976, text: 'Viking 1 lands on Mars', country: 'USA' },
  { md: '07-04', year: 1997, text: 'The Sojourner rover lands on Mars', country: 'USA' },
  { md: '10-15', year: 2003, text: 'Shenzhou 5 carries China’s first astronaut into orbit', country: 'China' },
  { md: '01-14', year: 2005, text: 'Huygens lands on Saturn’s moon Titan', country: 'Europe' },
  { md: '06-13', year: 2010, text: 'Hayabusa returns asteroid samples to Earth', country: 'Japan' },
  { md: '08-25', year: 2012, text: 'Voyager 1 enters interstellar space', country: 'USA' },
  { md: '11-12', year: 2014, text: 'Philae lands on a comet', country: 'Europe' },
  { md: '12-21', year: 2015, text: 'A Falcon 9 booster lands after an orbital launch', country: 'USA' },
  { md: '01-03', year: 2019, text: 'Chang’e 4 lands on the Moon’s far side', country: 'China' },
  { md: '08-23', year: 2023, text: 'Chandrayaan-3 lands near the Moon’s south pole', country: 'India' },
  { md: '01-19', year: 2024, text: 'SLIM makes a precision landing on the Moon', country: 'Japan' },
];

/** SAMPLE DATA – orbital launches, success %, crewed flights, astronauts, first year. */
export const COUNTRY_STATS: Record<Country | 'World', [number, number, number, number, number]> = {
  World: [6900, 94, 370, 690, 1957],
  USA: [2400, 94, 210, 370, 1958],
  Russia: [3300, 95, 150, 130, 1957],
  China: [560, 96, 16, 26, 1970],
  Europe: [330, 95, 0, 0, 1979],
  India: [100, 88, 0, 0, 1980],
  Japan: [120, 93, 0, 0, 1970],
};

export const displayCountry = (c: Country, year: number) => (c === 'Russia' && year < 1992 ? 'Soviet Union' : c);
