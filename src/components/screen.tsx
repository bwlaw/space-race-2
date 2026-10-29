import type { ReactNode, Ref } from 'react';
import { Image } from 'expo-image';
import { ScrollView, StyleSheet, Text, View, type ScrollViewInstance } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomTabInset, C, F } from '@/constants/theme';
import type { LoadState } from '@/lib/remote';

const STARS = require('@/assets/images/scenes/starfield.png');

export function Screen({ title, right, children, scrollRef }: { title: string; right?: ReactNode; children: ReactNode; scrollRef?: Ref<ScrollViewInstance> }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.bg}>
      <Image source={STARS} contentFit="cover" style={styles.fill} accessible={false} />
      <ScrollView
        ref={scrollRef}
        contentInsetAdjustmentBehavior="never"
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + BottomTabInset + 24 }]}>
        <View style={styles.header}>
          <Text style={styles.title} accessibilityRole="header">{title}</Text>
          {right}
        </View>
        {children}
      </ScrollView>
    </View>
  );
}

export function Pill({ label }: { label: string }) {
  return (
    <View style={styles.pill}>
      <Text style={styles.pillText}>{label}</Text>
    </View>
  );
}

/** Shows where the data on a screen comes from right now. */
export function LivePill({ state }: { state: LoadState }) {
  const label = state === 'live' ? 'Live' : state === 'loading' ? 'Loading…' : 'Offline';
  const dot = state === 'live' ? C.green : state === 'loading' ? C.muted : C.orange;
  return (
    <View style={[styles.pill, styles.pillRow]} accessibilityLabel={state === 'saved' ? 'Offline, showing saved data' : label}>
      <View style={[styles.dot, { backgroundColor: dot }]} />
      <Text style={styles.pillText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pillRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 7, height: 7, borderRadius: 999 },
  bg: { flex: 1, backgroundColor: C.bg },
  fill: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' },
  content: { paddingHorizontal: 20, gap: 16 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  title: { fontFamily: F.display, fontSize: 34, color: C.text, letterSpacing: -0.5 },
  pill: { borderWidth: 1, borderColor: C.line, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3 },
  pillText: { fontSize: 12, color: C.muted },
});
