import { useMutation, useQuery } from '@tanstack/react-query';

import { apiClient } from '@/api/client';
import { invalidate, queryKeys } from '@/api/queryClient';
import type { Envelope, WellnessLog } from '@/types/api';

export interface SaveWellnessInput {
  date: string;
  water_glasses?: number;
  sleep_hours?: number;
  weight_kg?: number;
}

export function useWellness(from: string, to: string) {
  return useQuery({
    queryKey: queryKeys.wellness(from, to),
    queryFn: () =>
      apiClient
        .get<Envelope<WellnessLog[]>>(`/api/v1/wellness?from=${from}&to=${to}`)
        .then((res) => res.data),
  });
}

export function useSaveWellness() {
  return useMutation({
    mutationFn: (input: SaveWellnessInput) =>
      apiClient.post<Envelope<WellnessLog>>('/api/v1/wellness', input).then((res) => res.data),
    onSuccess: () => invalidate.wellness(),
  });
}
