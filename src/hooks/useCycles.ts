import { useMutation, useQuery } from '@tanstack/react-query';

import { apiClient } from '@/api/client';
import { invalidate, queryKeys } from '@/api/queryClient';
import { ApiError, type Cycle, type CyclePrediction, type Envelope } from '@/types/api';

interface CycleWriteResponse {
  cycle: Cycle;
  prediction: CyclePrediction;
}

export function useCycles() {
  return useQuery({
    queryKey: queryKeys.cycles,
    queryFn: () => apiClient.get<Envelope<Cycle[]>>('/api/v1/cycles').then((res) => res.data),
  });
}

export function useCyclePrediction() {
  return useQuery({
    queryKey: queryKeys.cyclePrediction,
    queryFn: () =>
      apiClient.get<Envelope<CyclePrediction>>('/api/v1/cycles/prediction').then((res) => res.data),
  });
}

export function useStartCycle() {
  return useMutation({
    mutationFn: (startDate: string) =>
      apiClient
        .post<Envelope<CycleWriteResponse>>('/api/v1/cycles', { start_date: startDate })
        .then((res) => res.data),
    onSuccess: () => invalidate.cycles(),
  });
}

export function useEndCycle() {
  return useMutation({
    mutationFn: ({ cycleId, endDate }: { cycleId: string; endDate: string }) =>
      apiClient
        .patch<Envelope<CycleWriteResponse>>(`/api/v1/cycles/${cycleId}`, { end_date: endDate })
        .then((res) => res.data),
    onSuccess: () => invalidate.cycles(),
  });
}

export function useDeleteCycle() {
  return useMutation({
    mutationFn: (cycleId: string) => apiClient.delete(`/api/v1/cycles/${cycleId}`),
    onSuccess: () => invalidate.cycles(),
  });
}

export function cycleOverlapMessage(error: unknown): string | null {
  if (error instanceof ApiError && error.code === 'CYCLE_OVERLAP') {
    return 'Tanggal ini tumpang tindih dengan siklus yang sudah tercatat. Periksa kembali riwayat siklusmu.';
  }
  return null;
}
