import type { WaterReminderConfig } from '@/store/settingsStore';

/**
 * Jam-jam munculnya pengingat minum, dari `startHour` sampai tidak melewati
 * `endHour`.
 *
 * Dipisahkan dari `services/notifications` supaya tetap pure — modul itu
 * mengimpor expo-notifications dan tidak bisa dijalankan di luar runtime RN.
 */
export function waterReminderHours(config: WaterReminderConfig): number[] {
  const interval = Math.max(1, Math.floor(config.intervalHours));
  const start = Math.min(23, Math.max(0, Math.floor(config.startHour)));
  const end = Math.min(23, Math.max(0, Math.floor(config.endHour)));
  if (end < start) return [];

  const hours: number[] = [];
  for (let hour = start; hour <= end; hour += interval) {
    hours.push(hour);
  }
  return hours;
}
