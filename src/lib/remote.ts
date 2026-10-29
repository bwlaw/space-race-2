import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useRef, useState } from 'react';

export type LoadState = 'loading' | 'live' | 'saved' | 'error';

type Entry<T> = { at: number; data: T };

/**
 * Fetches a URL, keeps the parsed result on the device and reuses it for `ttlMs`.
 * If the network fails, the last saved copy is shown ("saved").
 */
export function useRemote<T>(key: string, url: string, ttlMs: number, parse: (raw: unknown) => T, asText = false) {
  const [data, setData] = useState<T | null>(null);
  const [state, setState] = useState<LoadState>('loading');
  const parseRef = useRef(parse);

  useEffect(() => {
    parseRef.current = parse;
  });

  useEffect(() => {
    let alive = true;
    (async () => {
      let saved: Entry<T> | null = null;
      try {
        const s = await AsyncStorage.getItem(key);
        if (s) saved = JSON.parse(s) as Entry<T>;
      } catch {
        saved = null;
      }
      if (saved && alive) {
        setData(saved.data);
        setState(Date.now() - saved.at < ttlMs ? 'live' : 'saved');
        if (Date.now() - saved.at < ttlMs) return;
      }
      try {
        const res = await fetch(url, { headers: { Accept: asText ? 'text/plain' : 'application/json' } });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const raw: unknown = asText ? await res.text() : await res.json();
        const parsed = parseRef.current(raw);
        if (!alive) return;
        setData(parsed);
        setState('live');
        AsyncStorage.setItem(key, JSON.stringify({ at: Date.now(), data: parsed })).catch(() => undefined);
      } catch {
        if (alive) setState(saved ? 'saved' : 'error');
      }
    })();
    return () => {
      alive = false;
    };
  }, [key, url, ttlMs, asText]);

  return { data, state };
}

export const MINUTE = 60 * 1000;
export const HOUR = 60 * MINUTE;
