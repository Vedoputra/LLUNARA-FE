import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BarChartCard, LineChartCard, StackedBarCard } from '@/components/charts';
import { EmptyState, ErrorState, LoadingState } from '@/components/feedback';
import { ScreenHeader } from '@/components/navigation/ScreenHeader';
import { Card, Chip, Text } from '@/components/ui';
import { useInsightsSummary, useMoodInsights, useSymptomInsights } from '@/hooks/useInsights';
import { useTheme } from '@/hooks/useTheme';
import type { CyclePhase, Regularity } from '@/types/api';

const REGULARITY_LABELS: Record<Regularity, string> = {
  regular: 'Teratur',
  moderate: 'Cukup teratur',
  irregular: 'Bervariasi',
};

const PHASE_SHORT_LABELS: Record<CyclePhase, string> = {
  menstrual: 'Menstruasi',
  follicular: 'Folikular',
  ovulation: 'Ovulasi',
  luteal: 'Luteal',
};

const PHASE_ORDER: CyclePhase[] = ['menstrual', 'follicular', 'ovulation', 'luteal'];

const RANGE_OPTIONS = [
  { months: 3, label: '3 bulan' },
  { months: 6, label: '6 bulan' },
  { months: 12, label: '1 tahun' },
];

export default function StatistikScreen() {
  const theme = useTheme();
  const [months, setMonths] = useState(6);

  const summaryQuery = useInsightsSummary();
  const symptomsQuery = useSymptomInsights(months);
  const moodQuery = useMoodInsights(months);

  const phaseColors = useMemo(() => PHASE_ORDER.map((phase) => theme.colors.cycle[phase]), [theme]);

  if (summaryQuery.isLoading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        edges={['top']}
      >
        <ScreenHeader title="Statistik" />
        <LoadingState />
      </SafeAreaView>
    );
  }

  if (summaryQuery.isError) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        edges={['top']}
      >
        <ScreenHeader title="Statistik" />
        <ErrorState onRetry={() => summaryQuery.refetch()} />
      </SafeAreaView>
    );
  }

  const summary = summaryQuery.data;

  if (summary && !summary.has_sufficient_data) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        edges={['top']}
      >
        <ScreenHeader title="Statistik" />
        <EmptyState
          title="Belum cukup data"
          message={summary.message ?? 'Catat beberapa siklus lagi untuk melihat pola siklusmu.'}
          actionLabel="Ke kalender"
          actionIcon={<Feather name="calendar" size={18} color={theme.colors.primary} />}
          onAction={() => router.push('/calendar')}
        />
      </SafeAreaView>
    );
  }

  const symptoms = symptomsQuery.data?.symptoms ?? [];
  const topSymptoms = symptoms.slice(0, 5);
  const stackedSymptoms = symptoms.slice(0, 3);

  const stackedData = stackedSymptoms.map((symptom) => ({
    label: symptom.name,
    stacks: PHASE_ORDER.map((phase, index) => ({
      value: symptom.phase_distribution[phase] ?? 0,
      color: phaseColors[index],
    })),
  }));

  const topSymptomPhaseSentence = (() => {
    const first = symptoms[0];
    if (!first) return null;
    const entries = Object.entries(first.phase_distribution) as [CyclePhase, number][];
    if (entries.length === 0) return null;
    const [topPhase] = entries.sort((a, b) => b[1] - a[1])[0];
    return `${first.name} paling sering kamu catat pada fase ${PHASE_SHORT_LABELS[topPhase].toLowerCase()}.`;
  })();

  const moodPhases = moodQuery.data?.by_phase ?? [];

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={['top']}
    >
      <ScreenHeader title="Statistik" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text muted>Mengenali pola tubuhmu</Text>

        <View style={styles.rangeRow}>
          {RANGE_OPTIONS.map((option) => (
            <Chip
              key={option.months}
              label={option.label}
              selected={months === option.months}
              onPress={() => setMonths(option.months)}
            />
          ))}
        </View>

        {summary ? (
          <>
            <Text variant="subtitle">Ringkasan siklus</Text>
            <View style={styles.statGrid}>
              <Card style={styles.statCard}>
                <Text variant="heading" color={theme.colors.primary}>
                  {summary.average_cycle_length ?? '—'}
                </Text>
                <Text variant="caption" muted>
                  rata-rata siklus
                </Text>
              </Card>
              <Card style={styles.statCard}>
                <Text variant="heading" color={theme.colors.primary}>
                  {summary.shortest_cycle ?? '—'}–{summary.longest_cycle ?? '—'}
                </Text>
                <Text variant="caption" muted>
                  rentang siklus
                </Text>
              </Card>
              <Card style={styles.statCard}>
                <Text variant="heading" color={theme.colors.primary}>
                  {summary.average_period_length ?? '—'}
                </Text>
                <Text variant="caption" muted>
                  rata-rata menstruasi
                </Text>
              </Card>
              <Card style={styles.statCard}>
                <Text variant="subtitle" color={theme.colors.primary}>
                  {summary.regularity ? REGULARITY_LABELS[summary.regularity] : '—'}
                </Text>
                <Text variant="caption" muted>
                  keteraturan
                </Text>
              </Card>
            </View>

            {summary.cycle_length_trend && summary.cycle_length_trend.length > 0 ? (
              <LineChartCard
                title="Tren panjang siklus"
                data={summary.cycle_length_trend.map((point) => ({ value: point.cycle_length }))}
                summaryText={
                  summary.regularity === 'irregular'
                    ? 'Panjang siklusmu cukup bervariasi pada periode ini.'
                    : `Panjang siklusmu cukup konsisten dalam ${summary.total_cycles} siklus terakhir.`
                }
              />
            ) : null}
          </>
        ) : null}

        {topSymptoms.length > 0 ? (
          <BarChartCard
            title="Gejala paling sering"
            data={topSymptoms.map((symptom) => ({ value: symptom.count, label: symptom.name }))}
            summaryText={`Berdasarkan ${symptomsQuery.data?.sample_size ?? 0} catatan dalam ${months} bulan terakhir.`}
          />
        ) : null}

        {stackedData.length > 0 ? (
          <StackedBarCard
            title="Gejala per fase"
            data={stackedData}
            legend={PHASE_ORDER.map((phase, index) => ({
              label: PHASE_SHORT_LABELS[phase],
              color: phaseColors[index],
            }))}
            summaryText={topSymptomPhaseSentence ?? 'Distribusi gejala berdasarkan fase siklus.'}
          />
        ) : null}

        {moodPhases.length > 0 ? (
          <Card style={styles.moodCard}>
            <Text variant="subtitle" style={styles.moodTitle}>
              Pola suasana hati per fase
            </Text>
            {moodPhases.map((phase) => (
              <View key={phase.phase} style={styles.moodRow}>
                <Text variant="body">{PHASE_SHORT_LABELS[phase.phase]}</Text>
                <Text muted variant="caption">
                  {phase.dominant_mood
                    ? `Paling sering: ${phase.dominant_mood} (${phase.sample_size} catatan)`
                    : 'Belum ada catatan'}
                </Text>
              </View>
            ))}
          </Card>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, gap: 16, paddingBottom: 40 },
  rangeRow: { flexDirection: 'row', gap: 8 },
  statGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  statCard: { width: '47%', alignItems: 'center', gap: 4 },
  moodCard: { gap: 8 },
  moodTitle: { marginBottom: 4 },
  moodRow: { gap: 2, paddingVertical: 4 },
});
