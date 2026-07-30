import type { CyclePrediction } from '@/types/api';

export type FertilityLevel = 'peak' | 'high' | 'low' | 'unknown';

export interface FertilityInsight {
  level: FertilityLevel;
  label: string;
}

/**
 * Estimasi peluang hamil berdasarkan posisi hari ini terhadap jendela subur
 * yang sudah dihitung backend (`fertile_window`, `estimated_ovulation`).
 *
 * Landasannya reproduksi dasar, bukan tebakan baru:
 * - Sel telur hanya hidup ~12–24 jam setelah ovulasi.
 * - Sperma bisa bertahan hingga ~5 hari di saluran reproduksi.
 * - Karena itu jendela subur mencakup beberapa hari sebelum ovulasi sampai
 *   hari ovulasi itu sendiri — bukan cuma satu hari.
 *
 * Ini estimasi peluang, bukan diagnosis atau alat kontrasepsi. Kalau data
 * belum cukup untuk menghitung jendela subur, `level` jadi 'unknown' —
 * jangan menebak "rendah" begitu saja.
 */
export function fertilityInsight(
  prediction: Pick<CyclePrediction, 'fertile_window' | 'estimated_ovulation'> | null | undefined,
  today: string,
): FertilityInsight {
  if (!prediction?.fertile_window) {
    return { level: 'unknown', label: 'Belum bisa diperkirakan' };
  }

  const { fertile_window, estimated_ovulation } = prediction;

  if (estimated_ovulation && today === estimated_ovulation) {
    return { level: 'peak', label: 'Peluang hamil tertinggi' };
  }

  if (today >= fertile_window.start && today <= fertile_window.end) {
    return { level: 'high', label: 'Peluang hamil tinggi' };
  }

  return { level: 'low', label: 'Peluang hamil rendah' };
}
