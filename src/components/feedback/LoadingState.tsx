import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';

export interface LoadingStateProps {
  message?: string;
}

function useProgressiveMessage(override?: string) {
  const [elapsedTier, setElapsedTier] = useState<0 | 1 | 2>(0);

  useEffect(() => {
    if (override) return;

    const toTier1 = setTimeout(() => setElapsedTier(1), 5000);
    const toTier2 = setTimeout(() => setElapsedTier(2), 15000);

    return () => {
      clearTimeout(toTier1);
      clearTimeout(toTier2);
    };
  }, [override]);

  if (override) return override;

  return [
    undefined,
    'Menghubungkan ke server…',
    'Server sedang aktif kembali, ini biasanya butuh waktu hingga satu menit.',
  ][elapsedTier];
}

export function LoadingState({ message }: LoadingStateProps) {
  const theme = useTheme();
  const displayMessage = useProgressiveMessage(message);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      {displayMessage ? (
        <Text muted style={styles.message}>
          {displayMessage}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 16,
  },
  message: {
    textAlign: 'center',
  },
});
