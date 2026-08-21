import { useColorScheme } from 'react-native';

export interface ThemeColors {
  bg: string;
  card: string;
  cardAlt: string;
  text: string;
  textMuted: string;
  border: string;
  primary: string;
  primaryText: string;
  primarySoft: string;
  success: string;
  successBg: string;
  danger: string;
  dangerBg: string;
  warn: string;
  warnBg: string;
  track: string;
  overlay: string;
}

const light: ThemeColors = {
  bg: '#F5F6F8',
  card: '#FFFFFF',
  cardAlt: '#F1F5F9',
  text: '#0F172A',
  textMuted: '#64748B',
  border: '#E2E8F0',
  primary: '#4F46E5',
  primaryText: '#FFFFFF',
  primarySoft: '#EEF2FF',
  success: '#15803D',
  successBg: '#DCFCE7',
  danger: '#DC2626',
  dangerBg: '#FEE2E2',
  warn: '#B45309',
  warnBg: '#FEF3C7',
  track: '#E5E9F0',
  overlay: 'rgba(15,23,42,0.45)',
};

const dark: ThemeColors = {
  bg: '#0B1120',
  card: '#141C2C',
  cardAlt: '#1B2436',
  text: '#E6EAF2',
  textMuted: '#94A3B8',
  border: '#243149',
  primary: '#818CF8',
  primaryText: '#0B1120',
  primarySoft: '#1E2540',
  success: '#4ADE80',
  successBg: '#12321F',
  danger: '#F87171',
  dangerBg: '#3A1518',
  warn: '#FBBF24',
  warnBg: '#3A2C0C',
  track: '#243149',
  overlay: 'rgba(0,0,0,0.6)',
};

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;
export const radius = { sm: 8, md: 12, lg: 16, xl: 22, pill: 999 } as const;
export const fontSize = {
  xs: 12,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 26,
  display: 34,
} as const;

export interface Theme {
  colors: ThemeColors;
  spacing: typeof spacing;
  radius: typeof radius;
  fontSize: typeof fontSize;
  isDark: boolean;
}

export function useTheme(): Theme {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  return { colors: isDark ? dark : light, spacing, radius, fontSize, isDark };
}
