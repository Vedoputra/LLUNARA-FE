import { useQuery } from '@tanstack/react-query';

import { apiClient } from '@/api/client';
import { queryKeys } from '@/api/queryClient';
import type { Envelope, InsightsSummary, MoodInsights, SymptomInsights } from '@/types/api';

export function useInsightsSummary() {
  return useQuery({
    queryKey: queryKeys.insightsSummary,
    queryFn: () =>
      apiClient.get<Envelope<InsightsSummary>>('/api/v1/insights/summary').then((res) => res.data),
  });
}

export function useSymptomInsights(months: number) {
  return useQuery({
    queryKey: queryKeys.insightsSymptoms(months),
    queryFn: () =>
      apiClient
        .get<Envelope<SymptomInsights>>(`/api/v1/insights/symptoms?months=${months}`)
        .then((res) => res.data),
  });
}

export function useMoodInsights(months: number) {
  return useQuery({
    queryKey: queryKeys.insightsMood(months),
    queryFn: () =>
      apiClient
        .get<Envelope<MoodInsights>>(`/api/v1/insights/mood?months=${months}`)
        .then((res) => res.data),
  });
}
