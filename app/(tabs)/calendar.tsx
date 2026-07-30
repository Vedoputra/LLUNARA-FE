import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Calendar, type DateData } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Card, Sheet, Text } from '@/components/ui';
import { CalendarDay, type DayMarking } from '@/components/calendar/CalendarDay';
import { CalendarLegend } from '@/components/calendar/CalendarLegend';
import { ConfidenceBadge } from '@/components/ConfidenceBadge';
import { EmptyState, ErrorState, LoadingState } from '@/components/feedback';
import { ScreenHeader } from '@/components/navigation/ScreenHeader';
import { useTheme } from '@/hooks/useTheme';
import { useCycleActions } from '@/hooks/useCycleActions';
import { findActiveCycle, useCycles, useCyclePrediction } from '@/hooks/useCycles';
import { useDailyLogs } from '@/hooks/useDailyLogs';
import { addDaysISO, formatLongDate, todayISO } from '@/utils/date';

function monthRange(monthString: string) {
  const from = `${monthString}-01`;
  const [year, month] = monthString.split('-').map(Number);
  const lastDay = new Date(year, month, 0).getDate();
  const to = `${monthString}-${String(lastDay).padStart(2, '0')}`;
  return { from, to };
}

export default function KalenderScreen() {
  const theme = useTheme();
  const today = todayISO();
  const [visibleMonth, setVisibleMonth] = useState(today.slice(0, 7));
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const cyclesQuery = useCycles();
  const predictionQuery = useCyclePrediction();
  const { from, to } = useMemo(() => monthRange(visibleMonth), [visibleMonth]);
  const dailyLogsQuery = useDailyLogs(from, to);
  const { confirmStart, confirmEnd, isStarting, isEnding } = useCycleActions();

  const cycles = useMemo(() => cyclesQuery.data ?? [], [cyclesQuery.data]);
  const prediction = predictionQuery.data;
  const activeCycle = findActiveCycle(cycles);

  const markedDates = useMemo(() => {
    const marks: Record<string, DayMarking> = {};

    for (const cycle of cycles) {
      const end = cycle.end_date ?? (cycle.start_date <= today ? today : cycle.start_date);
      let cursor = cycle.start_date;
      while (cursor <= end) {
        marks[cursor] = { ...marks[cursor], isMenstrual: true };
        cursor = addDaysISO(cursor, 1);
      }
    }

    if (prediction?.next_period_start && prediction.next_period_end) {
      let cursor = prediction.next_period_start;
      while (cursor <= prediction.next_period_end) {
        marks[cursor] = { ...marks[cursor], isPredicted: true };
        cursor = addDaysISO(cursor, 1);
      }
    }

    if (prediction?.fertile_window) {
      let cursor = prediction.fertile_window.start;
      while (cursor <= prediction.fertile_window.end) {
        marks[cursor] = { ...marks[cursor], isFertile: true };
        cursor = addDaysISO(cursor, 1);
      }
    }

    if (prediction?.estimated_ovulation) {
      marks[prediction.estimated_ovulation] = {
        ...marks[prediction.estimated_ovulation],
        isOvulationDay: true,
      };
    }

    for (const log of dailyLogsQuery.data ?? []) {
      if ((log.symptom_ids ?? []).length > 0) {
        marks[log.date] = { ...marks[log.date], hasSymptom: true };
      }
    }

    return marks;
  }, [cycles, prediction, dailyLogsQuery.data, today]);

  const averagePeriodLength = useMemo(() => {
    const values = cycles
      .map((cycle) => cycle.period_length)
      .filter((value): value is number => value != null);
    if (values.length === 0) return null;
    return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
  }, [cycles]);

  const handleConfirmStart = (date: string) => confirmStart(date, () => setSelectedDate(null));

  const handleConfirmEnd = (date: string) => {
    if (!activeCycle) return;
    confirmEnd(activeCycle.id, date, () => setSelectedDate(null), activeCycle.start_date);
  };

  if (cyclesQuery.isLoading || predictionQuery.isLoading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        edges={['top']}
      >
        <ScreenHeader title="Kalender" />
        <LoadingState />
      </SafeAreaView>
    );
  }

  if (cyclesQuery.isError || predictionQuery.isError) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        edges={['top']}
      >
        <ScreenHeader title="Kalender" />
        <ErrorState
          onRetry={() => {
            cyclesQuery.refetch();
            predictionQuery.refetch();
          }}
        />
      </SafeAreaView>
    );
  }

  const selectedMarking = selectedDate ? markedDates[selectedDate] : undefined;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={['top']}
    >
      <ScreenHeader title="Kalender" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.calendarCard} padding={8}>
          <Calendar
            // react-native-calendars membangun style-nya sekali lewat
            // `useRef(styleConstructor(theme))` dan tidak pernah menghitung ulang
            // saat prop `theme` berubah. Karena layar tab tetap ter-mount, ganti
            // mode terang/gelap membuat teks bulan tertinggal di warna palet lama
            // sampai hampir tidak terlihat. `key` memaksa remount saat skema ganti.
            key={theme.scheme}
            current={`${visibleMonth}-01`}
            onMonthChange={(month: DateData) => setVisibleMonth(month.dateString.slice(0, 7))}
            onDayPress={(day: DateData) => setSelectedDate(day.dateString)}
            dayComponent={({ date, state }) => (
              <CalendarDay
                date={date}
                state={state}
                marking={date ? markedDates[date.dateString] : undefined}
                onPress={(pressed) => setSelectedDate(pressed.dateString)}
              />
            )}
            monthFormat="MMMM yyyy"
            firstDay={0}
            theme={{
              backgroundColor: 'transparent',
              calendarBackground: 'transparent',
              textMonthFontFamily: theme.fontFamilies.display,
              textMonthFontSize: 20,
              monthTextColor: theme.colors.text,
              textSectionTitleColor: theme.colors.textMuted,
              arrowColor: theme.colors.primary,
            }}
          />
        </Card>

        <CalendarLegend />

        <Card style={styles.summaryCard}>
          <Text variant="subtitle" style={styles.summaryTitle}>
            Siklus saat ini
          </Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text variant="heading" color={theme.colors.primary}>
                {prediction?.day_of_cycle ?? '—'}
              </Text>
              <Text variant="caption" muted style={styles.summaryLabel}>
                hari berjalan
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text variant="heading" color={theme.colors.primary}>
                {prediction?.average_cycle_length ?? '—'}
              </Text>
              <Text variant="caption" muted style={styles.summaryLabel}>
                rata-rata siklus
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text variant="heading" color={theme.colors.primary}>
                {averagePeriodLength ?? '—'}
              </Text>
              <Text variant="caption" muted style={styles.summaryLabel}>
                rata-rata menstruasi
              </Text>
            </View>
          </View>
        </Card>

        {prediction ? (
          <ConfidenceBadge
            confidence={prediction.confidence}
            basedOnCycles={prediction.based_on_cycles}
          />
        ) : null}

        {cycles.length === 0 ? (
          <EmptyState
            title="Belum ada catatan siklus"
            message="Tekan sebuah tanggal untuk mulai mencatat hari pertama menstruasimu."
          />
        ) : null}
      </ScrollView>

      <Sheet visible={!!selectedDate} onClose={() => setSelectedDate(null)}>
        {selectedDate ? (
          <View style={styles.sheetContent}>
            <Text variant="title">{formatLongDate(selectedDate)}</Text>
            <Text muted style={styles.sheetPhase}>
              {selectedMarking?.isMenstrual
                ? 'Hari menstruasi'
                : selectedMarking?.isPredicted
                  ? 'Perkiraan menstruasi'
                  : selectedMarking?.isOvulationDay
                    ? 'Perkiraan hari ovulasi'
                    : selectedMarking?.isFertile
                      ? 'Perkiraan masa subur'
                      : 'Belum ada catatan'}
            </Text>

            <Button
              label="Catat hari ini"
              icon={<Feather name="edit-3" size={18} color={theme.colors.onPrimary} />}
              onPress={() => {
                const date = selectedDate;
                setSelectedDate(null);
                router.push(`/log/${date}`);
              }}
              style={styles.sheetButton}
            />

            {activeCycle && selectedDate >= activeCycle.start_date ? (
              <Button
                label="Tandai akhir menstruasi"
                variant="secondary"
                loading={isEnding}
                onPress={() => handleConfirmEnd(selectedDate)}
                style={styles.sheetButton}
              />
            ) : (
              <Button
                label="Tandai sebagai awal menstruasi"
                variant="secondary"
                icon={<Feather name="droplet" size={18} color={theme.colors.primary} />}
                loading={isStarting}
                onPress={() => handleConfirmStart(selectedDate)}
                style={styles.sheetButton}
              />
            )}
          </View>
        ) : null}
      </Sheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20, gap: 16, paddingBottom: 40 },
  calendarCard: {},
  summaryCard: { gap: 12 },
  summaryTitle: {},
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryItem: { alignItems: 'center', gap: 4, flex: 1, paddingHorizontal: 4 },
  // Text yang wrap ke 2 baris menyempit ke lebar kata terpanjangnya sendiri,
  // jadi `textAlign: 'center'` saja nyaris tak terlihat bila kedua baris
  // panjangnya mirip (mis. "rata-rata" vs "menstruasi"). `alignSelf: 'stretch'`
  // memaksa lebar penuh sekolom dulu, baru center-nya benar-benar terasa.
  summaryLabel: { alignSelf: 'stretch', textAlign: 'center' },
  sheetContent: { gap: 4, paddingBottom: 16 },
  sheetPhase: { marginBottom: 16 },
  sheetButton: { marginTop: 8 },
});
