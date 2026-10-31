import { Text, View } from 'react-native';

import { FlagArt, FLAG_CODES } from '@/components/flag-art';
import { C } from '@/constants/theme';
import type { Country } from '@/data/countries';

export function Flag({ country, width = 24, label, code }: { country: Country | null; width?: number; label?: boolean; code?: string }) {
  const height = Math.round((width * 2) / 3);
  const key = country ?? code ?? '';
  const radius = Math.max(2, width / 12);
  if (FLAG_CODES.has(key)) {
    return (
      <View style={{ width, height, borderRadius: radius, overflow: 'hidden' }} accessible={!!label} accessibilityLabel={label ? key : undefined}>
        <FlagArt code={key} width={width} height={height} />
      </View>
    );
  }
  return (
    <View
      style={{ width, height, borderRadius: radius, backgroundColor: C.line, alignItems: 'center', justifyContent: 'center' }}
      accessible={!!label}
      accessibilityLabel={label ? code : undefined}>
      <Text style={{ fontSize: Math.max(7, width / 3.4), fontWeight: '700', color: C.text }}>{code ?? '?'}</Text>
    </View>
  );
}
