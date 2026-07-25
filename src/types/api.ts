export type ApiErrorCode =
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'CYCLE_OVERLAP'
  | 'INSUFFICIENT_DATA'
  | 'INTERNAL_ERROR'
  | 'NETWORK_ERROR'
  | 'TIMEOUT';

export class ApiError extends Error {
  code: ApiErrorCode;
  status: number;
  details?: Record<string, string>;

  constructor(
    code: ApiErrorCode,
    message: string,
    status: number,
    details?: Record<string, string>,
  ) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export interface ApiErrorBody {
  error: {
    code: ApiErrorCode;
    message: string;
    details?: Record<string, string>;
  };
}

export interface HealthResponse {
  status: 'ok' | 'degraded';
  version: string;
  timestamp: string;
}

export type FlowIntensity = 'light' | 'medium' | 'heavy';
export type SymptomCategory = 'physical' | 'emotional' | 'other';
export type CyclePhase = 'menstrual' | 'follicular' | 'ovulation' | 'luteal';
export type PredictionConfidence = 'low' | 'medium' | 'high';
export type Regularity = 'regular' | 'moderate' | 'irregular';
export type ReminderType = 'period_upcoming' | 'fertile_window' | 'medication' | 'checkup';

export interface Cycle {
  id: string;
  start_date: string;
  end_date: string | null;
  cycle_length: number | null;
  period_length: number | null;
  is_outlier: boolean;
  created_at: string;
}

export interface CyclePrediction {
  next_period_start: string | null;
  next_period_end: string | null;
  estimated_ovulation: string | null;
  fertile_window: { start: string; end: string } | null;
  current_phase: CyclePhase | null;
  day_of_cycle: number | null;
  confidence: PredictionConfidence;
  based_on_cycles: number;
  average_cycle_length: number | null;
}

export interface DailyLog {
  id: string;
  date: string;
  cycle_id: string | null;
  flow_intensity: FlowIntensity | null;
  mood: string | null;
  notes: string | null;
  symptom_ids: string[];
  created_at: string;
  updated_at: string;
}

export interface Symptom {
  id: string;
  name: string;
  category: SymptomCategory;
  is_custom: boolean;
}

export interface InsightsSummary {
  has_sufficient_data: boolean;
  message?: string;
  total_cycles: number;
  average_cycle_length?: number;
  shortest_cycle?: number;
  longest_cycle?: number;
  average_period_length?: number;
  regularity?: Regularity;
  cycle_length_trend?: { start_date: string; cycle_length: number }[];
}

export interface SymptomInsight {
  symptom_id: string;
  name: string;
  count: number;
  phase_distribution: Partial<Record<CyclePhase, number>>;
  most_common_cycle_day: number;
  sample_size: number;
}

export interface SymptomInsights {
  symptoms: SymptomInsight[];
  months: number;
  sample_size: number;
}

export interface MoodInsightPhase {
  phase: CyclePhase;
  mood_counts: Record<string, number>;
  mood_percentage: Record<string, number>;
  dominant_mood: string | null;
  sample_size: number;
}

export interface MoodInsights {
  by_phase: MoodInsightPhase[];
  months: number;
}

export interface WellnessLog {
  id: string;
  date: string;
  water_glasses: number | null;
  sleep_hours: number | null;
  weight_kg: number | null;
  created_at: string;
  updated_at: string;
}

export interface Reminder {
  id: string;
  type: ReminderType;
  is_enabled: boolean;
  time_of_day: string | null;
  days_before: number | null;
  custom_message: string | null;
  created_at: string;
  updated_at: string;
}

export interface GardenSummary {
  total_logged_days: number;
  logged_days_this_month: number;
  new_this_week: number;
  collected_moods: string[];
  uncollected_moods: string[];
  message: string;
}
