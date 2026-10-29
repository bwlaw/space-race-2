import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Flag } from '@/components/flag';
import { C } from '@/constants/theme';
import { COUNTRIES, type Country } from '@/data/countries';

/** Row of seven equal buttons: "All" plus one flag per country. */
export function CountryFilter({ value, onChange }: { value: Country | null; onChange: (c: Country | null) => void }) {
  const options: (Country | null)[] = [null, ...COUNTRIES];
  return (
    <View style={styles.row}>
      {options.map((c) => {
        const on = c === value;
        return (
          <Pressable
            key={c ?? 'all'}
            onPress={() => onChange(c)}
            accessibilityRole="button"
            accessibilityState={{ selected: on }}
            accessibilityLabel={c ?? 'All countries'}
            style={[styles.chip, on ? styles.on : styles.off]}>
            {c ? <Flag country={c} width={22} /> : <Text style={[styles.all, { color: on ? C.text : C.muted }]}>All</Text>}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 6 },
  chip: { flex: 1, height: 44, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  on: { borderWidth: 2, borderColor: C.sky, backgroundColor: 'rgba(90,176,255,0.18)' },
  off: { borderWidth: 1, borderColor: C.line, backgroundColor: 'rgba(13,33,71,0.8)' },
  all: { fontSize: 14, fontWeight: '600' },
});
