import { LinearGradient } from 'expo-linear-gradient';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import Svg, { Path } from 'react-native-svg';

import { CountryFilter } from '@/components/country-filter';
import { Flag } from '@/components/flag';
import { Section } from '@/components/section';
import { LivePill, Screen } from '@/components/screen';
import { C, F } from '@/constants/theme';
import type { Country } from '@/data/countries';
import { parseLaunches, relative, UPCOMING_URL } from '@/lib/ll2';
import { useReminders } from '@/lib/reminders';
import { MINUTE, useRemote } from '@/lib/remote';

const PAD = require('@/assets/images/scenes/launch-pad.png');

const pad2 = (n: number) => (n < 10 ? `0${n}` : String(n));

function useNow(ms: number) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), ms);
    return () => clearInterval(id);
  }, [ms]);
  return now;
}

function PlayIcon({ color, size = 14 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M7 4l13 8-13 8z" fill={color} />
    </Svg>
  );
}

function BellIcon({ filled }: { filled: boolean }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill={filled ? C.text : 'none'} stroke={C.text} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <Path d="M10 21a2 2 0 0 0 4 0" fill="none" />
    </Svg>
  );
}

const statusStyle = (s: string) => (s === 'Go' ? styles.go : s === 'TBC' ? styles.tbc : s === 'Hold' ? styles.hold : styles.tbd);

export default function LaunchesScreen() {
  const { data, state } = useRemote('ll2-upcoming-v2', UPCOMING_URL, 15 * MINUTE, parseLaunches);
  const now = useNow(1000);
  const [filter, setFilter] = useState<Country | null>(null);
  const [picked, setPicked] = useState<string | null>(null);
  const reminders = useReminders();
  const [notice, setNotice] = useState<string | null>(null);
  const [openList, setOpenList] = useState(true);
  const [showAll, setShowAll] = useState(false);

  // Launches stay listed until they have lifted off.
  const upcoming = useMemo(() => (data ?? []).filter((l) => l.net > now - 60000).sort((a, b) => a.net - b.net), [data, now]);
  const list = useMemo(() => upcoming.filter((l) => !filter || l.country === filter), [upcoming, filter]);
  const top = list.find((l) => l.id === picked) ?? list[0];

  const left = top ? Math.max(0, Math.floor((top.net - now) / 1000)) : 0;
  const cd = { d: pad2(Math.floor(left / 86400)), h: pad2(Math.floor((left % 86400) / 3600)), m: pad2(Math.floor((left % 3600) / 60)), s: pad2(left % 60) };
  const isNext = top && top.id === list[0]?.id;

  const pickFilter = (c: Country | null) => {
    setFilter(c === filter ? null : c);
    setPicked(null);
  };
  const open = (url?: string) => {
    if (url) WebBrowser.openBrowserAsync(url);
  };

  return (
    <Screen title="Launch" right={<LivePill state={state} />}>
      <View style={styles.hero}>
        <Image source={PAD} style={styles.fill} contentFit="cover" accessible={false} />
        <LinearGradient
          pointerEvents="none"
          colors={['rgba(6,18,43,0.92)', 'rgba(6,18,43,0.55)', 'rgba(6,18,43,0)']}
          locations={[0, 0.55, 0.8]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={StyleSheet.absoluteFill}
        />
        {top ? (
          <>
            <View style={styles.heroText}>
              <View style={styles.row6}>
                <Flag country={top.country} width={21} />
                <Text style={styles.heroLabel}>{isNext ? (filter ? `Next launch from ${filter}` : 'Next launch') : 'Upcoming launch'}</Text>
              </View>
              <Text style={styles.heroRocket} numberOfLines={2}>{top.rocket}</Text>
              <Text style={styles.heroLine} numberOfLines={2}>{top.mission}</Text>
              <Text style={styles.heroLine} numberOfLines={1}>{top.site}</Text>
            </View>
            {top.stream && (
              <Pressable onPress={() => open(top.stream)} accessibilityRole="link" style={styles.live}>
                <PlayIcon color={C.orange} />
                <Text style={styles.liveText}>{top.streamIsLive ? 'Watch live' : 'Launch page'}</Text>
              </Pressable>
            )}
            <View style={styles.countRow}>
              {([['d', 'days'], ['h', 'hrs'], ['m', 'min'], ['s', 'sec']] as const).map(([k, label]) => (
                <View key={k} style={styles.countTile}>
                  <Text style={[styles.countNum, k === 's' && { color: C.sky }]}>{cd[k]}</Text>
                  <Text style={styles.countLabel}>{label}</Text>
                </View>
              ))}
              <Pressable
                onPress={async () => {
                  const r = await reminders.toggle(top);
                  setNotice(
                    r === 'on' ? 'Reminder set for 30 minutes before launch.'
                    : r === 'off' ? 'Reminder removed.'
                    : r === 'denied' ? 'Allow notifications for Space Race in iPhone Settings to get reminders.'
                    : 'Too close to launch for a reminder.',
                  );
                }}
                accessibilityRole="button"
                accessibilityLabel={reminders.isOn(top.id) ? 'Reminder on. Tap to turn off' : 'Remind me 30 minutes before launch'}
                accessibilityState={{ selected: reminders.isOn(top.id) }}
                style={styles.bell}>
                <BellIcon filled={reminders.isOn(top.id)} />
              </Pressable>
            </View>
          </>
        ) : (
          <View style={styles.heroText}>
            <Text style={styles.heroLine}>{state === 'loading' ? 'Loading launches…' : state === 'error' ? 'Launches could not be loaded. Check your connection.' : 'No upcoming launch found.'}</Text>
          </View>
        )}
      </View>

      {notice && <Text style={styles.notice} accessibilityLiveRegion="polite">{notice}</Text>}
      <CountryFilter value={filter} onChange={pickFilter} />

      <Section title={filter ? `Upcoming from ${filter}` : 'Upcoming launches'} count={list.length} open={openList} onToggle={() => setOpenList(!openList)}>
        {(showAll ? list : list.slice(0, 10)).map((l) => {
          const onTop = top?.id === l.id;
          return (
            <Pressable
              key={l.id}
              onPress={() => setPicked(picked === l.id ? null : l.id)}
              accessibilityRole="button"
              accessibilityState={{ selected: onTop }}
              accessibilityLabel={`${l.rocket}, ${l.mission}, ${relative(l.net, now)}. Show at the top`}
              style={[styles.card, onTop && styles.cardOn]}>
              <Flag country={l.country} width={36} label />
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={styles.cardTitle} numberOfLines={1}>{l.rocket}</Text>
                <Text style={styles.small} numberOfLines={2}>{`${l.mission}, ${l.site}`}</Text>
                {l.stream && (
                  <Pressable onPress={() => open(l.stream)} accessibilityRole="link" hitSlop={8} style={styles.streamLink}>
                    <PlayIcon color={C.sky} size={12} />
                    <Text style={styles.streamText}>{l.streamIsLive ? 'Livestream' : 'Launch page'}</Text>
                  </Pressable>
                )}
              </View>
              <View style={{ alignItems: 'flex-end', gap: 4 }}>
                <Text style={[styles.status, statusStyle(l.status)]}>{l.status}</Text>
                <Text style={styles.small}>{relative(l.net, now)}</Text>
              </View>
            </Pressable>
          );
        })}
        {list.length > 10 && (
          <Pressable onPress={() => setShowAll(!showAll)} accessibilityRole="button" accessibilityState={{ expanded: showAll }} style={styles.moreBtn}>
            <Text style={styles.moreText}>{showAll ? 'Show fewer' : 'Show more launches'}</Text>
          </Pressable>
        )}
        {list.length === 0 && state !== 'loading' && <Text style={styles.small}>No upcoming launches for this country.</Text>}
      </Section>
      <Text style={styles.credit}>Launch data: Launch Library 2 by The Space Devs</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  fill: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' },
  hero: { height: 270, borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: C.line, backgroundColor: '#081A3A' },
  heroText: { position: 'absolute', left: 18, top: 18, right: 130, gap: 6 },
  row6: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  heroLabel: { fontSize: 13, color: '#CFE3FF', flexShrink: 1 },
  heroRocket: { fontFamily: F.display, fontSize: 24, color: C.text },
  heroLine: { fontSize: 13, color: '#CFE3FF' },
  live: { position: 'absolute', top: 14, right: 14, height: 36, paddingHorizontal: 12, borderRadius: 999, borderWidth: 1, borderColor: C.sky, backgroundColor: 'rgba(6,18,43,0.85)', flexDirection: 'row', alignItems: 'center', gap: 6 },
  liveText: { fontSize: 13, fontWeight: '600', color: C.text },
  countRow: { position: 'absolute', left: 14, right: 14, bottom: 14, flexDirection: 'row', gap: 6 },
  countTile: { flex: 1, paddingVertical: 6, borderRadius: 10, borderWidth: 1, borderColor: C.line, backgroundColor: 'rgba(6,18,43,0.78)', alignItems: 'center' },
  countNum: { fontFamily: F.display, fontSize: 22, color: C.text, fontVariant: ['tabular-nums'] },
  countLabel: { fontSize: 11, color: C.muted },
  bell: { width: 60, borderRadius: 10, backgroundColor: 'rgba(90,176,255,0.55)', alignItems: 'center', justifyContent: 'center' },
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, paddingHorizontal: 14, borderRadius: 14, borderWidth: 1, borderColor: C.line, backgroundColor: C.card },
  cardOn: { borderColor: C.sky, backgroundColor: 'rgba(90,176,255,0.12)' },
  cardTitle: { fontSize: 15, fontWeight: '600', color: C.text },
  small: { fontSize: 13, color: C.muted },
  credit: { fontSize: 11, color: C.dim },
  notice: { fontSize: 13, color: C.skySoft, marginTop: -6 },
  moreBtn: { height: 44, borderRadius: 12, borderWidth: 1, borderColor: C.line, backgroundColor: C.card, alignItems: 'center', justifyContent: 'center' },
  moreText: { fontSize: 14, fontWeight: '600', color: C.text },
  streamLink: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2, alignSelf: 'flex-start' },
  streamText: { fontSize: 13, fontWeight: '600', color: C.sky },
  status: { fontSize: 12, fontWeight: '600', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999, overflow: 'hidden' },
  go: { backgroundColor: 'rgba(61,220,151,0.15)', color: C.green },
  tbc: { backgroundColor: 'rgba(90,176,255,0.15)', color: C.sky },
  tbd: { backgroundColor: 'rgba(169,185,214,0.12)', color: C.muted },
  hold: { backgroundColor: 'rgba(255,159,67,0.15)', color: C.orangeSoft },
});
