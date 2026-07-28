import { StyleSheet, View } from 'react-native';

import { useSaveWellness, useWellness } from '@/hooks/useWellness';
import { useSettingsStore } from '@/store/settingsStore';

import { SleepWidget } from './SleepWidget';
import { WaterWidget } from './WaterWidget';
import { WeightWidget } from './WeightWidget';

export interface WellnessRowProps {
  /** Tanggal yang dicatat. Bisa hari ini atau tanggal lampau (backfill). */
  date: string;
}

/**
 * Baris widget wellness untuk satu tanggal.
 *
 * Mengambil datanya sendiri supaya bisa dipakai di Beranda (hari ini) maupun di
 * layar catatan harian (tanggal apa pun) tanpa menyalin wiring-nya dua kali.
 * `POST /api/v1/wellness` merge per field, jadi menyimpan satu metrik tidak
 * menghapus metrik lain di tanggal yang sama.
 */
export function WellnessRow({ date }: WellnessRowProps) {
  const wellnessQuery = useWellness(date, date);
  const saveWellness = useSaveWellness();
  const wellnessEnabled = useSettingsStore((state) => state.wellnessEnabled);

  const entry = (wellnessQuery.data ?? [])[0];
  const anyEnabled = wellnessEnabled.water || wellnessEnabled.sleep || wellnessEnabled.weight;
  if (!anyEnabled) return null;

  return (
    <View style={styles.row}>
      {wellnessEnabled.water ? (
        <WaterWidget
          glasses={entry?.water_glasses ?? null}
          onChange={(glasses) => saveWellness.mutate({ date, water_glasses: glasses })}
        />
      ) : null}
      {wellnessEnabled.sleep ? (
        <SleepWidget
          hours={entry?.sleep_hours ?? null}
          onChange={(hours) => saveWellness.mutate({ date, sleep_hours: hours })}
        />
      ) : null}
      {wellnessEnabled.weight ? (
        <WeightWidget
          weightKg={entry?.weight_kg ?? null}
          onChange={(weightKg) => saveWellness.mutate({ date, weight_kg: weightKg })}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 12 },
});
