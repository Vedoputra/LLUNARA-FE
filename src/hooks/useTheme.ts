import { useColorScheme } from 'react-native';

import {
  palettes,
  radius,
  spacing,
  typography,
  fontFamilies,
  type Palette,
} from '@/constants/theme';

export interface Theme {
  colors: Palette;
  spacing: typeof spacing;
  radius: typeof radius;
  typography: typeof typography;
  fontFamilies: typeof fontFamilies;
  scheme: 'light' | 'dark';
}

export function useTheme(): Theme {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';

  return {
    colors: palettes[scheme],
    spacing,
    radius,
    typography,
    fontFamilies,
    scheme,
  };
}
