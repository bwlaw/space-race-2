import Svg, { Circle, ClipPath, Defs, G, Path, Polygon, Rect } from 'react-native-svg';

/**
 * Every flag in the app, drawn as vector shapes (60 × 40 units).
 * No image files are involved, so flags can never fail to load.
 */
export const FLAG_CODES = new Set(['USA', 'China', 'Russia', 'Europe', 'India', 'Japan', 'CAN', 'ARE', 'NZL']);

export function FlagArt({ code, width, height }: { code: string; width: number; height: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 60 40">
      {code === 'USA' && (
        <>
          <Rect width={60} height={40} fill="#FFFFFF" />
          <Rect y={0.00} width={60} height={3.08} fill="#B22234" />
          <Rect y={6.15} width={60} height={3.08} fill="#B22234" />
          <Rect y={12.31} width={60} height={3.08} fill="#B22234" />
          <Rect y={18.46} width={60} height={3.08} fill="#B22234" />
          <Rect y={24.62} width={60} height={3.08} fill="#B22234" />
          <Rect y={30.77} width={60} height={3.08} fill="#B22234" />
          <Rect y={36.92} width={60} height={3.08} fill="#B22234" />
          <Rect width={26} height={21.5} fill="#3C3B6E" />
          <Circle cx={3} cy={3.0} r={0.9} fill="#FFFFFF" />
          <Circle cx={7} cy={3.0} r={0.9} fill="#FFFFFF" />
          <Circle cx={11} cy={3.0} r={0.9} fill="#FFFFFF" />
          <Circle cx={15} cy={3.0} r={0.9} fill="#FFFFFF" />
          <Circle cx={19} cy={3.0} r={0.9} fill="#FFFFFF" />
          <Circle cx={23} cy={3.0} r={0.9} fill="#FFFFFF" />
          <Circle cx={3} cy={6.8} r={0.9} fill="#FFFFFF" />
          <Circle cx={7} cy={6.8} r={0.9} fill="#FFFFFF" />
          <Circle cx={11} cy={6.8} r={0.9} fill="#FFFFFF" />
          <Circle cx={15} cy={6.8} r={0.9} fill="#FFFFFF" />
          <Circle cx={19} cy={6.8} r={0.9} fill="#FFFFFF" />
          <Circle cx={23} cy={6.8} r={0.9} fill="#FFFFFF" />
          <Circle cx={3} cy={10.6} r={0.9} fill="#FFFFFF" />
          <Circle cx={7} cy={10.6} r={0.9} fill="#FFFFFF" />
          <Circle cx={11} cy={10.6} r={0.9} fill="#FFFFFF" />
          <Circle cx={15} cy={10.6} r={0.9} fill="#FFFFFF" />
          <Circle cx={19} cy={10.6} r={0.9} fill="#FFFFFF" />
          <Circle cx={23} cy={10.6} r={0.9} fill="#FFFFFF" />
          <Circle cx={3} cy={14.4} r={0.9} fill="#FFFFFF" />
          <Circle cx={7} cy={14.4} r={0.9} fill="#FFFFFF" />
          <Circle cx={11} cy={14.4} r={0.9} fill="#FFFFFF" />
          <Circle cx={15} cy={14.4} r={0.9} fill="#FFFFFF" />
          <Circle cx={19} cy={14.4} r={0.9} fill="#FFFFFF" />
          <Circle cx={23} cy={14.4} r={0.9} fill="#FFFFFF" />
          <Circle cx={3} cy={18.2} r={0.9} fill="#FFFFFF" />
          <Circle cx={7} cy={18.2} r={0.9} fill="#FFFFFF" />
          <Circle cx={11} cy={18.2} r={0.9} fill="#FFFFFF" />
          <Circle cx={15} cy={18.2} r={0.9} fill="#FFFFFF" />
          <Circle cx={19} cy={18.2} r={0.9} fill="#FFFFFF" />
          <Circle cx={23} cy={18.2} r={0.9} fill="#FFFFFF" />
        </>
      )}
      {code === 'China' && (
        <>
          <Rect width={60} height={40} fill="#EE1C25" />
          <Polygon points="10.0,4.0 11.4,8.1 15.7,8.1 12.3,10.7 13.5,14.9 10.0,12.4 6.5,14.9 7.7,10.7 4.3,8.1 8.6,8.1" fill="#FFDE00" />
          <Polygon points="20.0,2.0 20.5,3.4 21.9,3.4 20.8,4.2 21.2,5.6 20.0,4.8 18.8,5.6 19.2,4.2 18.1,3.4 19.5,3.4" fill="#FFDE00" />
          <Polygon points="24.0,6.0 24.5,7.4 25.9,7.4 24.8,8.2 25.2,9.6 24.0,8.8 22.8,9.6 23.2,8.2 22.1,7.4 23.5,7.4" fill="#FFDE00" />
          <Polygon points="24.0,12.0 24.5,13.4 25.9,13.4 24.8,14.2 25.2,15.6 24.0,14.8 22.8,15.6 23.2,14.2 22.1,13.4 23.5,13.4" fill="#FFDE00" />
          <Polygon points="20.0,16.0 20.5,17.4 21.9,17.4 20.8,18.2 21.2,19.6 20.0,18.8 18.8,19.6 19.2,18.2 18.1,17.4 19.5,17.4" fill="#FFDE00" />
        </>
      )}
      {code === 'Russia' && (
        <>
          <Rect width={60} height={13.4} fill="#FFFFFF" />
          <Rect y={13.3} width={60} height={13.4} fill="#0039A6" />
          <Rect y={26.6} width={60} height={13.4} fill="#D52B1E" />
        </>
      )}
      {code === 'Europe' && (
        <>
          <Rect width={60} height={40} fill="#003399" />
          <Polygon points="42.0,17.8 42.5,19.3 44.1,19.3 42.8,20.3 43.3,21.8 42.0,20.9 40.7,21.8 41.2,20.3 39.9,19.3 41.5,19.3" fill="#FFCC00" />
          <Polygon points="40.4,23.8 40.9,25.3 42.5,25.3 41.2,26.3 41.7,27.8 40.4,26.9 39.1,27.8 39.6,26.3 38.3,25.3 39.9,25.3" fill="#FFCC00" />
          <Polygon points="36.0,28.2 36.5,29.7 38.1,29.7 36.8,30.7 37.3,32.2 36.0,31.3 34.7,32.2 35.2,30.7 33.9,29.7 35.5,29.7" fill="#FFCC00" />
          <Polygon points="30.0,29.8 30.5,31.3 32.1,31.3 30.8,32.3 31.3,33.8 30.0,32.9 28.7,33.8 29.2,32.3 27.9,31.3 29.5,31.3" fill="#FFCC00" />
          <Polygon points="24.0,28.2 24.5,29.7 26.1,29.7 24.8,30.7 25.3,32.2 24.0,31.3 22.7,32.2 23.2,30.7 21.9,29.7 23.5,29.7" fill="#FFCC00" />
          <Polygon points="19.6,23.8 20.1,25.3 21.7,25.3 20.4,26.3 20.9,27.8 19.6,26.9 18.3,27.8 18.8,26.3 17.5,25.3 19.1,25.3" fill="#FFCC00" />
          <Polygon points="18.0,17.8 18.5,19.3 20.1,19.3 18.8,20.3 19.3,21.8 18.0,20.9 16.7,21.8 17.2,20.3 15.9,19.3 17.5,19.3" fill="#FFCC00" />
          <Polygon points="19.6,11.8 20.1,13.3 21.7,13.3 20.4,14.3 20.9,15.8 19.6,14.9 18.3,15.8 18.8,14.3 17.5,13.3 19.1,13.3" fill="#FFCC00" />
          <Polygon points="24.0,7.4 24.5,8.9 26.1,8.9 24.8,9.9 25.3,11.4 24.0,10.5 22.7,11.4 23.2,9.9 21.9,8.9 23.5,8.9" fill="#FFCC00" />
          <Polygon points="30.0,5.8 30.5,7.3 32.1,7.3 30.8,8.3 31.3,9.8 30.0,8.9 28.7,9.8 29.2,8.3 27.9,7.3 29.5,7.3" fill="#FFCC00" />
          <Polygon points="36.0,7.4 36.5,8.9 38.1,8.9 36.8,9.9 37.3,11.4 36.0,10.5 34.7,11.4 35.2,9.9 33.9,8.9 35.5,8.9" fill="#FFCC00" />
          <Polygon points="40.4,11.8 40.9,13.3 42.5,13.3 41.2,14.3 41.7,15.8 40.4,14.9 39.1,15.8 39.6,14.3 38.3,13.3 39.9,13.3" fill="#FFCC00" />
        </>
      )}
      {code === 'India' && (
        <>
          <Rect width={60} height={13.4} fill="#FF9933" />
          <Rect y={13.3} width={60} height={13.4} fill="#FFFFFF" />
          <Rect y={26.6} width={60} height={13.4} fill="#138808" />
          <Circle cx={30} cy={20} r={5} fill="none" stroke="#000080" strokeWidth={1} />
          <Circle cx={30} cy={20} r={1} fill="#000080" />
        </>
      )}
      {code === 'Japan' && (
        <>
          <Rect width={60} height={40} fill="#FFFFFF" />
          <Circle cx={30} cy={20} r={12} fill="#BC002D" />
        </>
      )}
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
