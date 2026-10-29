import { useEffect, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import { Flag } from '@/components/flag';
import { C, F } from '@/constants/theme';
import type { Country } from '@/data/countries';
import { formatNumber, type Standing } from '@/lib/race';

const ROCKET_W = 32;

function Rocket() {
  return (
    <Svg width={ROCKET_W} height={20} viewBox="0 0 32 20">
      <Path d="M1 10 L9 5.5 L9 14.5 Z" fill={C.orange} />
      <Path d="M4 10 L9 7.5 L9 12.5 Z" fill="#FFD27A" />
      <Path d="M9 6 L23 6 C27 7 30 9 31 10 C30 11 27 13 23 14 L9 14 Z" fill={C.text} />
      <Circle cx={21} cy={10} r={2} fill="#185FA5" />
      <Path d="M11 6 L14 1 L17 6 Z M11 14 L14 19 L17 14 Z" fill={C.sky} />
    </Svg>
  );
}

type Props = {
  rows: Standing[];
  unit: string;
  pick: Country | null;
  onPick: (c: Country) => void;
  runKey: string;
};

export function RaceLanes({ rows, unit, pick, onPick, runKey }: Props) {
  const [trackW, setTrackW] = useState(0);
  const [progress] = useState(() => rows.map(() => new Animated.Value(0)));
  const max = Math.max(1, ...rows.map((r) => r.value));

  useEffect(() => {
    progress.forEach((p) => p.setValue(0));
    const anims = rows.map((r, i) =>
      Animated.timing(progress[i], {
        toValue: r.value / max,
        duration: 1500,
        delay: 250 + i * 120,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
    );
    const run = Animated.parallel(anims);
    run.start();
    return () => run.stop();
    // runKey changes whenever the race should restart
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runKey]);

  const travel = Math.max(0, trackW - ROCKET_W);

  return (
    <View>
      {rows.map((r, i) => {
        const sel = pick === r.country;
        const dim = pick !== null && !sel;
        const x = progress[i].interpolate({ inputRange: [0, 1], outputRange: [0, travel] });
        return (
          <Pressable
            key={r.country}
            onPress={() => onPick(r.country)}
            accessibilityRole="button"
            accessibilityState={{ selected: sel }}
            accessibilityLabel={`${r.country}, ${formatNumber(r.value)} ${unit}. Show only this country`}
            style={[styles.row, sel && styles.rowSel, dim && { opacity: 0.45 }]}>
            <View style={styles.name}>
              <Flag country={r.country} />
              <Text style={styles.nameText}>{r.country}</Text>
            </View>
            <View style={styles.track} onLayout={i === 0 ? (e) => setTrackW(e.nativeEvent.layout.width) : undefined}>
              <View style={styles.dash} />
              <Animated.View style={[styles.trail, { width: x }]} />
              <Animated.View style={[styles.rocket, { transform: [{ translateX: x }] }]}>
                <Rocket />
              </Animated.View>
            </View>
            <Text style={styles.value}>{formatNumber(r.value)}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, height: 48, paddingHorizontal: 6, borderRadius: 10, borderWidth: 1, borderColor: 'transparent' },
  rowSel: { borderColor: C.sky, backgroundColor: 'rgba(90,176,255,0.14)' },
  name: { width: 84, flexDirection: 'row', alignItems: 'center', gap: 7 },
  nameText: { fontSize: 13, fontWeight: '600', color: C.text },
  track: { flex: 1, height: 34, justifyContent: 'center' },
  dash: { position: 'absolute', left: 0, right: 0, top: 16, borderTopWidth: 1, borderStyle: 'dashed', borderColor: C.line },
  trail: { position: 'absolute', left: 0, top: 15.5, height: 3, borderRadius: 2, backgroundColor: 'rgba(255,159,67,0.7)' },
  rocket: { position: 'absolute', left: 0, top: 7 },
  value: { width: 52, textAlign: 'right', fontFamily: F.display, fontSize: 15, color: C.text, fontVariant: ['tabular-nums'] },
});
