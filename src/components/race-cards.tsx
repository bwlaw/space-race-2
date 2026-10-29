import { StyleSheet, Text, View } from 'react-native';

import { Flag } from '@/components/flag';
import { C, F } from '@/constants/theme';
import type { Country } from '@/data/countries';
import { formatNumber, type MilestoneRow } from '@/lib/race';

export function MilestoneCard({ row }: { row: MilestoneRow }) {
  return (
    <View style={styles.card}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>+{row.points}</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.title}>{row.name}</Text>
        {row.showLatest && <Text style={styles.latest}>{`${row.latestLabel}: ${row.latest}`}</Text>}
        {row.first && <Text style={styles.small}>{`First: ${row.first}`}</Text>}
        <View style={styles.flags}>
          {row.countries.map((c) => (
            <Flag key={c} country={c} width={21} label />
          ))}
        </View>
      </View>
    </View>
  );
}

export function FutureCard({ name, points }: { name: string; points: number }) {
  return (
    <View style={[styles.card, styles.future]}>
      <View style={[styles.badge, styles.badgeFuture]}>
        <Text style={[styles.badgeText, { color: C.sky }]}>+{points}</Text>
      </View>
      <Text style={[styles.title, { flex: 1, alignSelf: 'center' }]}>{name}</Text>
    </View>
  );
}

export function LaunchStatsTable({ rows }: { rows: { country: Country; count: number; rate: number; rocket: string }[] }) {
  return (
    <View style={[styles.card, styles.table]}>
      {rows.map((r, i) => (
        <View key={r.country} style={[styles.statRow, i < rows.length - 1 && styles.statDivider]}>
          <Flag country={r.country} width={27} />
          <View style={{ flex: 1 }}>
            <Text style={styles.statName}>{r.country}</Text>
            <Text style={styles.small}>{`Most flown: ${r.rocket}`}</Text>
          </View>
          <View style={styles.statCol}>
            <Text style={styles.statNum}>{formatNumber(r.count)}</Text>
            <Text style={styles.tiny}>launches</Text>
          </View>
          <View style={[styles.statCol, { width: 56 }]}>
            <Text style={[styles.statNum, { color: C.green }]}>{r.rate}%</Text>
            <Text style={styles.tiny}>success</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

export function LaunchCard({ country, rocket, mission, when, success }: { country: Country; rocket: string; mission: string; when: string; success: boolean }) {
  return (
    <View style={[styles.card, { alignItems: 'center' }]}>
      <Flag country={country} width={33} label />
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{rocket}</Text>
        <Text style={styles.small}>{mission}</Text>
      </View>
      <View style={{ alignItems: 'flex-end', gap: 4 }}>
        <Text style={[styles.outcome, success ? styles.ok : styles.fail]}>{success ? 'Success' : 'Failure'}</Text>
        <Text style={styles.small}>{when}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', gap: 12, backgroundColor: C.card, borderWidth: 1, borderColor: C.line, borderRadius: 14, paddingVertical: 12, paddingHorizontal: 14 },
  future: { backgroundColor: 'transparent', borderStyle: 'dashed', borderColor: '#2C4C80' },
  badge: { width: 46, height: 30, borderRadius: 8, backgroundColor: 'rgba(255,159,67,0.16)', alignItems: 'center', justifyContent: 'center' },
  badgeFuture: { backgroundColor: 'transparent', borderWidth: 1, borderColor: C.sky },
  badgeText: { fontFamily: F.display, fontSize: 15, color: C.orangeSoft },
  body: { flex: 1, gap: 4 },
  title: { fontSize: 15, fontWeight: '600', color: C.text },
  latest: { fontSize: 12, color: C.orangeSoft },
  small: { fontSize: 12, color: C.muted },
  tiny: { fontSize: 11, color: C.muted },
  flags: { flexDirection: 'row', flexWrap: 'wrap', gap: 5, marginTop: 2 },
  table: { flexDirection: 'column', gap: 0, paddingVertical: 4 },
  statRow: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 52 },
  statDivider: { borderBottomWidth: 1, borderBottomColor: C.lineSoft },
  statName: { fontSize: 14, fontWeight: '600', color: C.text },
  statCol: { width: 64, alignItems: 'flex-end' },
  statNum: { fontFamily: F.display, fontSize: 16, color: C.text, fontVariant: ['tabular-nums'] },
  outcome: { fontSize: 12, fontWeight: '600', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999, overflow: 'hidden' },
  ok: { backgroundColor: 'rgba(61,220,151,0.15)', color: C.green },
  fail: { backgroundColor: 'rgba(255,107,107,0.15)', color: C.red },
});
