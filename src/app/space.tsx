import { Image } from 'expo-image';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { Flag } from '@/components/flag';
import { LivePill, Screen } from '@/components/screen';
import { Segmented } from '@/components/toggles';
import { C, F } from '@/constants/theme';
import type { Country } from '@/data/countries';
import { STATION_NOTES, type Station } from '@/data/crew';
import { EXPEDITIONS_URL, parseExpeditions } from '@/lib/ll2';
import { HOUR, useRemote } from '@/lib/remote';

const STATION_ART = require('@/assets/images/scenes/station.png');

function Helmet() {
  return (
    <Svg width={42} height={42} viewBox="0 0 40 40">
      <Circle cx={20} cy={18} r={15} fill="#E9EEF7" />
      <Path d="M9 17 C9 10 31 10 31 17 C31 24 26 27 20 27 C14 27 9 24 9 17 Z" fill="#1C5BB0" />
      <Path d="M13 14 C15 12 19 11 22 12" stroke={C.skySoft} strokeWidth={2} fill="none" strokeLinecap="round" />
      <Rect x={11} y={31} width={18} height={6} rx={3} fill="#B9C6DC" />
    </Svg>
  );
}

export default function SpaceScreen() {
  const [station, setStation] = useState<Station>('ISS');
  const [open, setOpen] = useState<number>(0);

  const { data, state } = useRemote('ll2-crew', EXPEDITIONS_URL, HOUR, parseExpeditions);
  const [now] = useState(() => Date.now());
  const everyone = useMemo(() => data ?? [], [data]);
  const crew = everyone.filter((p) => p.station === station).sort((a, b) => a.lastFlight - b.lastFlight || b.totalDays - a.totalDays);
  const count = (s: Station) => everyone.filter((p) => p.station === s).length;
  const tally = useMemo(() => {
    const counts = new Map<string, { country: Country | null; code: string; n: number }>();
    for (const p of everyone) {
      const key = p.country ?? p.code;
      const cur = counts.get(key) ?? { country: p.country, code: p.code, n: 0 };
      cur.n += 1;
      counts.set(key, cur);
    }
    return [...counts.values()].sort((a, b) => b.n - a.n);
  }, [everyone]);

  const pickStation = (s: Station) => {
    setStation(s);
    setOpen(0);
  };

  return (
    <Screen title="In Space" right={<LivePill state={state} />}>
      <View style={styles.hero}>
        <Image source={STATION_ART} style={styles.fill} contentFit="cover" accessible={false} />
        <View style={styles.heroText}>
          <Text style={styles.count} accessibilityLabel={`${everyone.length} people off Earth`}>{everyone.length}</Text>
          <Text style={styles.countLabel}>People off Earth</Text>
        </View>
        <View style={styles.tally}>
          {tally.slice(0, 6).map((t) => (
            <View key={t.country ?? t.code} style={styles.tallyChip} accessible accessibilityLabel={`${t.country ?? t.code}: ${t.n}`}>
              <Flag country={t.country} code={t.code} width={18} />
              <Text style={styles.tallyText}>{t.n}</Text>
            </View>
          ))}
        </View>
      </View>

      <Segmented
        options={[
          { value: 'ISS', label: `ISS (${count('ISS')})` },
          { value: 'Tiangong', label: `Tiangong (${count('Tiangong')})` },
        ]}
        value={station}
        onChange={pickStation}
      />
      <Text style={styles.note}>{STATION_NOTES[station]}</Text>

      <View style={{ gap: 8 }}>
        {crew.map((p, i) => {
          const expanded = open === i;
          const daysUp = Math.max(0, Math.floor((now - p.lastFlight) / 86400000));
          return (
            <Pressable
              key={p.id}
              onPress={() => setOpen(expanded ? -1 : i)}
              accessibilityRole="button"
              accessibilityState={{ expanded }}
              accessibilityLabel={`${p.name}, ${p.role}, ${p.nationality}, ${daysUp} days in space`}
              style={styles.card}>
              <View style={styles.cardRow}>
                <View style={styles.avatar}>
                  <Helmet />
                  <View style={styles.badge}>
                    <Flag country={p.country} code={p.code} width={20} />
                  </View>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>{p.name}</Text>
                  <Text style={styles.role}>{p.role}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.days}>{daysUp}</Text>
                  <Text style={styles.tiny}>days up</Text>
                </View>
              </View>
              {expanded && (
                <View style={styles.details}>
                  {([['Country', p.nationality || p.code], ['Agency', p.agency || '–'], ['In space total', `${p.totalDays} days`]] as const).map(([k, v]) => (
                    <View key={k} style={styles.detail}>
                      <Text style={styles.tiny}>{k}</Text>
                      <Text style={styles.detailValue}>{v}</Text>
                    </View>
                  ))}
                </View>
              )}
            </Pressable>
          );
        })}
        {crew.length === 0 && (
          <Text style={styles.role}>{state === 'loading' ? 'Loading crews…' : state === 'error' ? 'Crews could not be loaded. Check your connection.' : 'Nobody on board right now.'}</Text>
        )}
      </View>
      <Text style={styles.credit}>Crew data: Launch Library 2 by The Space Devs</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  fill: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' },
  hero: { height: 200, borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: C.line, backgroundColor: '#050E24' },
  heroText: { position: 'absolute', left: 18, top: 16 },
  count: { fontFamily: F.display, fontSize: 72, lineHeight: 76, color: C.text, fontVariant: ['tabular-nums'] },
  countLabel: { fontSize: 15, color: '#CFE3FF' },
  tally: { position: 'absolute', left: 18, bottom: 14, flexDirection: 'row', gap: 6 },
  tallyChip: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingLeft: 4, paddingRight: 8, paddingVertical: 3, borderRadius: 999, borderWidth: 1, borderColor: C.line, backgroundColor: 'rgba(6,18,43,0.8)' },
  tallyText: { fontSize: 12, fontWeight: '600', color: C.text },
  note: { fontSize: 13, color: C.muted, marginTop: -4 },
  card: { borderRadius: 14, borderWidth: 1, borderColor: C.line, backgroundColor: C.card, paddingVertical: 10, paddingHorizontal: 12, gap: 8 },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 42, height: 42 },
  badge: { position: 'absolute', right: -4, bottom: -1, borderWidth: 1.5, borderColor: C.bg, borderRadius: 3 },
  name: { fontSize: 15, fontWeight: '600', color: C.text },
  role: { fontSize: 13, color: C.muted },
  days: { fontFamily: F.display, fontSize: 17, color: C.sky },
  tiny: { fontSize: 11, color: C.muted },
  credit: { fontSize: 11, color: C.dim },
  details: { flexDirection: 'row', gap: 8 },
  detail: { flex: 1, borderRadius: 10, padding: 8, backgroundColor: 'rgba(6,18,43,0.7)' },
  detailValue: { fontSize: 14, fontWeight: '600', color: C.text },
});
