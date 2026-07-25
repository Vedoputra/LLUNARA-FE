import {
  Baloo2_600SemiBold,
  Baloo2_700Bold,
  useFonts as useBaloo2Fonts,
} from '@expo-google-fonts/baloo-2';
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  useFonts as usePlusJakartaSansFonts,
} from '@expo-google-fonts/plus-jakarta-sans';
import { QueryClientProvider } from '@tanstack/react-query';
import * as SplashScreen from 'expo-splash-screen';
import { Stack } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { queryClient } from '@/api/queryClient';
import { AppLockGate } from '@/components/AppLockGate';
import { OfflineBanner } from '@/components/feedback';
import { useAuthStore } from '@/store/authStore';
import { useSettingsStore } from '@/store/settingsStore';

const RELOCK_AFTER_MS = 5 * 60 * 1000;

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [baloo2Loaded] = useBaloo2Fonts({ Baloo2_600SemiBold, Baloo2_700Bold });
  const [plusJakartaLoaded] = usePlusJakartaSansFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });
  const fontsLoaded = baloo2Loaded && plusJakartaLoaded;

  const session = useAuthStore((state) => state.session);
  const isAuthInitialized = useAuthStore((state) => state.isInitialized);
  const initializeAuth = useAuthStore((state) => state.initialize);
  const appLockEnabled = useSettingsStore((state) => state.appLockEnabled);

  const [isLocked, setIsLocked] = useState(appLockEnabled);
  const backgroundedAtRef = useRef<number | null>(null);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (appLockEnabled) setIsLocked(true);
  }, [appLockEnabled]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state: AppStateStatus) => {
      if (state === 'background' || state === 'inactive') {
        backgroundedAtRef.current = Date.now();
      } else if (state === 'active') {
        const backgroundedAt = backgroundedAtRef.current;
        if (appLockEnabled && backgroundedAt && Date.now() - backgroundedAt > RELOCK_AFTER_MS) {
          setIsLocked(true);
        }
        backgroundedAtRef.current = null;
      }
    });
    return () => subscription.remove();
  }, [appLockEnabled]);

  const appReady = fontsLoaded && isAuthInitialized;

  useEffect(() => {
    if (appReady) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [appReady]);

  if (!appReady) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        {appLockEnabled && isLocked ? (
          <AppLockGate onUnlock={() => setIsLocked(false)} />
        ) : (
          <>
            <OfflineBanner />
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Protected guard={!!session}>
                <Stack.Screen name="(tabs)" />
              </Stack.Protected>
              <Stack.Protected guard={!session}>
                <Stack.Screen name="(auth)" />
              </Stack.Protected>
            </Stack>
          </>
        )}
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
