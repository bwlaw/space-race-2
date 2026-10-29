import { SpaceGrotesk_500Medium, SpaceGrotesk_700Bold, useFonts } from '@expo-google-fonts/space-grotesk';
import { DarkTheme, ThemeProvider } from 'expo-router';
import { NativeTabs } from 'expo-router/native-tabs';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { C } from '@/constants/theme';

SplashScreen.preventAutoHideAsync();

const theme = { ...DarkTheme, colors: { ...DarkTheme.colors, background: C.bg, card: C.bg, primary: C.sky } };

export default function RootLayout() {
  const [loaded] = useFonts({ SpaceGrotesk_500Medium, SpaceGrotesk_700Bold });

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;

  return (
    <ThemeProvider value={theme}>
      <StatusBar style="light" />
      <NativeTabs
        backgroundColor={C.bg}
        tintColor={C.sky}
        iconColor={{ default: C.muted, selected: C.sky }}
        labelStyle={{ default: { color: C.muted }, selected: { color: C.sky } }}
        indicatorColor="rgba(90,176,255,0.18)">
        <NativeTabs.Trigger name="index">
          <NativeTabs.Trigger.Label>Race</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon src={require('@/assets/images/tabs/race.png')} renderingMode="template" />
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="launches">
          <NativeTabs.Trigger.Label>Launch</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon src={require('@/assets/images/tabs/launches.png')} renderingMode="template" />
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="space">
          <NativeTabs.Trigger.Label>In Space</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon src={require('@/assets/images/tabs/space.png')} renderingMode="template" />
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="maps">
          <NativeTabs.Trigger.Label>Maps</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon src={require('@/assets/images/tabs/maps.png')} renderingMode="template" />
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="history">
          <NativeTabs.Trigger.Label>History</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon src={require('@/assets/images/tabs/history.png')} renderingMode="template" />
        </NativeTabs.Trigger>
      </NativeTabs>
    </ThemeProvider>
  );
}
