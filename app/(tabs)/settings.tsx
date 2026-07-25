import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Card, Text } from '@/components/ui';
import { ScreenHeader } from '@/components/navigation/ScreenHeader';
import { env } from '@/constants/env';
import { useTheme } from '@/hooks/useTheme';
import { useAuthStore } from '@/store/authStore';
import type { HealthResponse } from '@/types/api';

type ConnectionState =
  | { status: 'checking' }
  | { status: 'ok'; data: HealthResponse; elapsedMs: number }
  | { status: 'degraded'; data: HealthResponse; elapsedMs: number }
  | { status: 'error'; message: string; elapsedMs: number };

async function checkHealth(): Promise<ConnectionState> {
  const startedAt = Date.now();
  try {
    const response = await fetch(`${env.apiUrl}/health`);
    const elapsedMs = Date.now() - startedAt;
    const data = (await response.json()) as HealthResponse;
    return data.status === 'ok'
      ? { status: 'ok', data, elapsedMs }
      : { status: 'degraded', data, elapsedMs };
  } catch (err) {
    const elapsedMs = Date.now() - startedAt;
    return {
      status: 'error',
      message: err instanceof Error ? err.message : 'Tidak dapat terhubung ke server.',
      elapsedMs,
    };
  }
}

export default function PengaturanScreen() {
  const theme = useTheme();
  const user = useAuthStore((state) => state.user);
  const signOut = useAuthStore((state) => state.signOut);
  const [state, setState] = useState<ConnectionState>({ status: 'checking' });
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    checkHealth().then(setState);
  }, []);

  const runCheck = () => {
    setState({ status: 'checking' });
    checkHealth().then(setState);
  };

  const handleSignOut = async () => {
    setSigningOut(true);
    await signOut();
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={['top']}
    >
      <ScreenHeader title="Pengaturan" />
      <View style={styles.content}>
        <Text muted style={styles.subtitle}>
          Masuk sebagai {user?.email}
        </Text>

        <Text variant="caption" muted style={styles.diagnosticLabel}>
          DIAGNOSTIK KONEKSI (sementara — akan pindah ke FE-7.x)
        </Text>
        <Card style={styles.card}>
          {state.status === 'checking' && <Text>Menghubungkan ke server...</Text>}

          {state.status === 'ok' && (
            <>
              <Text variant="subtitle" color={theme.colors.success}>
                Status backend: ok
              </Text>
              <Text muted>Versi: {state.data.version}</Text>
              <Text muted>Waktu respons: {state.elapsedMs} ms</Text>
            </>
          )}

          {state.status === 'degraded' && (
            <Text variant="subtitle" color={theme.colors.danger}>
              Status backend: degraded ({state.elapsedMs} ms)
            </Text>
          )}

          {state.status === 'error' && (
            <>
              <Text variant="subtitle" color={theme.colors.danger}>
                Tidak bisa terhubung
              </Text>
              <Text muted>{state.message}</Text>
            </>
          )}
        </Card>

        <Button label="Coba lagi" variant="secondary" onPress={runCheck} style={styles.button} />
        <Button
          label="Keluar"
          variant="ghost"
          loading={signingOut}
          onPress={handleSignOut}
          style={styles.button}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, padding: 20, gap: 12 },
  subtitle: { marginBottom: 8 },
  diagnosticLabel: { marginTop: 8 },
  card: { gap: 8 },
  button: { marginTop: 4 },
});
