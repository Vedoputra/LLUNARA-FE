import { Feather } from '@expo/vector-icons';
import { Image, StyleSheet, View } from 'react-native';

import { Button, Text } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';

export interface ServerPausedStateProps {
  onRetry?: () => void;
}

export function ServerPausedState({ onRetry }: ServerPausedStateProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/mascot/luna-cozy.png')}
        style={styles.mascot}
        resizeMode="contain"
      />
      <View style={[styles.badge, { backgroundColor: theme.colors.primarySoft }]}>
        <Text variant="subtitle" color={theme.colors.primary}>
          Server sedang bangun
        </Text>
      </View>
      <Text muted style={styles.message}>
        Sebentar ya — biasanya butuh waktu hingga satu menit setelah lama tidak aktif.
      </Text>
      <Text variant="caption" muted style={styles.caption}>
        Datamu aman.
      </Text>
      {onRetry ? (
        <Button
          label="Coba lagi"
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
    gap: 12,
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
  caption: {
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 8,
  },
});
