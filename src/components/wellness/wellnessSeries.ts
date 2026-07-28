import type { WellnessLog } from '@/types/api';
import { addDaysISO, formatLongDate } from '@/utils/date';

export type WellnessMetric = 'water_glasses' | 'sleep_hours' | 'weight_kg';

export interface WellnessSeriesPoint {
  date: string;
  value: number | null;
}

export interface WellnessSeries {
  points: WellnessSeriesPoint[];
  /** Jumlah hari yang benar-benar punya catatan untuk metrik ini. */
  recordedDays: number;
  totalDays: number;
  latest: { date: string; value: number } | null;
  max: number | null;
  min: number | null;
  average: number | null;
}

/**
 * Membangun deret harian yang berkesinambungan dari `endDate` ke belakang.
 *
 * Backend hanya mengembalikan hari yang punya catatan, jadi hari yang kosong
 * harus diisi `null` di sini — bukan `0`, karena "tidak dicatat" dan "nol gelas"
 * adalah dua hal berbeda dan tidak boleh terlihat sama di grafik.
 */
export function buildWellnessSeries(
  logs: WellnessLog[],
  metric: WellnessMetric,
  endDate: string,
  totalDays: number,
): WellnessSeries {
  const byDate = new Map<string, WellnessLog>();
  for (const log of logs) byDate.set(log.date, log);

  const points: WellnessSeriesPoint[] = [];
  for (let offset = totalDays - 1; offset >= 0; offset--) {
    const date = addDaysISO(endDate, -offset);
    const raw = byDate.get(date)?.[metric];
    points.push({ date, value: typeof raw === 'number' ? raw : null });
  }

  const recorded = points.filter(
    (point): point is { date: string; value: number } => point.value != null,
  );

  const values = recorded.map((point) => point.value);
  const sum = values.reduce((total, value) => total + value, 0);

  return {
    points,
    recordedDays: recorded.length,
    totalDays,
    latest: recorded.length > 0 ? recorded[recorded.length - 1] : null,
    max: values.length > 0 ? Math.max(...values) : null,
    min: values.length > 0 ? Math.min(...values) : null,
    average: values.length > 0 ? sum / values.length : null,
  };
}

export function seriesEdgeLabels(series: WellnessSeries): { start: string; end: string } {
  const first = series.points[0];
  const last = series.points[series.points.length - 1];
  return {
    start: first ? formatLongDate(first.date) : '',
    end: last ? formatLongDate(last.date) : '',
  };
}
