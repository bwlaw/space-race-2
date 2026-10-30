import { useEffect, useMemo, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, StyleSheet, View } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';

// The background picture is 350 × 240 units; the orbit is a circle around (175, 580) with radius 440.
const IMG_W = 350;
const IMG_H = 240;
const CX = 175;
const CY = 580;
const R = 440;
const SPAN = 0.47; // radians either side of the top of the orbit
const STEPS = 24;
const LAP_MS = 45000;
const SW = 48; // station drawing size
const SH = 26;

function Station() {
  return (
    <Svg width={SW} height={SH} viewBox="-24 -13 48 26">
      <Path d="M-22 0 H22" stroke="#E9EEF7" strokeWidth={0.9} />
      {[-21, -13, 6, 14].map((x) => (
        <Rect key={`t${x}`} x={x} y={-11} width={7} height={9} fill="none" stroke="#E9EEF7" strokeWidth={0.9} />
      ))}
      {[-21, -13, 6, 14].map((x) => (
        <Rect key={`b${x}`} x={x} y={2} width={7} height={9} fill="none" stroke="#E9EEF7" strokeWidth={0.9} />
      ))}
      <Rect x={-5} y={-3} width={10} height={6} fill="#E9EEF7" />
    </Svg>
  );
}

/** The station drawn on top of the background, gliding along the dashed orbit. */
export function OrbitingStation() {
  const [box, setBox] = useState({ w: 0, h: 0 });
  const [still, setStill] = useState(false);
  const [t] = useState(() => new Animated.Value(0));

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setStill).catch(() => undefined);
  }, []);

  useEffect(() => {
    if (still) {
      t.setValue(0.62);
      return;
    }
    t.setValue(0);
    const loop = Animated.loop(Animated.timing(t, { toValue: 1, duration: LAP_MS, easing: Easing.linear, useNativeDriver: true }));
    loop.start();
    return () => loop.stop();
  }, [still, t]);

  const anim = useMemo(() => {
    if (!box.w) return null;
    // Same scaling as the background picture ("cover").
    const s = Math.max(box.w / IMG_W, box.h / IMG_H);
    const offX = (box.w - IMG_W * s) / 2;
    const offY = (box.h - IMG_H * s) / 2;
    const input: number[] = [];
    const xs: number[] = [];
    const ys: number[] = [];
    const rots: string[] = [];
    for (let i = 0; i <= STEPS; i++) {
      const p = i / STEPS;
      const a = -SPAN + 2 * SPAN * p;
      input.push(p);
      xs.push(offX + (CX + R * Math.sin(a)) * s - SW / 2);
      ys.push(offY + (CY - R * Math.cos(a)) * s - SH / 2);
      rots.push(`${((a * 180) / Math.PI).toFixed(2)}deg`);
    }
    return {
      transform: [
        { translateX: t.interpolate({ inputRange: input, outputRange: xs }) },
        { translateY: t.interpolate({ inputRange: input, outputRange: ys }) },
        { rotate: t.interpolate({ inputRange: input, outputRange: rots }) },
        { scale: s },
      ],
      opacity: t.interpolate({ inputRange: [0, 0.06, 0.94, 1], outputRange: [0, 1, 1, 0] }),
    };
  }, [box, t]);

  return (
    <View
      pointerEvents="none"
      style={StyleSheet.absoluteFill}
      onLayout={(e) => setBox({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height })}>
      {anim && (
        <Animated.View style={[styles.station, anim]}>
          <Station />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  station: { position: 'absolute', left: 0, top: 0, width: SW, height: SH },
});
