import { create } from 'zustand';

export interface CelebrationContent {
  title: string;
  message: string;
}

interface CelebrationState {
  current: CelebrationContent | null;
  celebrate: (content: CelebrationContent) => void;
  dismiss: () => void;
}

/**
 * Antrian satu-slot untuk momen perayaan.
 *
 * Disimpan di store, bukan state layar, karena pemicunya bisa datang dari
 * beberapa layar (Beranda maupun Kalender sama-sama bisa menandai akhir
 * menstruasi) sementara overlay-nya hanya dirender sekali di root layout.
 * Sengaja tidak dipersist: perayaan itu momen sesaat, bukan status.
 */
export const useCelebrationStore = create<CelebrationState>((set) => ({
  current: null,
  celebrate: (content) => set({ current: content }),
  dismiss: () => set({ current: null }),
}));
