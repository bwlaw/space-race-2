import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { C, F } from '@/constants/theme';

export function Chevron({ open }: { open: boolean }) {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" style={{ transform: [{ rotate: open ? '180deg' : '0deg' }] }}>
      <Path d="M6 9l6 6 6-6" fill="none" stroke={C.muted} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

/** A heading with a count that opens and closes the list below it. */
export function Section({ title, count, open, onToggle, children }: { title: string; count: number; open: boolean; onToggle: () => void; children: ReactNode }) {
  return (
    <View style={{ gap: 6 }}>
      <Pressable onPress={onToggle} accessibilityRole="button" accessibilityState={{ expanded: open }} style={styles.head}>
        <Text style={styles.title} accessibilityRole="header">{title}</Text>
        <View style={styles.right}>
          <Text style={styles.count}>{count}</Text>
          <Chevron open={open} />
        </View>
      </Pressable>
      {open && <View style={{ gap: 8 }}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 44, marginTop: 6 },
  right: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  title: { fontFamily: F.display, fontSize: 22, color: C.text, flexShrink: 1 },
  count: { fontSize: 13, color: C.muted },
});
