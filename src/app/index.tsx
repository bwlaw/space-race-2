import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Flag } from '@/components/flag';
import { FutureCard, LaunchCard, LaunchStatsTable, MilestoneCard } from '@/components/race-cards';
import { RaceLanes } from '@/components/race-lanes';
import { Pill, Screen } from '@/components/screen';
import { Segmented, TextTabs } from '@/components/toggles';
import { C, F } from '@/constants/theme';
import { COUNTRIES, type Country } from '@/data/countries';
import { FUTURE_MILESTONES, MILESTONES, RECENT_HIGHLIGHTS } from '@/data/race';
import { parseLaunches, PREVIOUS_URL, relative } from '@/lib/ll2';
import { HOUR, MINUTE, useRemote } from '@/lib/remote';
import { launchStat, parseStats, STATS_URL } from '@/lib/stats';
import { FIVE_YEAR_START, milestonePoints, milestoneRows, standings, type Metric, type Period } from '@/lib/race';

export default function RaceScreen() {
  const [metric, setMetric] = useState<Metric>('milestones');
  const [period, setPeriod] = useState<Period>('allTime');
  const [pick, setPick] = useState<Country | null>(null);
  const [more, setMore] = useState(false);
  const [run, setRun] = useState(0);
  const recent = useRemote('ll2-previous', PREVIOUS_URL, 30 * MINUTE, parseLaunches);
  const statsRemote = useRemote('stats-v2', STATS_URL, 6 * HOUR, parseStats);
  const stats = statsRemote.data;
  const [now] = useState(() => Date.now());

  const rows = useMemo(() => standings(metric, period, stats), [metric, period, stats]);
  const isMiles = metric === 'milestones';
  const isAll = period === 'allTime';
  const totals = useMemo(() => milestonePoints(period === 'last12' ? 'allTime' : period), [period]);
  const isFive = period === 'last5';
  const list = useMemo(() => milestoneRows(period, pick), [period, pick]);
  const shown = more ? list : list.slice(0, 5);

  // "Last 12 months" is not available for milestones yet; fall back to the 5-year view.
  const changeMetric = (m: Metric) => { setMetric(m); setMore(false); if (m === 'milestones' && period === 'last12') setPeriod('last5'); };
  const changePeriod = (p: Period) => { setPeriod(p); setMore(false); };
  const togglePick = (c: Country) => { setPick(pick === c ? null : c); setMore(false); };

  const statRows = COUNTRIES.map((c) => { const [count, rate, rocket] = launchStat(stats, period, c); return { country: c, count, rate, rocket }; })
    .sort((a, b) => b.count - a.count)
    .filter((r) => !pick || r.country === pick);
  const latest = (recent.data ?? [])
    .filter((l) => !pick || l.country === pick)
    .sort((a, b) => b.net - a.net)
    .slice(0, 5)
    .map((l) => ({ country: l.country, rocket: l.rocket, mission: l.mission, when: relative(l.net, now), success: l.status === 'Success' }));

  const periodWords = isAll ? '' : isFive ? ' in last 5 years' : ' in last 12 months';
  const title = !isMiles
    ? pick ? `${pick} launches` : isAll ? 'Total launches' : `Launches${periodWords}`
    : pick
      ? period === 'last12' ? `${pick}${periodWords}` : `${pick}: ${totals[pick]} points`
      : isAll ? 'Milestones' : `Milestones${periodWords}`;

  const reachedCount = (c: Country) => list.filter((r) => r.countries.includes(c)).length;
  const note = !isMiles
    ? (isAll ? 'The lanes count orbital launch attempts since 1957.' : `The lanes count orbital launch attempts${periodWords}.`) + (pick === 'Russia' ? ' Russia includes the Soviet Union.' : '') + (stats ? ` Launch counts updated ${new Date(stats.updated).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}.` : ' Launch counts are still sample figures; the latest launches are live.')
    : period === 'last12'
      ? pick ? `${RECENT_HIGHLIGHTS.filter((h) => h.reachedBy.some(([c]) => c === pick)).length} highlights in the last 12 months.` : 'Highlights from the last 12 months. Each one adds its points to the lanes above.'
      : isFive
        ? pick ? `${reachedCount(pick)} milestones reached since ${FIVE_YEAR_START}.` : `Milestones reached since ${FIVE_YEAR_START}. Each one scores its points again for this period.`
        : pick
          ? `${MILESTONES.filter((m) => m.reachedBy.some(([c]) => c === pick)).length} of ${MILESTONES.length} milestones reached.${pick === 'Russia' ? ' Russia carries the Soviet Union’s achievements.' : ''}`
          : 'Each milestone scores once for every country that reaches it with its own rocket or spacecraft, not only for the first. Points run from 5 for smaller steps, such as a spacewalk or a comet landing, to 25 for humans walking on the Moon. Humans in orbit, own space stations, soft Moon landings and Mars rovers score 15. The biggest open goal, humans on Mars, is worth 40.';

  return (
    <Screen title="Space Race" right={!isMiles && !stats ? <Pill label="Sample data" /> : undefined}>
      <View style={styles.leaderRow}>
        <Flag country={rows[0].country} width={21} />
        <Text style={styles.leader}>{`${rows[0].country} leads`}</Text>
      </View>

      <View style={{ gap: 4 }}>
        <Segmented options={[{ value: 'milestones', label: 'Milestones' }, { value: 'launches', label: 'Launches' }]} value={metric} onChange={changeMetric} />
        <TextTabs options={[{ value: 'allTime', label: 'All-time' }, { value: 'last5', label: 'Last 5 years' }, { value: 'last12', label: 'Last 12 months', disabled: metric === 'milestones' }]} value={period} onChange={changePeriod} />
      </View>

      <View style={styles.panel}>
        <RaceLanes rows={rows} unit={isMiles ? 'points' : 'launches'} pick={pick} onPick={togglePick} runKey={`${metric}-${period}-${run}`} />
        <View style={styles.panelFoot}>
          <Text style={styles.hint}>Tap flag or rocket</Text>
          <Pressable onPress={() => setRun(run + 1)} accessibilityRole="button" style={styles.relaunch}>
            <Text style={styles.relaunchText}>Relaunch</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.listHead}>
        <Text style={styles.h2} accessibilityRole="header">{title}</Text>
        {pick && (
          <Pressable onPress={() => setPick(null)} accessibilityRole="button" style={styles.allBtn}>
            <Text style={styles.allBtnText}>All countries</Text>
          </Pressable>
        )}
      </View>

      {isMiles ? (
        <View style={{ gap: 8 }}>
          {shown.map((r) => <MilestoneCard key={r.name} row={r} />)}
          {list.length > 5 && (
            <Pressable onPress={() => setMore(!more)} accessibilityRole="button" accessibilityState={{ expanded: more }} style={styles.moreBtn}>
              <Text style={styles.moreText}>{more ? 'Show fewer' : 'Show more milestones'}</Text>
            </Pressable>
          )}
          {!pick && (
            <View style={{ gap: 8, marginTop: 8 }}>
              <Text style={styles.h2} accessibilityRole="header">Still up for grabs</Text>
              <Text style={styles.note}>No country has done these yet. The first to get there scores the points.</Text>
              {FUTURE_MILESTONES.map((f) => <FutureCard key={f.name} {...f} />)}
            </View>
          )}
        </View>
      ) : (
        <View style={{ gap: 8 }}>
          <LaunchStatsTable rows={statRows} />
          <Text style={[styles.h2, { marginTop: 8 }]} accessibilityRole="header">Latest launches</Text>
          {latest.map((l, i) => <LaunchCard key={`${l.rocket}-${i}`} {...l} />)}
          {latest.length === 0 && (
            <Text style={styles.note}>{recent.state === 'loading' ? 'Loading launches…' : recent.state === 'error' ? 'Latest launches could not be loaded.' : 'No recent launch for this country.'}</Text>
          )}
        </View>
      )}

      <Text style={styles.note}>{note}</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  leaderRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: -8 },
  leader: { fontSize: 13, color: C.muted },
  panel: { backgroundColor: C.panel, borderWidth: 1, borderColor: C.line, borderRadius: 18, paddingVertical: 12, paddingHorizontal: 8, gap: 2 },
  panelFoot: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 6, paddingHorizontal: 6 },
  hint: { fontSize: 12, color: C.muted },
  relaunch: { height: 44, paddingHorizontal: 16, borderRadius: 10, borderWidth: 1, borderColor: C.muted, backgroundColor: 'transparent', justifyContent: 'center' },
  relaunchText: { fontSize: 14, fontWeight: '600', color: C.muted },
  listHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  h2: { fontFamily: F.display, fontSize: 22, color: C.text, flexShrink: 1 },
  allBtn: { height: 36, paddingHorizontal: 14, borderRadius: 999, borderWidth: 1, borderColor: C.line, justifyContent: 'center' },
  allBtnText: { fontSize: 13, fontWeight: '600', color: C.sky },
  moreBtn: { height: 44, borderRadius: 12, borderWidth: 1, borderColor: C.line, backgroundColor: C.card, alignItems: 'center', justifyContent: 'center' },
  moreText: { fontSize: 14, fontWeight: '600', color: C.text },
  note: { fontSize: 13, lineHeight: 19, color: C.muted },
});
