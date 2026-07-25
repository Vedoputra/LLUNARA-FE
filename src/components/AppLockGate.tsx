import { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { Button, Text } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';
import { authenticate } from '@/services/appLock';

export interface AppLockGateProps {
  onUnlock: () => void;
}

export function AppLockGate({ onUnlock }: AppLockGateProps) {
  const theme = useTheme();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [failed, setFailed] = useState(false);

  const handleUnlock = async () => {
    setIsAuthenticating(true);
    setFailed(false);
    const success = await authenticate();
    setIsAuthenticating(false);
    if (success) {
      onUnlock();
    } else {
      setFailed(true);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Image
        source={require('../../assets/mascot/luna-sitting.png')}
        style={styles.mascot}
        resizeMode="contain"
      />
      <Text variant="heading" style={styles.title}>
        LLunara terkunci
      </Text>
      <Text muted style={styles.subtitle}>
        Buka kunci untuk melihat catatanmu.
      </Text>
      {failed ? (
        <Text variant="caption" color={theme.colors.danger} style={styles.error}>
          Autentikasi gagal, coba lagi.
        </Text>
      ) : null}
      <Button label="Buka kunci" onPress={handleUnlock} loading={isAuthenticating} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 12 },
  mascot: { width: 140, height: 140 },
  title: { textAlign: 'center' },
  subtitle: { textAlign: 'center', marginBottom: 8 },
  error: { marginBottom: 8 },
});
