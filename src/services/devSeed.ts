import { apiClient } from '@/api/client';
import { invalidate } from '@/api/queryClient';
import type { Cycle, Envelope, FlowIntensity, Symptom } from '@/types/api';
import { addDaysISO, todayISO } from '@/utils/date';

export interface SeedProgress {
  step: string;
  current: number;
  total: number;
}

// Oldest first. Realistic variation, not perfectly regular, so predictions
// come back as "cukup teratur" rather than a suspiciously flat line.
const CYCLE_LENGTHS = [28, 27, 30, 26, 29, 28];
const PERIOD_LENGTH_DAYS = 5;
const FLOW_PATTERN: FlowIntensity[] = ['light', 'medium', 'heavy', 'heavy', 'light'];
const MOODS = ['senang', 'tenang', 'biasa', 'sensitif', 'cemas', 'sedih', 'mudah marah'];
const BATCH_SIZE = 4;

function pick<T>(items: T[], index: number): T | undefined {
  if (items.length === 0) return undefined;
  return items[index % items.length];
}

async function runInBatches(
  tasks: (() => Promise<unknown>)[],
  onBatchDone: (done: number) => void,
) {
  for (let i = 0; i < tasks.length; i += BATCH_SIZE) {
    const batch = tasks.slice(i, i + BATCH_SIZE);
    await Promise.all(batch.map((task) => task()));
    onBatchDone(Math.min(i + BATCH_SIZE, tasks.length));
  }
}

export async function seedSampleData(onProgress?: (progress: SeedProgress) => void): Promise<void> {
  const today = todayISO();

  onProgress?.({ step: 'Mengambil daftar gejala', current: 0, total: 1 });
  const symptomsRes = await apiClient.get<Envelope<Symptom[]>>('/api/v1/symptoms');
  const physical = symptomsRes.data.filter((s) => s.category === 'physical');
  const emotional = symptomsRes.data.filter((s) => s.category === 'emotional');
  onProgress?.({ step: 'Mengambil daftar gejala', current: 1, total: 1 });

  // Clear any cycles already in the account (e.g. from earlier manual
  // testing) first — the overlap check has no way to know our generated
  // history is meant to replace them, so a leftover cycle anywhere in the
  // computed range would otherwise fail every seed run with CYCLE_OVERLAP.
  const existingCyclesRes = await apiClient.get<Envelope<Cycle[]>>('/api/v1/cycles');
  const existingCycles = existingCyclesRes.data;
  onProgress?.({ step: 'Membersihkan siklus lama', current: 0, total: existingCycles.length });
  for (let i = 0; i < existingCycles.length; i++) {
    await apiClient.delete(`/api/v1/cycles/${existingCycles[i].id}`);
    onProgress?.({
      step: 'Membersihkan siklus lama',
      current: i + 1,
      total: existingCycles.length,
    });
  }

  const totalSpan = CYCLE_LENGTHS.reduce((sum, length) => sum + length, 0);
  let cursor = addDaysISO(today, -totalSpan);
  const cycles: { start: string; end: string; length: number }[] = [];
  for (const length of CYCLE_LENGTHS) {
    const start = cursor;
    const end = addDaysISO(start, PERIOD_LENGTH_DAYS - 1);
    cycles.push({ start, end, length });
    cursor = addDaysISO(start, length);
  }

  onProgress?.({ step: 'Membuat riwayat siklus', current: 0, total: cycles.length });
  for (let i = 0; i < cycles.length; i++) {
    const { start, end } = cycles[i];
    const created = await apiClient.post<Envelope<{ cycle: Cycle }>>('/api/v1/cycles', {
      start_date: start,
    });
    await apiClient.patch(`/api/v1/cycles/${created.data.cycle.id}`, { end_date: end });
    onProgress?.({ step: 'Membuat riwayat siklus', current: i + 1, total: cycles.length });
  }

  const dailyLogTasks: (() => Promise<unknown>)[] = [];
  cycles.forEach((cycle, cycleIndex) => {
    for (let d = 0; d < PERIOD_LENGTH_DAYS; d++) {
      const date = addDaysISO(cycle.start, d);
      if (date > today) return;
      const symptom = pick(physical, cycleIndex + d);
      dailyLogTasks.push(() =>
        apiClient.post('/api/v1/daily-logs', {
          date,
          flow_intensity: pick(FLOW_PATTERN, d),
          mood: pick(MOODS, cycleIndex + d),
          symptom_ids: symptom ? [symptom.id] : [],
        }),
      );
    }

    // Spread a handful of logs across the rest of the cycle (follicular ->
    // ovulation -> luteal) so phase-based insights have data outside of
    // menstruation too — matches how the app is actually meant to be used.
    const midCycleOffsets = [
      Math.round(cycle.length * 0.35),
      Math.round(cycle.length * 0.5),
      Math.round(cycle.length * 0.65),
      Math.round(cycle.length * 0.85),
    ];
    midCycleOffsets.forEach((offset, idx) => {
      const date = addDaysISO(cycle.start, offset);
      if (date > today || date <= cycle.end) return;
      const symptom = idx % 2 === 0 ? pick(emotional, cycleIndex) : pick(physical, cycleIndex + 2);
      dailyLogTasks.push(() =>
        apiClient.post('/api/v1/daily-logs', {
          date,
          mood: pick(MOODS, cycleIndex + idx + 1),
          symptom_ids: symptom ? [symptom.id] : [],
        }),
      );
    });
  });

  onProgress?.({ step: 'Mencatat log harian', current: 0, total: dailyLogTasks.length });
  await runInBatches(dailyLogTasks, (done) =>
    onProgress?.({ step: 'Mencatat log harian', current: done, total: dailyLogTasks.length }),
  );

  const wellnessTasks: (() => Promise<unknown>)[] = [];
  for (let i = 0; i < 14; i++) {
    const date = addDaysISO(today, -i);
    wellnessTasks.push(() =>
      apiClient.post('/api/v1/wellness', {
        date,
        water_glasses: 4 + (i % 5),
        sleep_hours: 6 + (i % 3) * 0.5,
        ...(i % 4 === 0 ? { weight_kg: 55 + (i % 2) } : {}),
      }),
    );
  }

  onProgress?.({ step: 'Mencatat wellness', current: 0, total: wellnessTasks.length });
  await runInBatches(wellnessTasks, (done) =>
    onProgress?.({ step: 'Mencatat wellness', current: done, total: wellnessTasks.length }),
  );

  await Promise.all([invalidate.cycles(), invalidate.dailyLogs(), invalidate.wellness()]);
}
