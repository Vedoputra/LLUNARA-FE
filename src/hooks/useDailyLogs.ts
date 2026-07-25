import { useMutation, useQuery } from '@tanstack/react-query';

import { apiClient } from '@/api/client';
import { invalidate, queryKeys } from '@/api/queryClient';
import type { DailyLog, Envelope, FlowIntensity } from '@/types/api';

export interface SaveDailyLogInput {
  date: string;
  flow_intensity?: FlowIntensity;
  mood?: string;
  notes?: string;
  symptom_ids?: string[];
}

export function useDailyLogs(from: string, to: string) {
  return useQuery({
    queryKey: queryKeys.dailyLogs(from, to),
    queryFn: () =>
      apiClient
        .get<Envelope<DailyLog[]>>(`/api/v1/daily-logs?from=${from}&to=${to}`)
        .then((res) => res.data),
  });
}

export function useSaveDailyLog() {
  return useMutation({
    mutationFn: (input: SaveDailyLogInput) =>
      apiClient.post<Envelope<DailyLog>>('/api/v1/daily-logs', input).then((res) => res.data),
    onSuccess: () => invalidate.dailyLogs(),
  });
}

export function useDeleteDailyLog() {
  return useMutation({
    mutationFn: (date: string) => apiClient.delete(`/api/v1/daily-logs/${date}`),
    onSuccess: () => invalidate.dailyLogs(),
  });
}
