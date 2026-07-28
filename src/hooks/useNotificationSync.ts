import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';

import { rescheduleAll } from '@/services/notifications';
import { useSettingsStore } from '@/store/settingsStore';

import { useCyclePrediction } from './useCycles';
import { useReminders } from './useReminders';

/**
 * Keeps local notification schedules aligned with the latest prediction.
 * Local notifications are static once scheduled — if the prediction shifts
 * (a new cycle logged, a reminder toggled) but the schedule isn't refreshed,
 * the user gets reminders on the wrong date.
 *
 * The water reminder rides along here rather than being scheduled on its own:
 * `rescheduleAll` cancels every pending notification first, so anything
 * scheduled outside this one path would be silently wiped on the next sync.
 */
export function useNotificationSync() {
  const predictionQuery = useCyclePrediction();
  const remindersQuery = useReminders();
  const waterReminder = useSettingsStore((state) => state.waterReminder);
  const lastSyncedKeyRef = useRef<string | null>(null);

  useEffect(() => {
    const prediction = predictionQuery.data;
    const reminders = remindersQuery.data;
    if (!prediction || !reminders) return;

    const key = JSON.stringify({ prediction, reminders, waterReminder });
    if (lastSyncedKeyRef.current === key) return;
    lastSyncedKeyRef.current = key;

    rescheduleAll(prediction, reminders, waterReminder);
  }, [predictionQuery.data, remindersQuery.data, waterReminder]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        predictionQuery.refetch();
        remindersQuery.refetch();
      }
    });
    return () => subscription.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
