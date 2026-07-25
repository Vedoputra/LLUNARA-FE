import * as Notifications from 'expo-notifications';
import { Linking, Platform } from 'react-native';

import type { CyclePrediction, Reminder } from '@/types/api';
import { addDaysISO } from '@/utils/date';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const ANDROID_CHANNEL_ID = 'default';

export async function ensureAndroidChannel() {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(ANDROID_CHANNEL_ID, {
    name: 'Pengingat LLunara',
    importance: Notifications.AndroidImportance.DEFAULT,
  });
}

export async function getPermissionStatus() {
  return Notifications.getPermissionsAsync();
}

export async function requestPermission(): Promise<boolean> {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export function openSystemSettings() {
  Linking.openSettings();
}

function parseTimeOfDay(timeOfDay: string | null): { hour: number; minute: number } {
  if (!timeOfDay) return { hour: 9, minute: 0 };
  const [hour, minute] = timeOfDay.split(':').map(Number);
  return { hour, minute };
}

async function scheduleOnDate(dateISO: string, hour: number, minute: number, body: string) {
  const [year, month, day] = dateISO.split('-').map(Number);
  const date = new Date(year, month - 1, day, hour, minute, 0);
  if (date.getTime() <= Date.now()) return;

  await Notifications.scheduleNotificationAsync({
    content: { title: 'LLunara', body },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date,
      channelId: ANDROID_CHANNEL_ID,
    },
  });
}

export async function scheduleAll(prediction: CyclePrediction, reminders: Reminder[]) {
  await ensureAndroidChannel();

  for (const reminder of reminders) {
    if (!reminder.is_enabled) continue;

    if (reminder.type === 'period_upcoming' && prediction.next_period_start) {
      const daysBefore = reminder.days_before ?? 2;
      const { hour, minute } = parseTimeOfDay(reminder.time_of_day);
      const targetDate = addDaysISO(prediction.next_period_start, -daysBefore);
      const defaultBody =
        daysBefore <= 0
          ? 'Perkiraan menstruasi hari ini'
          : daysBefore === 1
            ? 'Perkiraan menstruasi besok'
            : `Perkiraan menstruasi dalam ${daysBefore} hari`;
      await scheduleOnDate(targetDate, hour, minute, reminder.custom_message ?? defaultBody);
    }

    if (reminder.type === 'fertile_window' && prediction.fertile_window) {
      const { hour, minute } = parseTimeOfDay(reminder.time_of_day);
      await scheduleOnDate(
        prediction.fertile_window.start,
        hour,
        minute,
        reminder.custom_message ?? 'Jendela subur dimulai hari ini',
      );
    }

    if (reminder.type === 'medication' && reminder.time_of_day) {
      const { hour, minute } = parseTimeOfDay(reminder.time_of_day);
      await Notifications.scheduleNotificationAsync({
        content: { title: 'LLunara', body: reminder.custom_message ?? 'Waktunya minum obat' },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour,
          minute,
          channelId: ANDROID_CHANNEL_ID,
        },
      });
    }

    // 'checkup' reminders have no date basis in the current reminder model
    // (no explicit target date field), so they aren't scheduled yet.
  }
}

export async function cancelAll() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function rescheduleAll(prediction: CyclePrediction, reminders: Reminder[]) {
  await cancelAll();
  await scheduleAll(prediction, reminders);
}

export async function getScheduledNotifications() {
  return Notifications.getAllScheduledNotificationsAsync();
}
