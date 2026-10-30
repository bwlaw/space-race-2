import { Image } from 'expo-image';
import { Text, View } from 'react-native';

import { C } from '@/constants/theme';
import { ExtraFlag, EXTRA_FLAG_CODES } from '@/components/extra-flag';
import { FLAGS, type Country } from '@/data/countries';

export function Flag({ country, width = 24, label, code }: { country: Country | null; width?: number; label?: boolean; code?: string }) {
  const height = Math.round((width * 2) / 3);
  if (!country && code && EXTRA_FLAG_CODES.has(code)) {
    return (
      <View
        style={{ width, height, borderRadius: Math.max(2, width / 12), overflow: 'hidden' }}
        accessible={!!label}
        accessibilityLabel={label ? code : undefined}>
        <ExtraFlag code={code} width={width} height={height} />
      </View>
    );
  }
  if (!country) {
    return (
      <View
        style={{ width, height, borderRadius: Math.max(2, width / 12), backgroundColor: C.line, alignItems: 'center', justifyContent: 'center' }}
        accessible={!!label}
        accessibilityLabel={label ? code : undefined}>
        <Text style={{ fontSize: Math.max(7, width / 3.4), fontWeight: '700', color: C.text }}>{code ?? '?'}</Text>
      </View>
    );
  }
  return (
    <Image
      source={FLAGS[country]}
      contentFit="fill"
      cachePolicy="memory"
      transition={0}
      style={{ width, height, borderRadius: Math.max(2, width / 12) }}
      accessible={!!label}
      accessibilityLabel={label ? country : undefined}
    />
  );
}
