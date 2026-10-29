import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { useCallback, useEffect, useState } from 'react';

import type { Launch } from '@/lib/ll2';

const KEY = 'launch-reminders';
const BEFORE_MS = 30 * 60 * 1000;

type Stored = Record<string, string>; // launch id -> notification id

/** Local reminders 30 minutes before lift-off. Nothing leaves the phone. */
export function useReminders() {
  const [ids, setIds] = useState<Stored>({});

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((s) => setIds(s ? (JSON.parse(s) as Stored) : {}))
      .catch(() => undefined);
  }, []);

  const save = (next: Stored) => {
    setIds(next);
    AsyncStorage.setItem(KEY, JSON.stringify(next)).catch(() => undefined);
  };

  const toggle = useCallback(
    async (launch: Launch): Promise<'on' | 'off' | 'denied' | 'too-late'> => {
      const existing = ids[launch.id];
      if (existing) {
        await Notifications.cancelScheduledNotificationAsync(existing).catch(() => undefined);
        const next = { ...ids };
        delete next[launch.id];
        save(next);
        return 'off';
      }
      const when = launch.net - BEFORE_MS;
      if (when <= Date.now() + 60000) return 'too-late';
      let perm = await Notifications.getPermissionsAsync();
      if (!perm.granted && perm.canAskAgain) perm = await Notifications.requestPermissionsAsync();
      if (!perm.granted) return 'denied';
      const id = await Notifications.scheduleNotificationAsync({
        content: { title: `${launch.rocket} launches in 30 minutes`, body: `${launch.mission}, ${launch.site}` },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: new Date(when) },
      });
      save({ ...ids, [launch.id]: id });
      return 'on';
    },
    [ids],
  );

  return { isOn: (id: string) => !!ids[id], toggle };
}
