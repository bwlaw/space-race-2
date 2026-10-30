import Svg, { ClipPath, Defs, G, Path, Polygon, Rect } from 'react-native-svg';

/**
 * Flags for crew and spacecraft nationalities outside the six race countries.
 * Drawn as vector shapes, so they never depend on an image file loading.
 */
export const EXTRA_FLAG_CODES = new Set(['CAN', 'ARE', 'NZL']);

export function ExtraFlag({ code, width, height }: { code: string; width: number; height: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 60 40">
      {code === 'CAN' && (
        <>
          <Rect width={60} height={40} fill="#FFFFFF" />
          <Rect width={15} height={40} fill="#D52B1E" />
          <Rect x={45} width={15} height={40} fill="#D52B1E" />
          <Path d="M30 9 L32.2 13.6 L34.8 12.4 L33.8 18.2 L37.4 14.6 L38.2 16.8 L41.6 16.2 L40.4 20.2 L42 21 L36.2 25.8 L36.8 27.8 L31 27.2 L31 32 L29 32 L29 27.2 L23.2 27.8 L23.8 25.8 L18 21 L19.6 20.2 L18.4 16.2 L21.8 16.8 L22.6 14.6 L26.2 18.2 L25.2 12.4 L27.8 13.6 Z" fill="#D52B1E" />
        </>
      )}
      {code === 'ARE' && (
        <>
          <Rect width={60} height={13.4} fill="#00732F" />
          <Rect y={13.3} width={60} height={13.4} fill="#FFFFFF" />
          <Rect y={26.6} width={60} height={13.4} fill="#000000" />
          <Rect width={15} height={40} fill="#FF0000" />
        </>
      )}
      {code === 'NZL' && (
        <>
          <Defs>
            <ClipPath id="nz-canton">
              <Rect width={30} height={20} />
            </ClipPath>
          </Defs>
          <Rect width={60} height={40} fill="#012169" />
          <G clipPath="url(#nz-canton)">
            <Path d="M0 0L30 20M30 0L0 20" stroke="#FFFFFF" strokeWidth={4} />
            <Path d="M0 0L30 20M30 0L0 20" stroke="#C8102E" strokeWidth={1.6} />
            <Path d="M15 0V20M0 10H30" stroke="#FFFFFF" strokeWidth={6} />
            <Path d="M15 0V20M0 10H30" stroke="#C8102E" strokeWidth={3.4} />
          </G>
        <Polygon points="45.0,28.4 45.6,30.2 47.5,30.2 46.0,31.3 46.5,33.1 45.0,32.0 43.5,33.1 44.0,31.3 42.5,30.2 44.4,30.2" fill="#C8102E" stroke="#FFFFFF" strokeWidth={0.8} />
        <Polygon points="39.5,16.7 40.0,18.3 41.7,18.3 40.4,19.3 40.9,20.9 39.5,19.9 38.1,20.9 38.6,19.3 37.3,18.3 39.0,18.3" fill="#C8102E" stroke="#FFFFFF" strokeWidth={0.8} />
        <Polygon points="50.5,13.7 51.0,15.3 52.7,15.3 51.4,16.3 51.9,17.9 50.5,16.9 49.1,17.9 49.6,16.3 48.3,15.3 50.0,15.3" fill="#C8102E" stroke="#FFFFFF" strokeWidth={0.8} />
        <Polygon points="45.0,5.4 45.6,7.2 47.5,7.2 46.0,8.3 46.5,10.1 45.0,9.0 43.5,10.1 44.0,8.3 42.5,7.2 44.4,7.2" fill="#C8102E" stroke="#FFFFFF" strokeWidth={0.8} />
        </>
      )}
    </Svg>
  );
}
