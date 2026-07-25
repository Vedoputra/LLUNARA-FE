import { Feather } from '@expo/vector-icons';
import { Image, StyleSheet, View } from 'react-native';

import { Button, Text } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export function ErrorState({
  title = 'Tidak bisa terhubung',
  message = 'Coba periksa koneksimu, lalu coba lagi.',
  onRetry,
  retryLabel = 'Coba lagi',
}: ErrorStateProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/mascot/luna-peeking.png')}
        style={styles.mascot}
        resizeMode="contain"
      />
      <View style={[styles.badge, { backgroundColor: theme.colors.primarySoft }]}>
        <Text variant="subtitle" color={theme.colors.primary}>
          {title}
        </Text>
      </View>
      <Text muted style={styles.message}>
        {message}
      </Text>
      {onRetry ? (
        <Button
          label={retryLabel}
          variant="secondary"
          onPress={onRetry}
          icon={<Feather name="refresh-cw" size={18} color={theme.colors.primary} />}
          style={styles.retryButton}
        />
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
  mascot: {
    width: 160,
    height: 160,
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  message: {
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 8,
  },
});
