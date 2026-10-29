import { Pressable, StyleSheet, Text, View } from 'react-native';

import { C } from '@/constants/theme';

type Option<T extends string> = { value: T; label: string; disabled?: boolean };

/** Prominent segmented control: the selected option fills sky blue. */
export function Segmented<T extends string>({ options, value, onChange }: { options: Option<T>[]; value: T; onChange: (v: T) => void }) {
  return (
    <View style={styles.seg} accessibilityRole="tablist">
      {options.map((o) => {
        const on = o.value === value;
        return (
          <Pressable
            key={o.value}
            onPress={() => onChange(o.value)}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
            style={[styles.segBtn, on && styles.segBtnOn]}>
            <Text style={[styles.segText, on && styles.segTextOn]}>{o.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

/** Quiet text tabs: the selected option gets a thin underline. */
export function TextTabs<T extends string>({ options, value, onChange }: { options: Option<T>[]; value: T; onChange: (v: T) => void }) {
  return (
    <View style={styles.tabs} accessibilityRole="tablist">
      {options.map((o) => {
        const on = o.value === value;
        return (
          <Pressable
            key={o.value}
            onPress={o.disabled ? undefined : () => onChange(o.value)}
            disabled={o.disabled}
            accessibilityRole="tab"
            accessibilityState={{ selected: on, disabled: !!o.disabled }}
            hitSlop={6}
            style={[styles.tab, { borderBottomColor: on ? C.sky : 'transparent' }]}>
            <Text style={[styles.tabText, { color: o.disabled ? '#3E5174' : on ? C.text : C.dim }]}>{o.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  seg: { flexDirection: 'row', gap: 4, padding: 4, borderRadius: 12, borderWidth: 1, borderColor: C.line, backgroundColor: 'rgba(13,33,71,0.8)' },
  segBtn: { flex: 1, height: 44, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  segBtnOn: { backgroundColor: C.sky },
  segText: { fontSize: 14, fontWeight: '600', color: C.muted },
  segTextOn: { color: C.bg },
  tabs: { flexDirection: 'row', justifyContent: 'center', gap: 28 },
  tab: { height: 40, justifyContent: 'center', paddingHorizontal: 2, borderBottomWidth: 2 },
  tabText: { fontSize: 13, fontWeight: '600' },
});
