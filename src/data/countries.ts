export type Country = 'USA' | 'China' | 'Russia' | 'Europe' | 'India' | 'Japan';

export const COUNTRIES: Country[] = ['USA', 'China', 'Russia', 'Europe', 'India', 'Japan'];

/** Local image modules (require() returns a number). */
export const FLAGS: Record<Country, number> = {
  USA: require('@/assets/images/flags/usa.png'),
  China: require('@/assets/images/flags/china.png'),
  Russia: require('@/assets/images/flags/russia.png'),
  Europe: require('@/assets/images/flags/europe.png'),
  India: require('@/assets/images/flags/india.png'),
  Japan: require('@/assets/images/flags/japan.png'),
};
