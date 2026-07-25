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
