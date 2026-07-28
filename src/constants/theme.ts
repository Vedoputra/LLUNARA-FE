export type ColorScheme = 'light' | 'dark';

export type CyclePhase = 'menstrual' | 'follicular' | 'ovulation' | 'luteal' | 'predicted';

export interface GardenPalette {
  sky: string;
  cloud: string;
  ground: string;
  groundShade: string;
  soil: string;
  stem: string;
  leaf: string;
  blossomCenter: string;
}

export interface Palette {
  background: string;
  surface: string;
  surfaceVariant: string;
  text: string;
  textMuted: string;
  border: string;
  primary: string;
  primarySoft: string;
  onPrimary: string;
  danger: string;
  success: string;
  cycle: Record<CyclePhase, string>;
  garden: GardenPalette;
}

export const palettes: Record<ColorScheme, Palette> = {
  light: {
    background: '#FFF6F4',
    surface: '#FFFFFF',
    surfaceVariant: '#FDECEF',
    text: '#24181E',
    textMuted: '#9B8890',
    border: '#F6DFE2',
    primary: '#A1385E',
    primarySoft: '#FCE1EA',
    onPrimary: '#FFFFFF',
    danger: '#E4756A',
    success: '#4C9C86',
    cycle: {
      menstrual: '#D9578A',
      follicular: '#FDAF87',
      ovulation: '#A895D6',
      luteal: '#FFD98E',
      predicted: '#F2789F',
    },
    garden: {
      sky: '#FDF1F3',
      cloud: '#FFFFFF',
      ground: '#DFEBC8',
      groundShade: '#CBDFAC',
      soil: '#D3AF95',
      stem: '#8FBF7A',
      leaf: '#A8D293',
      blossomCenter: '#FFF3D6',
    },
  },
  dark: {
    background: '#241A20',
    surface: '#2F2229',
    surfaceVariant: '#3A2C33',
    text: '#F7ECEF',
    textMuted: '#B79AA3',
    border: '#4A3A41',
    primary: '#F2789F',
    primarySoft: '#4A2530',
    onPrimary: '#3F001B',
    danger: '#FF8A7F',
    success: '#6FBBA5',
    cycle: {
      menstrual: '#F2789F',
      follicular: '#FDAF87',
      ovulation: '#C3B2E8',
      luteal: '#FFD98E',
      predicted: '#F2789F',
    },
    garden: {
      sky: '#33242B',
      cloud: '#4A3A41',
      ground: '#3F4B38',
      groundShade: '#4C5943',
      soil: '#7E6150',
      stem: '#7BA86A',
      leaf: '#92BC7E',
      blossomCenter: '#FFE9B5',
    },
  },
};

export const spacing = {
  4: 4,
  8: 8,
  12: 12,
  16: 16,
  24: 24,
  32: 32,
  48: 48,
} as const;

export const radius = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  full: 9999,
} as const;

export interface TypographyStyle {
  fontFamily: string;
  fontSize: number;
  fontWeight: '400' | '500' | '600' | '700';
  lineHeight: number;
}

export const fontFamilies = {
  display: 'Baloo2_600SemiBold',
  displayBold: 'Baloo2_700Bold',
  body: 'PlusJakartaSans_400Regular',
  bodyMedium: 'PlusJakartaSans_500Medium',
  bodySemiBold: 'PlusJakartaSans_600SemiBold',
  bodyBold: 'PlusJakartaSans_700Bold',
} as const;

export const typography: Record<
  'display' | 'heading' | 'title' | 'subtitle' | 'body' | 'caption',
  TypographyStyle
> = {
  display: { fontFamily: fontFamilies.display, fontSize: 32, fontWeight: '600', lineHeight: 38 },
  heading: { fontFamily: fontFamilies.display, fontSize: 24, fontWeight: '600', lineHeight: 32 },
  title: { fontFamily: fontFamilies.bodyBold, fontSize: 20, fontWeight: '700', lineHeight: 28 },
  subtitle: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 24,
  },
  body: { fontFamily: fontFamilies.body, fontSize: 15, fontWeight: '400', lineHeight: 24 },
  caption: { fontFamily: fontFamilies.body, fontSize: 12, fontWeight: '400', lineHeight: 16 },
};

export const theme = { palettes, spacing, radius, typography, fontFamilies };
