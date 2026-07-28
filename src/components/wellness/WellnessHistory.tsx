import { StyleSheet, View } from 'react-native';

import { SparkBarCard } from '@/components/charts';
import { Text } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';
import { useWellness } from '@/hooks/useWellness';
import { useSettingsStore } from '@/store/settingsStore';
import { addDaysISO, todayISO } from '@/utils/date';

import { buildWellnessSeries, seriesEdgeLabels, type WellnessSeries } from './wellnessSeries';

/** Rentang tampil per metrik. Berat badan lebih panjang karena jarang dicatat. */
const WATER_DAYS = 14;
const SLEEP_DAYS = 30;
const WEIGHT_DAYS = 90;
const FETCH_DAYS = Math.max(WATER_DAYS, SLEEP_DAYS, WEIGHT_DAYS);

/**
 * Nilai yang benar-benar dicatat user (nilai terakhir, min, max) — tampilkan
 * persis seperti diketik. Hanya membuang noise floating-point (mis.
 * 65.75999999999999 dari representasi biner 65.76), bukan membulatkan ke
 * jumlah desimal tertentu seperti sebelumnya (65.76 tidak boleh jadi 65.8).
 */
function formatExact(value: number): string {
  return Number(value.toFixed(6)).toString();
}

/** Rata-rata adalah hasil pembagian, bukan angka yang diketik user, jadi
 * dibulatkan 1 desimal supaya terbaca (mis. tidak menampilkan 0.333333...). */
function formatAverage(value: number): string {
  return (Math.round(value * 10) / 10).toString();
}

function coverage(series: WellnessSeries): string {
  return `Tercatat di ${series.recordedDays} dari ${series.totalDays} hari terakhir.`;
}

export function WellnessHistory() {
  const theme = useTheme();
  const today = todayISO();
  const wellnessEnabled = useSettingsStore((state) => state.wellnessEnabled);
  const historyQuery = useWellness(addDaysISO(today, -(FETCH_DAYS - 1)), today);

  const logs = historyQuery.data ?? [];
  const anyEnabled = wellnessEnabled.water || wellnessEnabled.sleep || wellnessEnabled.weight;
  if (!anyEnabled) return null;

  const water = buildWellnessSeries(logs, 'water_glasses', today, WATER_DAYS);
  const sleep = buildWellnessSeries(logs, 'sleep_hours', today, SLEEP_DAYS);
  const weight = buildWellnessSeries(logs, 'weight_kg', today, WEIGHT_DAYS);

  const showWater = wellnessEnabled.water && water.recordedDays > 0;
  const showSleep = wellnessEnabled.sleep && sleep.recordedDays > 0;
  const showWeight = wellnessEnabled.weight && weight.recordedDays > 0;

  return (
    <View style={styles.section}>
      <Text variant="subtitle">Riwayat wellness</Text>

      {historyQuery.isLoading ? (
        <Text muted>Memuat riwayat...</Text>
      ) : historyQuery.isError ? (
        <Text muted>Riwayat wellness tidak tersedia saat ini.</Text>
      ) : !showWater && !showSleep && !showWeight ? (
        <Text muted>
          Belum ada catatan wellness. Catat air minum, tidur, atau berat badan dari Beranda —
          riwayatnya akan muncul di sini.
        </Text>
      ) : null}

      {showWater ? (
        <SparkBarCard
          title="Air minum"
          data={water.points}
          color={theme.colors.cycle.ovulation}
          latestLabel={water.latest ? `${water.latest.value} gelas` : undefined}
          startLabel={seriesEdgeLabels(water).start}
          endLabel="hari ini"
          summaryText={`${coverage(water)} Paling banyak ${water.max} gelas dalam sehari.`}
        />
      ) : null}

      {showSleep ? (
        <SparkBarCard
          title="Tidur"
          data={sleep.points}
          color={theme.colors.cycle.follicular}
          latestLabel={sleep.latest ? `${formatExact(sleep.latest.value)} jam` : undefined}
          startLabel={seriesEdgeLabels(sleep).start}
          endLabel="hari ini"
          summaryText={`${coverage(sleep)} Rata-rata ${sleep.average != null ? formatAverage(sleep.average) : '—'} jam pada hari yang tercatat.`}
        />
      ) : null}

      {showWeight ? (
        <SparkBarCard
          title="Berat badan"
          data={weight.points}
          color={theme.colors.cycle.luteal}
          latestLabel={weight.latest ? `${formatExact(weight.latest.value)} kg` : undefined}
          startLabel={seriesEdgeLabels(weight).start}
          endLabel="hari ini"
          summaryText={`${coverage(weight)} Rentang yang kamu catat ${weight.min != null ? formatExact(weight.min) : '—'}–${weight.max != null ? formatExact(weight.max) : '—'} kg.`}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: 16 },
});
