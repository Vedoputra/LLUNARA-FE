import { useMutation, useQuery } from '@tanstack/react-query';

import { apiClient } from '@/api/client';
import { invalidate, queryKeys } from '@/api/queryClient';
import type { Envelope, Reminder, ReminderType } from '@/types/api';

export interface UpsertReminderInput {
  type: ReminderType;
  is_enabled: boolean;
  time_of_day?: string;
  days_before?: number;
  custom_message?: string;
}

export function useReminders() {
  return useQuery({
    queryKey: queryKeys.reminders,
    queryFn: () => apiClient.get<Envelope<Reminder[]>>('/api/v1/reminders').then((res) => res.data),
  });
}

export function useUpsertReminder() {
  return useMutation({
    mutationFn: (input: UpsertReminderInput) =>
      apiClient.put<Envelope<Reminder>>('/api/v1/reminders', input).then((res) => res.data),
    onSuccess: () => invalidate.reminders(),
  });
}

export function useDeleteReminder() {
  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/api/v1/reminders/${id}`),
    onSuccess: () => invalidate.reminders(),
  });
}
