import { useColorScheme } from 'react-native';

import {
  palettes,
  radius,
  spacing,
  typography,
  fontFamilies,
  type Palette,
} from '@/constants/theme';
import { useSettingsStore } from '@/store/settingsStore';

export interface Theme {
  colors: Palette;
  spacing: typeof spacing;
  radius: typeof radius;
  typography: typeof typography;
  fontFamilies: typeof fontFamilies;
  scheme: 'light' | 'dark';
}

export function useTheme(): Theme {
  const systemScheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const themePreference = useSettingsStore((state) => state.themePreference);
  const scheme = themePreference === 'system' ? systemScheme : themePreference;

  return {
    colors: palettes[scheme],
    spacing,
    radius,
    typography,
    fontFamilies,
    scheme,
  };
}
