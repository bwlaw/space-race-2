// Builds data/stats.json with launch counts and success rates per country.
// Runs daily on GitHub Actions. The free Launch Library 2 tier allows about
// 15 requests per hour, so every request is spaced out (the job takes ~2 hours).
import { mkdir, writeFile } from 'node:fs/promises';

const BASE = 'https://ll.thespacedevs.com/2.3.0';
const GAP_MS = Number(process.env.LL2_GAP_MS ?? 250_000);
const COUNTRIES = ['USA', 'China', 'Russia', 'Europe', 'India', 'Japan'];
const EUROPE = new Set(['GUF', 'FRA', 'DEU', 'ITA', 'ESP', 'GBR', 'NLD', 'BEL', 'SWE', 'DNK', 'CHE', 'POL', 'HUN', 'CZE', 'AUT', 'NOR', 'PRT', 'FIN', 'IRL', 'GRC', 'ROU', 'LUX', 'EST', 'SVN', 'SVK', 'LTU', 'LVA', 'BGR', 'HRV']);
const ATTEMPT = new Set(['Success', 'Failure', 'Partial Failure']);

function countryFromCode(code) {
  if (!code) return null;
  if (code === 'USA') return 'USA';
  if (code === 'CHN') return 'China';
  if (code === 'RUS' || code === 'KAZ' || code === 'SUN') return 'Russia';
  if (code === 'IND') return 'India';
  if (code === 'JPN') return 'Japan';
  if (EUROPE.has(code)) return 'Europe';
  return null;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let first = true;

async function get(url) {
  for (let attempt = 1; attempt <= 4; attempt++) {
    if (!first) await sleep(GAP_MS);
    first = false;
    console.log(`GET ${url}`);
    const res = await fetch(url, { headers: { Accept: 'application/json', 'User-Agent': 'space-race-2 stats job' } });
    if (res.ok) return res.json();
    console.log(`  -> HTTP ${res.status}`);
    if (res.status === 429) await sleep(15 * 60_000);
    else if (attempt === 4) throw new Error(`HTTP ${res.status} for ${url}`);
  }
  throw new Error(`Giving up on ${url}`);
}

async function all(url) {
  const out = [];
  let next = url;
  while (next) {
    const page = await get(next);
    out.push(...(page.results ?? []));
    next = page.next;
  }
  return out;
}

const rate = (ok, n) => (n ? Math.round((ok / n) * 100) : null);

async function main() {
  // 1. Which launch locations belong to which country.
  const locations = await all(`${BASE}/locations/?limit=100&celestial_body=1`);
  const ids = Object.fromEntries(COUNTRIES.map((c) => [c, []]));
  for (const loc of locations) {
    const c = countryFromCode(loc.country?.alpha_3_code);
    if (c) ids[c].push(loc.id);
  }

  // 2. All-time attempts and successes per country (counts only, one tiny request each).
  const allTime = {};
  for (const c of COUNTRIES) {
    if (ids[c].length === 0) {
      allTime[c] = { launches: 0, successRate: null, crewed: 0 };
      continue;
    }
    const loc = ids[c].join(',');
    const attempts = (await get(`${BASE}/launches/previous/?mode=list&limit=1&location__ids=${loc}&status__ids=3,4,7`)).count;
    const successes = (await get(`${BASE}/launches/previous/?mode=list&limit=1&location__ids=${loc}&status__ids=3`)).count;
    const crewed = (await get(`${BASE}/launches/previous/?mode=list&limit=1&location__ids=${loc}&status__ids=3,4,7&is_crewed=true&include_suborbital=false`)).count;
    allTime[c] = { launches: attempts, successRate: rate(successes, attempts), crewed };
  }
  const worldAttempts = (await get(`${BASE}/launches/previous/?mode=list&limit=1&status__ids=3,4,7`)).count;
  const worldSuccesses = (await get(`${BASE}/launches/previous/?mode=list&limit=1&status__ids=3`)).count;
  const worldCrewed = (await get(`${BASE}/launches/previous/?mode=list&limit=1&status__ids=3,4,7&is_crewed=true&include_suborbital=false`)).count;

  // Everyone who has flown to space, counted by nationality.
  const people = await all(`${BASE}/astronauts/?mode=list&limit=100&has_flown=true&is_human=true`);
  const astronauts = Object.fromEntries(COUNTRIES.map((c) => [c, 0]));
  for (const p of people) {
    const c = countryFromCode(p.nationality?.[0]?.alpha_3_code);
    if (c) astronauts[c] += 1;
  }
  for (const c of COUNTRIES) allTime[c].astronauts = astronauts[c];

  // 3. Every launch since 1 January four years ago, for the 5-year and 12-month views.
  const now = new Date();
  const fiveStart = new Date(Date.UTC(now.getUTCFullYear() - 4, 0, 1));
  const twelveStart = new Date(now.getTime() - 365 * 86400_000);
  const recent = await all(`${BASE}/launches/previous/?mode=normal&limit=100&ordering=net&net__gte=${fiveStart.toISOString()}`);

  const empty = () => Object.fromEntries(COUNTRIES.map((c) => [c, { n: 0, ok: 0, rockets: {} }]));
  const agg = { last5: empty(), last12: empty() };
  for (const l of recent) {
    const c = countryFromCode(l.pad?.country?.alpha_3_code ?? l.pad?.location?.country?.alpha_3_code);
    const status = l.status?.abbrev;
    if (!c || !ATTEMPT.has(status)) continue;
    const rocket = l.rocket?.configuration?.name ?? 'Unknown';
    const periods = Date.parse(l.net) >= twelveStart.getTime() ? ['last5', 'last12'] : ['last5'];
    for (const p of periods) {
      const a = agg[p][c];
      a.n += 1;
      if (status === 'Success') a.ok += 1;
      a.rockets[rocket] = (a.rockets[rocket] ?? 0) + 1;
    }
  }
  // Fallback for the "On this day" card: the latest successful launch on each calendar day.
  const onThisDay = {};
  for (const l of recent) {
    const c = countryFromCode(l.pad?.country?.alpha_3_code ?? l.pad?.location?.country?.alpha_3_code);
    if (!c || l.status?.abbrev !== 'Success') continue;
    const d = new Date(l.net);
    const md = `${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
    const year = d.getUTCFullYear();
    if (!onThisDay[md] || onThisDay[md].year <= year) {
      onThisDay[md] = { year, country: c, rocket: l.rocket?.configuration?.name ?? 'Rocket', mission: l.mission?.name ?? l.name ?? 'a mission' };
    }
  }

  const finish = (p) =>
    Object.fromEntries(
      COUNTRIES.map((c) => {
        const a = agg[p][c];
        const top = Object.entries(a.rockets).sort((x, y) => y[1] - x[1])[0]?.[0] ?? null;
        return [c, { launches: a.n, successRate: rate(a.ok, a.n), rocket: top }];
      }),
    );

  const stats = {
    updated: now.toISOString(),
    source: 'Launch Library 2 by The Space Devs',
    fiveYearStart: fiveStart.toISOString().slice(0, 10),
    periods: { allTime, last5: finish('last5'), last12: finish('last12') },
    world: { launches: worldAttempts, successRate: rate(worldSuccesses, worldAttempts), crewed: worldCrewed, astronauts: people.length },
  };
  await mkdir('data', { recursive: true });
  await writeFile('data/stats.json', `${JSON.stringify(stats, null, 2)}\n`);
  await writeFile('data/onthisday.json', `${JSON.stringify(onThisDay, null, 1)}\n`);
  console.log('Wrote data/stats.json');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
