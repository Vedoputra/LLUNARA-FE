import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';

import { rescheduleAll } from '@/services/notifications';

import { useCyclePrediction } from './useCycles';
import { useReminders } from './useReminders';

/**
 * Keeps local notification schedules aligned with the latest prediction.
 * Local notifications are static once scheduled — if the prediction shifts
 * (a new cycle logged, a reminder toggled) but the schedule isn't refreshed,
 * the user gets reminders on the wrong date.
 */
export function useNotificationSync() {
  const predictionQuery = useCyclePrediction();
  const remindersQuery = useReminders();
  const lastSyncedKeyRef = useRef<string | null>(null);

  useEffect(() => {
    const prediction = predictionQuery.data;
    const reminders = remindersQuery.data;
    if (!prediction || !reminders) return;

    const key = JSON.stringify({ prediction, reminders });
    if (lastSyncedKeyRef.current === key) return;
    lastSyncedKeyRef.current = key;

    rescheduleAll(prediction, reminders);
  }, [predictionQuery.data, remindersQuery.data]);

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
