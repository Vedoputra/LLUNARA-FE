import { useMutation, useQuery } from '@tanstack/react-query';

import { apiClient } from '@/api/client';
import { invalidate, queryClient, queryKeys } from '@/api/queryClient';
import { ApiError, type Cycle, type CyclePrediction, type Envelope } from '@/types/api';

interface CycleWriteResponse {
  cycle: Cycle;
  prediction: CyclePrediction;
}

/**
 * Setiap penulisan siklus sudah mengembalikan prediksi terbaru dalam response
 * yang sama (lihat list_api.md), jadi hasilnya langsung ditanam ke cache.
 *
 * Tanpa ini, hari siklus dan fase di Beranda baru berubah setelah request
 * kedua selesai — terlihat seperti angkanya "tidak ikut berubah" padahal cuma
 * belum ter-refetch.
 */
function seedPrediction(prediction: CyclePrediction) {
  queryClient.setQueryData(queryKeys.cyclePrediction, prediction);
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
    onSuccess: (data) => {
      seedPrediction(data.prediction);
      return invalidate.cycles();
    },
  });
}

export function useEndCycle() {
  return useMutation({
    mutationFn: ({ cycleId, endDate }: { cycleId: string; endDate: string }) =>
      apiClient
        .patch<Envelope<CycleWriteResponse>>(`/api/v1/cycles/${cycleId}`, { end_date: endDate })
        .then((res) => res.data),
    onSuccess: (data) => {
      seedPrediction(data.prediction);
      return invalidate.cycles();
    },
  });
}

export function useDeleteCycle() {
  return useMutation({
    mutationFn: (cycleId: string) => apiClient.delete(`/api/v1/cycles/${cycleId}`),
    onSuccess: () => invalidate.cycles(),
  });
}

/**
 * Siklus yang masih berjalan (belum ditandai berakhir).
 *
 * Sengaja memakai cek falsy, bukan `=== null`: kontrak API menyebut `end_date`
 * bernilai `null`, tapi serializer Go dengan `omitempty` bisa menghilangkan
 * field-nya sama sekali sehingga di sisi klien nilainya `undefined`. Cek ketat
 * `=== null` akan meleset di kasus itu dan membuat siklus aktif tidak terdeteksi
 * — tombol "menstruasi berakhir" jadi tidak pernah muncul.
 *
 * Dipakai bersama oleh Beranda dan Kalender supaya keduanya tidak bisa
 * menilai "siklus aktif" dengan aturan yang berbeda.
 */
export function findActiveCycle(cycles: Cycle[]): Cycle | undefined {
  return cycles.find((cycle) => !cycle.end_date);
}

export function cycleOverlapMessage(error: unknown): string | null {
  if (error instanceof ApiError && error.code === 'CYCLE_OVERLAP') {
    return 'Tanggal ini tumpang tindih dengan siklus yang sudah tercatat. Periksa kembali riwayat siklusmu.';
  }
  return null;
}
