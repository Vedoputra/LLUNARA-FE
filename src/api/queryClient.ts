import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

export const queryKeys = {
  cycles: ['cycles'] as const,
  cyclePrediction: ['cycles', 'prediction'] as const,
  dailyLogs: (from: string, to: string) => ['daily-logs', from, to] as const,
  insightsSummary: ['insights', 'summary'] as const,
  insightsSymptoms: (months: number) => ['insights', 'symptoms', months] as const,
  insightsMood: (months: number) => ['insights', 'mood', months] as const,
  symptoms: ['symptoms'] as const,
  wellness: (from: string, to: string) => ['wellness', from, to] as const,
  reminders: ['reminders'] as const,
  garden: ['garden'] as const,
};

/**
 * Invalidation helpers for after a write operation. Grouped by the resource that
 * was written to, since one write often affects derived data (e.g. a new daily
 * log shifts the cycle prediction and the garden's logged-day count).
 */
export const invalidate = {
  cycles: () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.cycles }),
      queryClient.invalidateQueries({ queryKey: queryKeys.cyclePrediction }),
      queryClient.invalidateQueries({ queryKey: queryKeys.insightsSummary }),
    ]),
  dailyLogs: () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: ['daily-logs'] }),
      queryClient.invalidateQueries({ queryKey: ['insights'] }),
      queryClient.invalidateQueries({ queryKey: queryKeys.garden }),
      queryClient.invalidateQueries({ queryKey: queryKeys.cyclePrediction }),
    ]),
  symptoms: () => queryClient.invalidateQueries({ queryKey: queryKeys.symptoms }),
  wellness: () => queryClient.invalidateQueries({ queryKey: ['wellness'] }),
  reminders: () => queryClient.invalidateQueries({ queryKey: queryKeys.reminders }),
};
