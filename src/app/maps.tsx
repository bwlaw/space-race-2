import { Image } from 'expo-image';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Ellipse, Path } from 'react-native-svg';

import { Flag } from '@/components/flag';
import type { Country } from '@/data/countries';
import { LivePill, Screen } from '@/components/screen';
import { Segmented } from '@/components/toggles';
import { C, F } from '@/constants/theme';
import { BODY_INFO, BODY_STATS, MARS_ORBITERS, PLACES, STATIONS, type Body } from '@/data/places';
import { MAP_H, MAP_W, ORBITS, project, stationAt, trackPath } from '@/lib/maps';
import { HOUR, useRemote } from '@/lib/remote';
import { fixAt, groundTrack, parseTle, satrecFrom, TLE_URLS } from '@/lib/stations';

type Orbit = 'ISS' | 'Tiangong' | 'Both';

const MAP_IMAGES: Record<Body, number> = {
  Earth: require('@/assets/images/scenes/earth.png'),
  Moon: require('@/assets/images/scenes/moon.png'),
  Mars: require('@/assets/images/scenes/mars.png'),
};

const ISS_TRACK = trackPath(ORBITS.ISS.inclination, ORBITS.ISS.offset);
const TG_TRACK = trackPath(ORBITS.Tiangong.inclination, ORBITS.Tiangong.offset);

function useNow(ms: number) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), ms);
    return () => clearInterval(id);
  }, [ms]);
  return now;
}

const toPath = (segments: [number, number][][]) =>
  segments
    .map((seg) => seg.map(([lon, lat], i) => { const [x, y] = project(lon, lat); return `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`; }).join(''))
    .join('');

function Chevron({ open }: { open: boolean }) {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" style={{ transform: [{ rotate: open ? '180deg' : '0deg' }] }}>
      <Path d="M6 9l6 6 6-6" fill="none" stroke={C.muted} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function Section({ title, count, open, onToggle, children }: { title: string; count: number; open: boolean; onToggle: () => void; children: ReactNode }) {
  return (
    <View style={{ gap: 6 }}>
      <Pressable onPress={onToggle} accessibilityRole="button" accessibilityState={{ expanded: open }} style={styles.sectionHead}>
        <Text style={styles.h2} accessibilityRole="header">{title}</Text>
        <View style={styles.sectionRight}>
          <Text style={styles.small}>{count}</Text>
          <Chevron open={open} />
        </View>
      </Pressable>
      {open && children}
    </View>
  );
}

type ItemProps = {
  on: boolean;
  onPress: () => void;
  name: string;
  sub: string;
  country: Country | null;
  code?: string;
  dot: 'orange' | 'mars' | 'sky';
  accent: string;
  kind: string;
  inUse: string;
  note: string;
};

function ItemRow({ on, onPress, name, sub, country, code, dot, accent, kind, inUse, note }: ItemProps) {
  const dotStyle =
    dot === 'mars'
      ? { backgroundColor: C.text, borderWidth: 2.5, borderColor: C.sky }
      : dot === 'sky'
        ? { backgroundColor: C.sky, borderWidth: 1.5, borderColor: C.text }
        : { backgroundColor: C.orange };
  const tint = accent === C.sky ? 'rgba(90,176,255,0.12)' : 'rgba(255,159,67,0.12)';
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityState={{ expanded: on }} style={[styles.item, on && { borderColor: accent, backgroundColor: tint }]}>
      <View style={styles.itemHead}>
        <View style={[styles.rowDot, dotStyle]} />
        <Flag country={country} code={code} width={24} />
        <Text style={styles.rowName} numberOfLines={on ? 2 : 1}>{name}</Text>
        <Text style={styles.small}>{sub}</Text>
        <Chevron open={on} />
      </View>
      {on && (
        <View style={styles.itemBody}>
          {!!kind && <Text style={styles.small}>{kind}</Text>}
          <Text style={styles.inUse}>{inUse}</Text>
          <Text style={styles.infoNote}>{note}</Text>
        </View>
      )}
    </Pressable>
  );
}

export default function MapsScreen() {
  const [body, setBody] = useState<Body>('Earth');
  const [orbit, setOrbit] = useState<Orbit>('Both');
  const [sel, setSel] = useState<string | null>(null);
  const [openList, setOpenList] = useState(false);
  const [openOrbiters, setOpenOrbiters] = useState(false);
  const now = useNow(2000);
  const issTle = useRemote('tle-iss', TLE_URLS.ISS, 6 * HOUR, parseTle, true);
  const tgTle = useRemote('tle-tiangong', TLE_URLS.Tiangong, 6 * HOUR, parseTle, true);
  const issSat = useMemo(() => satrecFrom(issTle.data), [issTle.data]);
  const tgSat = useMemo(() => satrecFrom(tgTle.data), [tgTle.data]);
  const minute = Math.floor(now / 60000);
  const issTrack = useMemo(() => (issSat ? toPath(groundTrack(issSat, minute * 60000)) : ISS_TRACK), [issSat, minute]);
  const tgTrack = useMemo(() => (tgSat ? toPath(groundTrack(tgSat, minute * 60000)) : TG_TRACK), [tgSat, minute]);
  const issFix = issSat ? fixAt(issSat, new Date(now)) : null;
  const tgFix = tgSat ? fixAt(tgSat, new Date(now)) : null;
  const t = Math.floor(now / 200) % 360;
  const liveState = issTle.state === 'live' && tgTle.state === 'live' ? 'live' : issTle.state === 'loading' || tgTle.state === 'loading' ? 'loading' : issTle.data && tgTle.data ? 'saved' : 'error';

  const isEarth = body === 'Earth';
  const isMars = body === 'Mars';
  const accent = isMars ? C.sky : C.orange;
  const cardAccent = body === 'Moon' ? C.sky : accent;
  const orbiters = useMemo(() => (isMars ? [...MARS_ORBITERS].sort((a, b) => b.year - a.year) : []), [isMars]);
  const orbiter = orbiters.find((o) => o.key === sel) ?? null;
  const places = useMemo(() => [...PLACES[body]].sort((a, b) => b.year - a.year), [body]);
  const showIss = isEarth && orbit !== 'Tiangong';
  const showTg = isEarth && orbit !== 'ISS';
  const stationSel = (sel === 'ISS' && showIss) || (sel === 'Tiangong' && showTg) ? (sel as 'ISS' | 'Tiangong') : null;
  const place = places.find((p) => p.name === sel) ?? null;
  const curKey = stationSel ?? orbiter?.key ?? place?.name ?? null;
  const info = stationSel
    ? { ...STATIONS[stationSel], color: ORBITS[stationSel].color }
    : place
      ? { name: place.name, countries: place.country ? [place.country] : [], codes: place.code ? [place.code] : [], kind: place.kind, inUse: place.inUse, note: place.note, color: cardAccent }
      : orbiter
        ? { ...orbiter, color: C.sky }
      : isEarth
        ? { ...STATIONS.ISS, color: ORBITS.ISS.color }
        : { ...BODY_INFO[body as 'Moon' | 'Mars'], color: cardAccent };
  const iss = issFix ? project(issFix.lon, issFix.lat) : stationAt(t - 180, ORBITS.ISS.inclination, ORBITS.ISS.offset);
  const tg = tgFix ? project(tgFix.lon, tgFix.lat) : stationAt(((t + 150) % 360) - 180, ORBITS.Tiangong.inclination, ORBITS.Tiangong.offset);
  const fmt = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const liveStats = (name: string, f: typeof issFix) =>
    f
      ? [{ label: `${name} speed`, value: fmt(f.speedKmh), unit: 'km/h, live' }, { label: 'Altitude', value: fmt(f.altKm), unit: 'km, live' }, { label: 'Position', value: `${Math.abs(f.lat).toFixed(0)}°${f.lat >= 0 ? 'N' : 'S'}`, unit: `${Math.abs(f.lon).toFixed(0)}°${f.lon >= 0 ? 'E' : 'W'}` }]
      : null;
  const stats = !isEarth
    ? BODY_STATS[body]
    : orbit === 'ISS'
      ? liveStats('ISS', issFix) ?? BODY_STATS.ISS
      : orbit === 'Tiangong'
        ? liveStats('Tiangong', tgFix) ?? BODY_STATS.Tiangong
        : issFix && tgFix
          ? [{ label: 'ISS altitude', value: fmt(issFix.altKm), unit: 'km, live' }, { label: 'Tiangong', value: fmt(tgFix.altKm), unit: 'km, live' }, { label: 'One orbit', value: '~92', unit: 'minutes each' }]
          : BODY_STATS.Both;
  const toggle = (key: string) => setSel(sel === key ? null : key);

  // Tapping a highlighted orbit button again clears it and shows both orbits without highlight.
  const pickOrbit = (o: Orbit) => {
    if (sel === o) {
      setSel(null);
      setOrbit('Both');
      return;
    }
    setOrbit(o);
    setSel(o);
  };

  const pickBody = (b: Body) => {
    setBody(b);
    setSel(null);
  };

  return (
    <Screen title="Maps" right={isEarth ? <LivePill state={liveState} /> : undefined}>
      <Segmented options={[{ value: 'Earth', label: 'Earth' }, { value: 'Moon', label: 'Moon' }, { value: 'Mars', label: 'Mars' }]} value={body} onChange={pickBody} />

      <View style={styles.map}>
        <Image source={MAP_IMAGES[body]} style={styles.fill} contentFit="contain" accessibilityLabel={`Map of ${body}`} />
        <Svg width="100%" height="100%" viewBox={`0 0 ${MAP_W} ${MAP_H}`} style={StyleSheet.absoluteFill} pointerEvents="none">
          {isMars && <Ellipse cx={175} cy={120} rx={172} ry={115} fill="none" stroke={C.sky} strokeOpacity={0.35} strokeWidth={1} strokeDasharray="3 5" />}
          {showIss && <Path d={issTrack} fill="none" stroke={ORBITS.ISS.color} strokeWidth={2} strokeDasharray="5 4" />}
          {showTg && <Path d={tgTrack} fill="none" stroke={ORBITS.Tiangong.color} strokeWidth={2} strokeDasharray="5 4" />}
          {showIss && (
            <>
              <Circle cx={iss[0]} cy={iss[1]} r={stationSel === 'ISS' ? 15 : 12} fill={ORBITS.ISS.color} opacity={stationSel === 'ISS' ? 0.4 : 0.25} />
              <Circle cx={iss[0]} cy={iss[1]} r={6} fill={C.text} stroke={ORBITS.ISS.color} strokeWidth={2.5} />
            </>
          )}
          {showTg && (
            <>
              <Circle cx={tg[0]} cy={tg[1]} r={stationSel === 'Tiangong' ? 15 : 12} fill={ORBITS.Tiangong.color} opacity={stationSel === 'Tiangong' ? 0.4 : 0.25} />
              <Circle cx={tg[0]} cy={tg[1]} r={6} fill={C.text} stroke={ORBITS.Tiangong.color} strokeWidth={2.5} />
            </>
          )}
        </Svg>
        {places.map((p) => {
          const [x, y] = project(p.lon, p.lat);
          const on = p.name === curKey;
          const size = on ? 16 : 12;
          return (
            <Pressable
              key={p.name}
              onPress={() => toggle(p.name)}
              accessibilityRole="button"
              accessibilityState={{ selected: on }}
              accessibilityLabel={`${p.name}, ${p.country ?? p.kind}`}
              style={[styles.hit, { left: `${(x / MAP_W) * 100}%`, top: `${(y / MAP_H) * 100}%` }]}>
              <View
                style={[
                  { width: size, height: size, borderRadius: 999 },
                  isMars
                    ? { backgroundColor: C.text, borderWidth: 2.5, borderColor: C.sky, boxShadow: `0 0 0 ${on ? 5 : 4}px rgba(90,176,255,${on ? 0.35 : 0.2})` }
                    : { backgroundColor: C.orange, borderWidth: 2, borderColor: on ? '#FFFFFF' : C.bg, boxShadow: on ? '0 0 0 4px rgba(255,159,67,0.35)' : undefined },
                ]}
              />
            </Pressable>
          );
        })}
        {places.filter((p) => p.label !== false || p.name === curKey).map((p) => {
          const [x, y] = project(p.lon, p.lat);
          const on = p.name === curKey;
          const top = `${((y + p.dy - 9) / MAP_H) * 100}%` as const;
          const pos =
            p.anchor === 'start'
              ? { left: `${((x + p.dx) / MAP_W) * 100}%` as const, top }
              : p.anchor === 'end'
                ? { right: `${((MAP_W - x - p.dx) / MAP_W) * 100}%` as const, top }
                : { left: `${((x + p.dx) / MAP_W) * 100}%` as const, top, width: 120, marginLeft: -60, alignItems: 'center' as const };
          return (
            <Pressable key={`label-${p.name}`} onPress={() => toggle(p.name)} hitSlop={6} accessible={false} style={[styles.label, pos]}>
              <Text style={[styles.labelText, { color: on ? (isMars ? C.skySoft : C.orangeSoft) : C.text }]}>{p.name}</Text>
            </Pressable>
          );
        })}
        {showIss && (
          <Pressable onPress={() => toggle('ISS')} accessibilityRole="button" accessibilityLabel="International Space Station" style={[styles.hit, styles.stationHit, { left: `${(iss[0] / MAP_W) * 100}%`, top: `${(iss[1] / MAP_H) * 100}%` }]} />
        )}
        {showTg && (
          <Pressable onPress={() => toggle('Tiangong')} accessibilityRole="button" accessibilityLabel="Tiangong space station" style={[styles.hit, styles.stationHit, { left: `${(tg[0] / MAP_W) * 100}%`, top: `${(tg[1] / MAP_H) * 100}%` }]} />
        )}
      </View>

      <View style={[styles.info, { borderColor: info.color }]}>
        <View style={{ flex: 1, gap: 3 }}>
          <View style={styles.infoFlags}>
            {info.countries.map((c) => <Flag key={c} country={c} width={27} label />)}
            {(info.codes ?? []).map((c) => <Flag key={c} country={null} code={c} width={27} label />)}
          </View>
          <Text style={styles.infoName}>{info.name}</Text>
          {!!info.kind && <Text style={styles.small}>{info.kind}</Text>}
          <Text style={styles.inUse}>{info.inUse}</Text>
          <Text style={styles.infoNote}>{info.note}</Text>
        </View>
      </View>

      {isEarth && (
        <View style={styles.orbits}>
          {(['ISS', 'Tiangong', 'Both'] as const).map((o) => {
            const on = sel === o;
            return (
              <Pressable key={o} onPress={() => pickOrbit(o)} accessibilityRole="button" accessibilityState={{ selected: on }} style={[styles.orbitBtn, on ? styles.orbitOn : styles.orbitOff]}>
                <View style={styles.orbitDot}>
                  {o !== 'Tiangong' && <View style={[styles.half, { backgroundColor: ORBITS.ISS.color }]} />}
                  {o !== 'ISS' && <View style={[styles.half, { backgroundColor: ORBITS.Tiangong.color }]} />}
                </View>
                <Text style={[styles.orbitText, { color: on ? C.text : C.muted }]}>{o}</Text>
              </Pressable>
            );
          })}
        </View>
      )}

      <View style={styles.stats}>
        {stats.map((s) => (
          <View key={s.label} style={styles.stat}>
            <Text style={styles.tiny}>{s.label}</Text>
            <Text style={styles.statValue}>{s.value}</Text>
            <Text style={styles.tiny}>{s.unit}</Text>
          </View>
        ))}
      </View>

      <Section
        title={isEarth ? 'Launch Sites' : 'Landers and Rovers'}
        count={places.length}
        open={openList}
        onToggle={() => setOpenList(!openList)}>
        {places.map((p) => (
          <ItemRow
            key={p.name}
            on={p.name === curKey}
            onPress={() => toggle(p.name)}
            name={p.name}
            sub={p.sub}
            country={p.country}
            code={p.code}
            dot={isMars ? 'mars' : 'orange'}
            accent={accent}
            kind={p.kind}
            inUse={p.inUse}
            note={p.note}
          />
        ))}
      </Section>
      {isMars && (
        <Section title="Orbiters" count={orbiters.length} open={openOrbiters} onToggle={() => setOpenOrbiters(!openOrbiters)}>
          {orbiters.map((o) => (
            <ItemRow
              key={o.key}
              on={o.key === curKey}
              onPress={() => toggle(o.key)}
              name={o.name}
              sub={o.sub}
              country={o.country}
              code={o.code}
              dot="sky"
              accent={C.sky}
              kind={o.kind}
              inUse={o.inUse}
              note={o.note}
            />
          ))}
        </Section>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  fill: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' },
  map: { width: '100%', aspectRatio: MAP_W / MAP_H, marginVertical: 4 },
  label: { position: 'absolute' },
  labelText: { fontSize: 10, fontWeight: '600', textShadowColor: C.bg, textShadowRadius: 3, textShadowOffset: { width: 0, height: 0 } },
  stationHit: { width: 36, height: 36, marginLeft: -18, marginTop: -18 },
  hit: { position: 'absolute', width: 28, height: 28, marginLeft: -14, marginTop: -14, alignItems: 'center', justifyContent: 'center' },
  info: { minHeight: 168, flexDirection: 'row', gap: 12, alignItems: 'flex-start', borderWidth: 1, borderRadius: 16, paddingVertical: 12, paddingHorizontal: 14, backgroundColor: 'rgba(13,33,71,0.9)' },
  infoFlags: { flexDirection: 'row', flexWrap: 'wrap', gap: 5, marginBottom: 4 },
  infoName: { fontSize: 16, fontWeight: '600', color: C.text },
  inUse: { fontSize: 13, fontWeight: '600', color: C.skySoft },
  infoNote: { fontSize: 13, lineHeight: 19, color: C.text },
  small: { fontSize: 13, color: C.muted },
  tiny: { fontSize: 11, color: C.muted },
  orbits: { flexDirection: 'row', gap: 6 },
  orbitBtn: { flex: 1, height: 44, borderRadius: 999, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  orbitOn: { borderWidth: 2, borderColor: C.sky, backgroundColor: 'rgba(90,176,255,0.18)' },
  orbitOff: { borderWidth: 1, borderColor: C.line, backgroundColor: 'rgba(13,33,71,0.8)' },
  orbitDot: { width: 10, height: 10, borderRadius: 999, overflow: 'hidden', flexDirection: 'row' },
  half: { flex: 1 },
  orbitText: { fontSize: 13, fontWeight: '600' },
  stats: { flexDirection: 'row', gap: 8 },
  stat: { flex: 1, padding: 10, borderRadius: 12, borderWidth: 1, borderColor: C.line, backgroundColor: C.card },
  statValue: { fontFamily: F.display, fontSize: 18, color: C.text },
  h2: { fontFamily: F.display, fontSize: 22, color: C.text, marginTop: 6 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 44, paddingHorizontal: 12, borderRadius: 12, borderWidth: 1, borderColor: C.line, backgroundColor: 'rgba(13,33,71,0.8)' },
  sectionHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 44, marginTop: 6 },
  sectionRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  item: { borderRadius: 12, borderWidth: 1, borderColor: C.line, backgroundColor: 'rgba(13,33,71,0.8)', paddingHorizontal: 12 },
  itemHead: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 44 },
  itemBody: { gap: 3, paddingBottom: 12, paddingLeft: 20 },
  rowDot: { width: 10, height: 10, borderRadius: 999 },
  rowName: { flex: 1, fontSize: 14, fontWeight: '600', color: C.text },
});
