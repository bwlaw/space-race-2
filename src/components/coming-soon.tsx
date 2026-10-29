import { StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/screen';
import { C } from '@/constants/theme';

export function ComingSoon({ title, what }: { title: string; what: string }) {
  return (
    <Screen title={title}>
      <View style={styles.card}>
        <Text style={styles.head}>Coming in the next build step</Text>
        <Text style={styles.body}>{what}</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: C.card, borderWidth: 1, borderColor: C.line, borderRadius: 16, padding: 16, gap: 6 },
  head: { fontSize: 15, fontWeight: '600', color: C.text },
  body: { fontSize: 14, lineHeight: 20, color: C.muted },
});
