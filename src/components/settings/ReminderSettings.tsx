import { Feather } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Switch, View } from 'react-native';
import type { NotificationRequest } from 'expo-notifications';

import { Chip, Sheet, Text } from '@/components/ui';
import { useNotificationPermission } from '@/hooks/useNotificationPermission';
import { useReminders, useUpsertReminder, type UpsertReminderInput } from '@/hooks/useReminders';
import { useTheme } from '@/hooks/useTheme';
import { getScheduledNotifications } from '@/services/notifications';
import type { Reminder, ReminderType } from '@/types/api';

const TIME_PRESETS = [
  '06:00',
  '07:00',
  '08:00',
  '09:00',
  '12:00',
  '18:00',
  '20:00',
  '21:00',
  '22:00',
];

function findReminder(reminders: Reminder[], type: ReminderType) {
  return reminders.find((reminder) => reminder.type === type);
}

export function ReminderSettings() {
  const theme = useTheme();
  const remindersQuery = useReminders();
  const upsertReminder = useUpsertReminder();
  const permission = useNotificationPermission();
  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const [scheduled, setScheduled] = useState<NotificationRequest[]>([]);

  const reminders = remindersQuery.data ?? [];
  const periodReminder = findReminder(reminders, 'period_upcoming');
  const fertileReminder = findReminder(reminders, 'fertile_window');
  const medicationReminder = findReminder(reminders, 'medication');

  useEffect(() => {
    getScheduledNotifications().then(setScheduled);
  }, [remindersQuery.data]);

  const ensurePermission = async (): Promise<boolean> => {
    if (permission.isGranted) return true;
    const granted = await permission.request();
    if (!granted) {
      Alert.alert(
        'Izin notifikasi diperlukan',
        'Aktifkan izin notifikasi di pengaturan sistem agar pengingat bisa muncul.',
        [
          { text: 'Nanti', style: 'cancel' },
          { text: 'Buka Pengaturan', onPress: () => permission.openSettings() },
        ],
      );
      return false;
    }
    return true;
  };

  const saveReminder = (type: ReminderType, overrides: Partial<UpsertReminderInput>) => {
    const current = findReminder(reminders, type);
    upsertReminder.mutate({
      type,
      is_enabled: current?.is_enabled ?? false,
      days_before: current?.days_before ?? undefined,
      time_of_day: current?.time_of_day ?? undefined,
      custom_message: current?.custom_message ?? undefined,
      ...overrides,
    });
  };

  const handleToggle = async (type: ReminderType, current: Reminder | undefined) => {
    const nextEnabled = !(current?.is_enabled ?? false);
    if (nextEnabled) {
      const granted = await ensurePermission();
      if (!granted) return;
    }
    const defaults: Partial<UpsertReminderInput> = { is_enabled: nextEnabled };
    if (type === 'period_upcoming' && current?.days_before == null) defaults.days_before = 2;
    if (type === 'medication' && current?.time_of_day == null) defaults.time_of_day = '09:00';
    saveReminder(type, defaults);
  };

  const handlePickTime = (time: string) => {
    setTimePickerVisible(false);
    saveReminder('medication', { time_of_day: time, is_enabled: true });
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Feather name="bell" size={18} color={theme.colors.textMuted} />
        <Text style={styles.rowLabel}>Menstruasi akan datang</Text>
        <Switch
          value={periodReminder?.is_enabled ?? false}
          onValueChange={() => handleToggle('period_upcoming', periodReminder)}
          trackColor={{ true: theme.colors.primary }}
        />
      </View>

      <View style={styles.row}>
        <Feather name="heart" size={18} color={theme.colors.textMuted} />
        <Text style={styles.rowLabel}>Masa subur</Text>
        <Switch
          value={fertileReminder?.is_enabled ?? false}
          onValueChange={() => handleToggle('fertile_window', fertileReminder)}
          trackColor={{ true: theme.colors.primary }}
        />
      </View>

      <View style={styles.row}>
        <Feather name="clock" size={18} color={theme.colors.textMuted} />
        <Text style={styles.rowLabel}>Pengingat obat</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Ubah jam pengingat obat"
          onPress={() => setTimePickerVisible(true)}
          style={[styles.timeChip, { backgroundColor: theme.colors.surfaceVariant }]}
        >
          <Text variant="caption">{medicationReminder?.time_of_day ?? '09:00'}</Text>
        </Pressable>
        <Switch
          value={medicationReminder?.is_enabled ?? false}
          onValueChange={() => handleToggle('medication', medicationReminder)}
          trackColor={{ true: theme.colors.primary }}
        />
      </View>

      <Text variant="caption" muted style={styles.scheduledLabel}>
        PENGINGAT TERJADWAL DI PERANGKAT INI ({scheduled.length})
      </Text>
      {scheduled.length === 0 ? (
        <Text variant="caption" muted>
          Tidak ada pengingat terjadwal saat ini.
        </Text>
      ) : (
        scheduled.map((notification) => (
          <Text key={notification.identifier} variant="caption" muted>
            • {notification.content.body}
          </Text>
        ))
      )}

      <Sheet visible={timePickerVisible} onClose={() => setTimePickerVisible(false)}>
        <Text variant="subtitle" style={styles.sheetTitle}>
          Jam pengingat obat
        </Text>
        <View style={styles.timeGrid}>
          {TIME_PRESETS.map((time) => (
            <Chip
              key={time}
              label={time}
              selected={medicationReminder?.time_of_day === time}
              onPress={() => handlePickTime(time)}
            />
          ))}
        </View>
      </Sheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 12 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 44,
  },
  rowLabel: { flex: 1 },
  timeChip: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  scheduledLabel: { marginTop: 8, letterSpacing: 0.5 },
  sheetTitle: { marginBottom: 12 },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingBottom: 16 },
});
