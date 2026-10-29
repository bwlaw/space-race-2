import type { Country } from './countries';

export type Body = 'Earth' | 'Moon' | 'Mars';

export type Place = {
  name: string;
  /** Null for sites outside the six race countries; then `code` names the country. */
  country: Country | null;
  code?: string;
  lon: number;
  lat: number;
  /** Label offset from the dot, in map units (350 × 240). */
  dx: number;
  dy: number;
  anchor: 'start' | 'middle' | 'end';
  /** Short text on the right of the list row. */
  sub: string;
  kind: string;
  inUse: string;
  note: string;
  /** Year used for sorting landers and rovers, newest first. */
  year: number;
};

export const PLACES: Record<Body, Place[]> = {
  Earth: [
    { name: 'Vandenberg', country: 'USA', lon: -120.6, lat: 34.6, dx: -8, dy: -4, anchor: 'end', sub: 'since 1959', kind: 'Launch site, California', inUse: 'In use since 1959, by SpaceX since 2013', note: 'California’s spaceport for polar orbits. SpaceX launches Falcon 9 rockets from here several times a month.', year: 1959 },
    { name: 'Starbase', country: 'USA', lon: -97.15, lat: 25.99, dx: 0, dy: 15, anchor: 'middle', sub: 'since 2019', kind: 'Launch site, Texas', inUse: 'In use since 2019', note: 'SpaceX’s Starship base on the Gulf Coast, home of the largest rocket ever flown.', year: 2019 },
    { name: 'Cape Canaveral', country: 'USA', lon: -80.6, lat: 28.5, dx: 8, dy: -6, anchor: 'start', sub: 'since 1958', kind: 'Launch site, Florida', inUse: 'In use since 1958', note: 'Explorer 1, Apollo 11 and today’s crewed flights to the ISS all left from here.', year: 1958 },
    { name: 'Kourou', country: 'Europe', lon: -52.8, lat: 5.2, dx: 9, dy: 4, anchor: 'start', sub: 'since 1970', kind: 'Launch site, French Guiana', inUse: 'In use since 1970', note: 'Europe’s spaceport close to the equator, home of Ariane 6.', year: 1970 },
    { name: 'Baikonur', country: 'Russia', lon: 63.3, lat: 45.9, dx: 0, dy: -10, anchor: 'middle', sub: 'since 1957', kind: 'Launch site, Kazakhstan', inUse: 'In use since 1957', note: 'Sputnik and Yuri Gagarin launched from here; Soyuz crews still do.', year: 1957 },
    { name: 'Sriharikota', country: 'India', lon: 80.2, lat: 13.7, dx: -9, dy: 4, anchor: 'end', sub: 'since 1979', kind: 'Launch site, India', inUse: 'In use since 1979', note: 'India’s spaceport, where the Chandrayaan Moon missions began.', year: 1979 },
    { name: 'Wenchang', country: 'China', lon: 110.9, lat: 19.6, dx: 8, dy: 13, anchor: 'start', sub: 'since 2016', kind: 'Launch site, Hainan island', inUse: 'In use since 2016', note: 'China’s newest site for heavy rockets and the Tiangong station modules.', year: 2016 },
    { name: 'Mahia', country: null, code: 'NZL', lon: 177.87, lat: -39.26, dx: -9, dy: 4, anchor: 'end', sub: 'since 2017', kind: 'Launch site, New Zealand', inUse: 'In use since 2017', note: 'Rocket Lab’s private spaceport, where its Electron rockets lift off. It was the first private site to host an orbital launch attempt.', year: 2017 },
    { name: 'Tanegashima', country: 'Japan', lon: 131, lat: 30.4, dx: 0, dy: -10, anchor: 'middle', sub: 'since 1975', kind: 'Launch site, Japan', inUse: 'In use since 1975', note: 'Japan’s main spaceport, where H3 rockets lift off.', year: 1975 },
  ],
  Moon: [
    { name: 'Apollo 11', country: 'USA', lon: 23.5, lat: 0.7, dx: 9, dy: -2, anchor: 'start', sub: '1969', kind: 'Crewed lander', inUse: 'On the surface 20–21 July 1969', note: 'First humans on the Moon, in the Sea of Tranquillity.', year: 1969 },
    { name: 'Chang’e 5', country: 'China', lon: -51.9, lat: 43.1, dx: 0, dy: -10, anchor: 'middle', sub: '2020', kind: 'Lander and sample return', inUse: 'In use 1–3 December 2020', note: 'Brought fresh Moon samples to Earth from the Ocean of Storms.', year: 2020 },
    { name: 'SLIM', country: 'Japan', lon: 25.2, lat: -13.3, dx: 9, dy: 9, anchor: 'start', sub: '2024', kind: 'Lander', inUse: 'In use January–August 2024', note: 'Japan’s precision lander touched down within about 100 m of its target.', year: 2024 },
    { name: 'Chandrayaan-3', country: 'India', lon: 32.3, lat: -69.4, dx: 9, dy: 4, anchor: 'start', sub: '2023', kind: 'Lander and rover', inUse: 'In use August–September 2023', note: 'Vikram and the Pragyan rover landed near the lunar south pole.', year: 2023 },
    { name: 'Chang’e 4', country: 'China', lon: 177.6, lat: -45.4, dx: -9, dy: 4, anchor: 'end', sub: '2019', kind: 'Lander and rover', inUse: 'In use since January 2019', note: 'First landing on the far side, in Von Kármán crater.', year: 2019 },
  ],
  Mars: [
    { name: 'Viking 1', country: 'USA', lon: -48, lat: 22.3, dx: -9, dy: 4, anchor: 'end', sub: '1976', kind: 'Lander', inUse: 'In use 1976–1982', note: 'First successful US landing on Mars, in Chryse Planitia.', year: 1976 },
    { name: 'Opportunity', country: 'USA', lon: -5.5, lat: -1.9, dx: 9, dy: 4, anchor: 'start', sub: '2004', kind: 'Rover', inUse: 'In use 2004–2018', note: 'Drove across Meridiani Planum for more than 14 years.', year: 2004 },
    { name: 'Perseverance', country: 'USA', lon: 77.5, lat: 18.4, dx: -9, dy: -4, anchor: 'end', sub: '2021', kind: 'Rover', inUse: 'In use since 2021', note: 'Collecting rock samples in Jezero crater, an ancient lake bed.', year: 2021 },
    { name: 'Zhurong', country: 'China', lon: 109.9, lat: 25.1, dx: 9, dy: -2, anchor: 'start', sub: '2021', kind: 'Rover', inUse: 'In use 2021–2022', note: 'China’s first Mars rover, exploring Utopia Planitia.', year: 2021 },
    { name: 'Curiosity', country: 'USA', lon: 137.4, lat: -4.6, dx: -9, dy: 4, anchor: 'end', sub: '2012', kind: 'Rover', inUse: 'In use since 2012', note: 'Climbing Mount Sharp inside Gale crater.', year: 2012 },
  ],
};

export const BODY_STATS: Record<Body | 'ISS' | 'Tiangong' | 'Both', { label: string; value: string; unit: string }[]> = {
  ISS: [{ label: 'ISS speed', value: '~28,000', unit: 'km/h' }, { label: 'Altitude', value: '~400', unit: 'km' }, { label: 'Orbit tilt', value: '51.6°', unit: 'to equator' }],
  Tiangong: [{ label: 'Tiangong speed', value: '~28,000', unit: 'km/h' }, { label: 'Altitude', value: '~390', unit: 'km' }, { label: 'Orbit tilt', value: '41.5°', unit: 'to equator' }],
  Both: [{ label: 'ISS altitude', value: '~400', unit: 'km' }, { label: 'Tiangong', value: '~390', unit: 'km' }, { label: 'One orbit', value: '~92', unit: 'minutes each' }],
  Earth: [],
  Moon: [{ label: 'Distance', value: '~384,000', unit: 'km' }, { label: 'Travel time', value: '~3', unit: 'days' }, { label: 'Sites shown', value: '5', unit: 'landings' }],
  Mars: [{ label: 'Distance', value: '55–400', unit: 'million km' }, { label: 'Travel time', value: '~7', unit: 'months' }, { label: 'Sites shown', value: '5', unit: 'landings' }],
};

export type InfoCard = { name: string; countries: Country[]; codes?: string[]; kind: string; inUse: string; note: string };

export const STATIONS: Record<'ISS' | 'Tiangong', InfoCard> = {
  ISS: {
    name: 'International Space Station',
    countries: ['USA', 'Russia', 'Europe', 'Japan'],
    codes: ['CAN'],
    kind: 'Space station, about 400 km up',
    inUse: 'In orbit since 1998, crewed since 2000',
    note: 'Built by the USA, Russia, Europe, Japan and Canada. It circles Earth about 16 times a day.',
  },
  Tiangong: {
    name: 'Tiangong',
    countries: ['China'],
    kind: 'Space station, about 390 km up',
    inUse: 'In orbit since 2021',
    note: 'China’s own station with three modules. Crews of three arrive on Shenzhou spacecraft.',
  },
};

/** Shown when nothing is selected on the Moon or Mars map. */
export const BODY_INFO: Record<'Moon' | 'Mars', InfoCard> = {
  Moon: {
    name: 'The Moon',
    countries: ['USA', 'Russia', 'China', 'India', 'Japan'],
    kind: '',
    inUse: '12 people walked on the Moon between 1969 and 1972',
    note: 'The USA, the Soviet Union, China, India and Japan have all landed softly on the Moon. China was the first to land on its far side, in 2019.',
  },
  Mars: {
    name: 'Mars',
    countries: ['USA', 'China'],
    kind: '',
    inUse: 'Rovers have driven on Mars since 1997',
    note: 'Only the USA and China have landed working rovers on Mars. A day there lasts about 24 hours and 40 minutes.',
  },
};

/** Spacecraft orbiting Mars, drawn on a ring around the planet. `angle` is the start position in degrees. */
export const MARS_ORBITERS: (InfoCard & { key: string; country: Country | null; code?: string; sub: string; year: number; angle: number })[] = [
  { key: 'orb-odyssey', name: '2001 Mars Odyssey', country: 'USA', countries: ['USA'], sub: '2001', year: 2001, angle: 10, kind: 'Orbiter', inUse: 'In orbit since 2001', note: 'The longest-serving spacecraft at Mars, mapping minerals and water ice.' },
  { key: 'orb-express', name: 'Mars Express', country: 'Europe', countries: ['Europe'], sub: '2003', year: 2003, angle: 55, kind: 'Orbiter', inUse: 'In orbit since 2003', note: 'Europe’s first mission to Mars, mapping the planet in 3D.' },
  { key: 'orb-mro', name: 'Mars Reconnaissance Orbiter', country: 'USA', countries: ['USA'], sub: '2006', year: 2006, angle: 100, kind: 'Orbiter', inUse: 'In orbit since 2006', note: 'Its high-resolution camera scouts landing sites and it relays data from rovers.' },
  { key: 'orb-maven', name: 'MAVEN', country: 'USA', countries: ['USA'], sub: '2014', year: 2014, angle: 145, kind: 'Orbiter', inUse: 'In orbit since 2014', note: 'Studies how Mars lost most of its atmosphere to space.' },
  { key: 'orb-mom', name: 'Mangalyaan', country: 'India', countries: ['India'], sub: '2014', year: 2014, angle: 190, kind: 'Orbiter', inUse: 'In orbit 2014–2022', note: 'India’s first Mars mission, and the first to reach Mars orbit on a country’s first attempt.' },
  { key: 'orb-tgo', name: 'ExoMars Trace Gas Orbiter', country: 'Europe', countries: ['Europe'], sub: '2016', year: 2016, angle: 235, kind: 'Orbiter', inUse: 'In orbit since 2016', note: 'Sniffs out trace gases such as methane and relays data from rovers.' },
  { key: 'orb-hope', name: 'Hope', country: null, code: 'ARE', countries: [], codes: ['ARE'], sub: '2021', year: 2021, angle: 280, kind: 'Orbiter', inUse: 'In orbit since 2021', note: 'The United Arab Emirates’ weather satellite for the Martian atmosphere.' },
  { key: 'orb-tianwen', name: 'Tianwen-1', country: 'China', countries: ['China'], sub: '2021', year: 2021, angle: 325, kind: 'Orbiter', inUse: 'In orbit since 2021', note: 'Delivered the Zhurong rover and maps Mars from orbit.' },
];
