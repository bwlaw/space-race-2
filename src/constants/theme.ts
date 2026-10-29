import { Platform } from 'react-native';

export const C = {
  bg: '#06122B',
  card: 'rgba(13,33,71,0.85)',
  panel: 'rgba(3,10,28,0.88)',
  line: '#1F3A6B',
  lineSoft: '#12284D',
  text: '#F2F6FF',
  muted: '#A9B9D6',
  dim: '#7F93B3',
  sky: '#5AB0FF',
  skySoft: '#9CC4F5',
  orange: '#FF9F43',
  orangeSoft: '#FFC285',
  green: '#6FE3B0',
  red: '#FF9A9A',
} as const;

export const F = {
  display: 'SpaceGrotesk_700Bold',
  displayMedium: 'SpaceGrotesk_500Medium',
  body: Platform.select({ ios: 'System', default: undefined }),
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
