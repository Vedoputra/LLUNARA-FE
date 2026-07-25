import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ConfidenceBadge } from '@/components/ConfidenceBadge';
import { ErrorState, LoadingState } from '@/components/feedback';
import { ScreenHeader } from '@/components/navigation/ScreenHeader';
import { PhaseIndicator } from '@/components/PhaseIndicator';
import { Button, Card, Text } from '@/components/ui';
import { useCycleActions } from '@/hooks/useCycleActions';
import { useCycles, useCyclePrediction } from '@/hooks/useCycles';
import { useDailyLogs } from '@/hooks/useDailyLogs';
import { useTheme } from '@/hooks/useTheme';
import { useAuthStore } from '@/store/authStore';
import type { FlowIntensity } from '@/types/api';
import { diffInDays, formatLongDate, todayISO } from '@/utils/date';

const FLOW_LABELS: Record<FlowIntensity, string> = {
  light: 'Ringan',
  medium: 'Sedang',
  heavy: 'Berat',
};

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 11) return 'Selamat pagi';
  if (hour < 15) return 'Selamat siang';
  if (hour < 19) return 'Selamat sore';
  return 'Selamat malam';
}

export default function BerandaScreen() {
  const theme = useTheme();
  const today = todayISO();
  const user = useAuthStore((state) => state.user);
  const cyclesQuery = useCycles();
  const predictionQuery = useCyclePrediction();
  const todayLogQuery = useDailyLogs(today, today);
  const { confirmStart, confirmEnd, isStarting, isEnding } = useCycleActions();

  const cycles = cyclesQuery.data ?? [];
  const activeCycle = cycles.find((cycle) => cycle.end_date === null);
  const prediction = predictionQuery.data;
  const todayLog = (todayLogQuery.data ?? [])[0];
  const displayName = user?.email?.split('@')[0];

  const daysUntilPeriod = prediction?.next_period_start
    ? diffInDays(today, prediction.next_period_start)
    : null;

  if (cyclesQuery.isLoading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        edges={['top']}
      >
        <ScreenHeader />
        <LoadingState />
      </SafeAreaView>
    );
  }

  if (cyclesQuery.isError) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        edges={['top']}
      >
        <ScreenHeader />
        <ErrorState onRetry={() => cyclesQuery.refetch()} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={['top']}
    >
      <ScreenHeader />
      <ScrollView contentContainerStyle={styles.content}>
        <View>
          <Text variant="heading">
            {greeting()}
            {displayName ? `, ${displayName}` : ''}
          </Text>
          <Text muted>{formatLongDate(today)}</Text>
        </View>

        <Card style={styles.heroCard}>
          <View style={styles.heroRow}>
            <Image
              source={require('../../assets/mascot/luna-sitting.png')}
              style={styles.heroMascot}
              resizeMode="contain"
            />
            <View style={styles.heroText}>
              {predictionQuery.isLoading ? (
                <Text muted>Memuat prediksi...</Text>
              ) : predictionQuery.isError ? (
                <Text muted>Prediksi tidak tersedia saat ini.</Text>
              ) : (
                <>
                  <Text variant="caption" muted>
                    Hari ke-
                  </Text>
                  <Text variant="display" color={theme.colors.primary}>
                    {prediction?.day_of_cycle ?? '—'}
                  </Text>
                  {prediction?.current_phase ? (
                    <PhaseIndicator phase={prediction.current_phase} />
                  ) : null}
                  <Text variant="caption" muted style={styles.countdownText}>
                    {daysUntilPeriod != null
                      ? daysUntilPeriod > 0
                        ? `Perkiraan menstruasi ${daysUntilPeriod} hari lagi`
                        : 'Menstruasi diperkirakan hari ini'
                      : 'Catat siklus pertamamu untuk melihat prediksi'}
                  </Text>
                </>
              )}
            </View>
          </View>
        </Card>

        {activeCycle ? (
          <Button
            label="Menstruasi berakhir hari ini"
            icon={<Feather name="check-circle" size={18} color={theme.colors.onPrimary} />}
            loading={isEnding}
            onPress={() => confirmEnd(activeCycle.id, today)}
          />
        ) : (
          <Button
            label="Menstruasi dimulai hari ini"
            icon={<Feather name="heart" size={18} color={theme.colors.onPrimary} />}
            loading={isStarting}
            onPress={() => confirmStart(today)}
          />
        )}

        <Card style={styles.logCard}>
          <View style={styles.logCardHeader}>
            <Text variant="subtitle">Catatan hari ini</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={todayLog ? 'Ubah catatan hari ini' : 'Catat hari ini'}
              onPress={() => router.push(`/log/${today}`)}
            >
              <Text variant="caption" color={theme.colors.primary}>
                {todayLog ? 'Ubah' : 'Catat'}
              </Text>
            </Pressable>
          </View>
          {todayLogQuery.isLoading ? (
            <Text muted>Memuat...</Text>
          ) : todayLog ? (
            <View style={styles.logChipRow}>
              {todayLog.mood ? (
                <View style={[styles.miniChip, { backgroundColor: theme.colors.primarySoft }]}>
                  <Text variant="caption" color={theme.colors.primary}>
                    {todayLog.mood}
                  </Text>
                </View>
              ) : null}
              {todayLog.flow_intensity ? (
                <View style={[styles.miniChip, { backgroundColor: theme.colors.primarySoft }]}>
                  <Text variant="caption" color={theme.colors.primary}>
                    {FLOW_LABELS[todayLog.flow_intensity]}
                  </Text>
                </View>
              ) : null}
              {todayLog.symptom_ids.length > 0 ? (
                <View style={[styles.miniChip, { backgroundColor: theme.colors.primarySoft }]}>
                  <Text variant="caption" color={theme.colors.primary}>
                    {todayLog.symptom_ids.length} gejala
                  </Text>
                </View>
              ) : null}
            </View>
          ) : (
            <Text muted>Belum ada catatan untuk hari ini.</Text>
          )}
        </Card>

        {prediction ? (
          <ConfidenceBadge
            confidence={prediction.confidence}
            basedOnCycles={prediction.based_on_cycles}
          />
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, gap: 16, paddingBottom: 40 },
  heroCard: {},
  heroRow: { flexDirection: 'row', gap: 16, alignItems: 'center' },
  heroMascot: { width: 96, height: 96 },
  heroText: { flex: 1, gap: 4 },
  countdownText: { marginTop: 4 },
  logCard: { gap: 8 },
  logCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  logChipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  miniChip: { borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 },
});
