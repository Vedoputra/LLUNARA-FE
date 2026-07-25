import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type ThemePreference = 'light' | 'dark' | 'system';

export interface WellnessToggles {
  water: boolean;
  sleep: boolean;
  weight: boolean;
}

interface SettingsState {
  displayName: string | null;
  birthYear: number | null;
  defaultCycleLength: number;
  defaultPeriodLength: number;
  wellnessEnabled: WellnessToggles;
  themePreference: ThemePreference;
  appLockEnabled: boolean;
  setDisplayName: (value: string | null) => void;
  setBirthYear: (value: number | null) => void;
  setDefaultCycleLength: (value: number) => void;
  setDefaultPeriodLength: (value: number) => void;
  setWellnessEnabled: (metric: keyof WellnessToggles, enabled: boolean) => void;
  setThemePreference: (value: ThemePreference) => void;
  setAppLockEnabled: (value: boolean) => void;
}

/**
 * These fields have no backing endpoint in the Go API (list_api.md has no
 * user-profile/preferences route) — persisted on-device only. They survive
 * app reopen (the FE-7.3 completion criterion) but not a device change.
 */
export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      displayName: null,
      birthYear: null,
      defaultCycleLength: 28,
      defaultPeriodLength: 5,
      wellnessEnabled: { water: true, sleep: true, weight: true },
      themePreference: 'system',
      appLockEnabled: false,

      setDisplayName: (value) => set({ displayName: value }),
      setBirthYear: (value) => set({ birthYear: value }),
      setDefaultCycleLength: (value) => set({ defaultCycleLength: value }),
      setDefaultPeriodLength: (value) => set({ defaultPeriodLength: value }),
      setWellnessEnabled: (metric, enabled) =>
        set((state) => ({ wellnessEnabled: { ...state.wellnessEnabled, [metric]: enabled } })),
      setThemePreference: (value) => set({ themePreference: value }),
      setAppLockEnabled: (value) => set({ appLockEnabled: value }),
    }),
    {
      name: 'llunara-settings',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
