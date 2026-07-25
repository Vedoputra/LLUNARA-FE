import { useQuery } from '@tanstack/react-query';

import { apiClient } from '@/api/client';
import { queryKeys } from '@/api/queryClient';
import type { Envelope, GardenSummary } from '@/types/api';

export function useGarden() {
  return useQuery({
    queryKey: queryKeys.garden,
    queryFn: () => apiClient.get<Envelope<GardenSummary>>('/api/v1/garden').then((res) => res.data),
  });
}
