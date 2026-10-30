import Slider from '@react-native-community/slider';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import Constants from 'expo-constants';
import * as WebBrowser from 'expo-web-browser';

import { CountryFilter } from '@/components/country-filter';
import { Section } from '@/components/section';
import { Flag } from '@/components/flag';
import { Pill, Screen } from '@/components/screen';
import { C, F } from '@/constants/theme';
import { COUNTRIES, type Country } from '@/data/countries';
import { COUNTRY_STATS, DAY_FACTS, displayCountry } from '@/data/history';
import { MILESTONES } from '@/data/race';
import { formatNumber } from '@/lib/race';
import { HOUR, useRemote } from '@/lib/remote';
import { ON_THIS_DAY_URL, parseOnThisDay, parseStats, STATS_URL } from '@/lib/stats';

const PRIVACY_URL = 'https://bwlaw.github.io/space-race-2/privacy.html';
const SUPPORT_URL = 'https://github.com/bwlaw/space-race-2/issues';
const CONTACT_URL = 'https://bwlaw.ch';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const FIRST_YEAR = 1957;
const LAST_YEAR = new Date().getFullYear();

const firstYear = (() => {
  const out = {} as Record<Country, number>;
  for (const m of MILESTONES) for (const [c, y] of m.reachedBy) if (!out[c] || y < out[c]) out[c] = y;
  return out;
})();

const finalPoints = (() => {
  const out = Object.fromEntries(COUNTRIES.map((c) => [c, 0])) as Record<Country, number>;
  for (const m of MILESTONES) for (const [c] of m.reachedBy) out[c] += m.points;
  return out;
})();
const SCALE = Math.max(...Object.values(finalPoints));

function Ring({ percent }: { percent: number }) {
  const r = 23;
  const circ = 2 * Math.PI * r;
  return (
    <Svg width={56} height={56} viewBox="0 0 56 56" accessibilityLabel={`${percent} percent success rate`}>
      <Circle cx={28} cy={28} r={r} fill="none" stroke={C.line} strokeWidth={6} />
      <Circle cx={28} cy={28} r={r} fill="none" stroke={C.green} strokeWidth={6} strokeLinecap="round" strokeDasharray={`${(circ * percent) / 100} ${circ}`} transform="rotate(-90 28 28)" />
    </Svg>
  );
}

export default function HistoryScreen() {
  const [who, setWho] = useState<Country | null>(null);
  const [year, setYear] = useState(1971);
  const [aboutOpen, setAboutOpen] = useState(true);

  const today = new Date();
  const md = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const facts = DAY_FACTS.filter((f) => f.md === md).slice(0, 2);
  const dayLaunches = useRemote('onthisday-v1', ON_THIS_DAY_URL, 12 * HOUR, parseOnThisDay).data;
  const fallback = facts.length === 0 ? dayLaunches?.[md] : undefined;

  const live = useRemote('stats-v2', STATS_URL, 6 * HOUR, parseStats).data;
  const sample = COUNTRY_STATS[who ?? 'World'];
  const liveLaunch = live ? (who ? live.periods.allTime[who] : live.world) : null;
  const stats: [number, number, number, number, number] = [liveLaunch?.launches ?? sample[0], liveLaunch?.successRate ?? sample[1], liveLaunch?.crewed ?? sample[2], liveLaunch?.astronauts ?? sample[3], sample[4]];
  const crewedLive = typeof liveLaunch?.crewed === 'number';
  const peopleLive = typeof liveLaunch?.astronauts === 'number';

  const { points, events } = useMemo(() => {
    const pts = Object.fromEntries(COUNTRIES.map((c) => [c, 0])) as Record<Country, number>;
    const ev: { year: number; country: Country; name: string; points: number }[] = [];
    for (const m of MILESTONES)
      for (const [c, y] of m.reachedBy)
        if (y <= year) {
          pts[c] += m.points;
          ev.push({ year: y, country: c, name: m.name, points: m.points });
        }
    ev.sort((a, b) => b.year - a.year);
    return { points: pts, events: ev };
  }, [year]);

  const bars = [...COUNTRIES].sort((a, b) => points[b] - points[a] || finalPoints[b] - finalPoints[a]);
  const mine = events.filter((e) => !who || e.country === who);

  const jump = (c: Country | null) => {
    setWho(c);
    if (!c) return;
    setYear(firstYear[c]);
  };

  const countNote = who
    ? `${who}: ${mine.length} milestones and ${points[who]} points by ${year}.`
    : `${events.length} milestones reached by ${year}. Tap a flag to follow one country.`;

  return (
    <Screen title="History" right={live ? undefined : <Pill label="Sample data" />}>
      <View style={styles.dayCard}>
        <View style={styles.dateTile}>
          <Text style={styles.dateNum}>{today.getDate()}</Text>
          <Text style={styles.dateMonth}>{MONTHS[today.getMonth()].slice(0, 3)}</Text>
        </View>
        <View style={{ flex: 1, gap: 6 }}>
          <Text style={styles.small}>On this day</Text>
          {facts.map((f) => (
            <View key={`${f.year}-${f.text}`} style={{ gap: 3 }}>
              <Text style={styles.factText}>{f.text}</Text>
              <View style={styles.row6}>
                <Flag country={f.country} width={18} />
                <Text style={styles.small}>{`${displayCountry(f.country, f.year)} ${f.year}`}</Text>
              </View>
            </View>
          ))}
          {facts.length === 0 && fallback && (
            <View style={{ gap: 3 }}>
              <Text style={styles.factText}>{`${fallback.rocket} launched ${fallback.mission}`}</Text>
              <View style={styles.row6}>
                <Flag country={fallback.country} width={18} />
                <Text style={styles.small}>{`${fallback.country} ${fallback.year}`}</Text>
              </View>
            </View>
          )}
          {facts.length === 0 && !fallback && <Text style={styles.factText}>Nothing on record for this day yet.</Text>}
        </View>
      </View>

      <CountryFilter value={who} onChange={(c) => jump(c === who ? null : c)} />

      <View style={styles.grid}>
        <View style={styles.tile}>
          <Text style={styles.small}>Orbital launches</Text>
          <Text style={styles.big}>{formatNumber(stats[0])}</Text>
          <Text style={styles.small}>{`since ${stats[4]}`}</Text>
        </View>
        <View style={[styles.tile, styles.tileRow]}>
          <Ring percent={stats[1]} />
          <View>
            <Text style={styles.mid}>{stats[1]}%</Text>
            <Text style={styles.small}>Success rate</Text>
          </View>
        </View>
        <View style={styles.tile}>
          <Text style={styles.small}>Crewed flights</Text>
          <Text style={styles.big}>{stats[2]}</Text>
          <Text style={styles.small}>{crewedLive ? 'on own rockets' : 'sample figure'}</Text>
        </View>
        <View style={styles.tile}>
          <Text style={styles.small}>Astronauts in total</Text>
          <Text style={styles.big}>{stats[3]}</Text>
          <Text style={styles.small}>{peopleLive ? 'flown to space' : 'sample figure'}</Text>
        </View>
      </View>

      <View style={styles.tm}>
        <View style={styles.tmHead}>
          <Text style={styles.tmTitle} accessibilityRole="header">Time Machine</Text>
          <Text style={styles.year}>{year}</Text>
        </View>
        <View>
          {bars.map((c) => {
            const sel = who === c;
            const dim = who !== null && !sel;
            return (
              <Pressable
                key={c}
                onPress={() => jump(sel ? null : c)}
                accessibilityRole="button"
                accessibilityState={{ selected: sel }}
                accessibilityLabel={`${c}, ${points[c]} points by ${year}. Show only this country`}
                style={[styles.bar, sel && styles.barSel, dim && { opacity: 0.45 }]}>
                <Flag country={c} width={22} />
                <Text style={styles.barName}>{c}</Text>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { width: `${(points[c] / SCALE) * 100}%`, backgroundColor: sel ? C.orange : C.sky }]} />
                </View>
                <Text style={styles.barPts}>{points[c]}</Text>
              </Pressable>
            );
          })}
        </View>
        <Slider
          minimumValue={FIRST_YEAR}
          maximumValue={LAST_YEAR}
          step={1}
          value={year}
          onValueChange={(v) => setYear(Math.round(v))}
          minimumTrackTintColor={C.orange}
          maximumTrackTintColor={C.line}
          thumbTintColor={C.text}
          accessibilityLabel="Year"
          style={{ height: 44 }}
        />
        <Text style={styles.small}>{countNote}</Text>
        <View>
          {mine.slice(0, 5).map((e) => (
            <View key={`${e.year}-${e.country}-${e.name}`} style={styles.event}>
              <Text style={styles.eventYear}>{e.year}</Text>
              <Flag country={e.country} width={27} label />
              <Text style={styles.eventName}>{e.name}</Text>
              <Text style={styles.eventPts}>+{e.points}</Text>
            </View>
          ))}
          {mine.length === 0 && <Text style={[styles.small, styles.eventEmpty]}>{`${who ?? 'No country'} had reached a milestone by ${year}.`}</Text>}
        </View>
      </View>
      <Section title="About" count={0} hideCount open={aboutOpen} onToggle={() => setAboutOpen(!aboutOpen)}>
        <View style={styles.about}>
          <Text style={styles.aboutText}>{`Space Race 2.0, version ${Constants.expoConfig?.version ?? '1.0.0'}`}</Text>
          <Text style={styles.small}>Launch, crew and statistics data: Launch Library 2 by The Space Devs. Station orbits: CelesTrak. Milestones and dates compiled for this app, which also sets the points for each milestone.</Text>
          <Text style={styles.small}>The app collects no personal data. Reminders are scheduled on your phone only.</Text>
          <Pressable onPress={() => WebBrowser.openBrowserAsync(PRIVACY_URL)} accessibilityRole="link" hitSlop={6}>
            <Text style={styles.link}>Privacy policy</Text>
          </Pressable>
          <Pressable onPress={() => WebBrowser.openBrowserAsync(SUPPORT_URL)} accessibilityRole="link" hitSlop={6}>
            <Text style={styles.link}>Feedback and support</Text>
          </Pressable>
          <Pressable onPress={() => WebBrowser.openBrowserAsync(CONTACT_URL)} accessibilityRole="link" hitSlop={6}>
            <Text style={styles.link}>Contact</Text>
          </Pressable>
        </View>
      </Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  dayCard: { flexDirection: 'row', gap: 14, alignItems: 'center', padding: 14, paddingHorizontal: 16, borderRadius: 18, borderWidth: 1, borderColor: C.line, backgroundColor: C.card },
  dateTile: { width: 64, height: 72, borderRadius: 12, backgroundColor: C.sky, alignItems: 'center', justifyContent: 'center' },
  dateNum: { fontFamily: F.display, fontSize: 30, lineHeight: 32, color: C.bg },
  dateMonth: { fontSize: 12, fontWeight: '600', color: C.bg },
  factText: { fontSize: 16, fontWeight: '600', lineHeight: 21, color: C.text },
  row6: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  small: { fontSize: 12, color: C.muted, lineHeight: 17 },
  about: { padding: 14, borderRadius: 16, borderWidth: 1, borderColor: C.line, backgroundColor: C.card, gap: 8 },
  aboutText: { fontSize: 14, fontWeight: '600', color: C.text },
  link: { fontSize: 14, fontWeight: '600', color: C.sky },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  tile: { width: '48%', flexGrow: 1, padding: 12, paddingHorizontal: 14, borderRadius: 16, borderWidth: 1, borderColor: C.line, backgroundColor: C.card, gap: 2 },
  tileRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  big: { fontFamily: F.display, fontSize: 28, color: C.text, fontVariant: ['tabular-nums'] },
  mid: { fontFamily: F.display, fontSize: 24, color: C.text },
  tm: { padding: 14, paddingHorizontal: 16, borderRadius: 18, borderWidth: 1, borderColor: C.line, backgroundColor: C.panel, gap: 8 },
  tmHead: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
  tmTitle: { fontSize: 14, fontWeight: '600', color: C.text },
  year: { fontFamily: F.display, fontSize: 30, color: C.sky, fontVariant: ['tabular-nums'] },
  bar: { flexDirection: 'row', alignItems: 'center', gap: 8, height: 40, paddingHorizontal: 6, borderRadius: 10, borderWidth: 1, borderColor: 'transparent' },
  barSel: { borderColor: C.sky, backgroundColor: 'rgba(90,176,255,0.14)' },
  barName: { width: 58, fontSize: 13, fontWeight: '600', color: C.text },
  barTrack: { flex: 1, height: 10, borderRadius: 999, backgroundColor: C.lineSoft, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 999 },
  barPts: { width: 34, textAlign: 'right', fontFamily: F.display, fontSize: 14, color: C.text, fontVariant: ['tabular-nums'] },
  event: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 8, borderTopWidth: 1, borderTopColor: C.lineSoft },
  eventYear: { width: 44, fontFamily: F.display, fontSize: 15, color: C.orange, fontVariant: ['tabular-nums'] },
  eventName: { flex: 1, fontSize: 14, fontWeight: '600', lineHeight: 18, color: C.text },
  eventPts: { width: 36, textAlign: 'right', fontSize: 13, fontWeight: '700', color: C.orangeSoft },
  eventEmpty: { paddingVertical: 8, borderTopWidth: 1, borderTopColor: C.lineSoft },
});
