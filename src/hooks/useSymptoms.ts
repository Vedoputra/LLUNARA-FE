import { useMutation, useQuery } from '@tanstack/react-query';

import { apiClient } from '@/api/client';
import { invalidate, queryKeys } from '@/api/queryClient';
import type { Envelope, Symptom, SymptomCategory } from '@/types/api';

export function useSymptoms() {
  return useQuery({
    queryKey: queryKeys.symptoms,
    queryFn: () => apiClient.get<Envelope<Symptom[]>>('/api/v1/symptoms').then((res) => res.data),
  });
}

export function useCreateSymptom() {
  return useMutation({
    mutationFn: (input: { name: string; category: SymptomCategory }) =>
      apiClient.post<Envelope<Symptom>>('/api/v1/symptoms', input).then((res) => res.data),
    onSuccess: () => invalidate.symptoms(),
  });
}

export function useDeleteSymptom() {
  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/api/v1/symptoms/${id}`),
    onSuccess: () => invalidate.symptoms(),
  });
}
