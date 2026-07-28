/**
 * Pemetaan angka mentah dari `GET /api/v1/garden` ke visual kebun.
 *
 * Backend hanya menyediakan hitungan hari tercatat (`total_logged_days`,
 * `new_this_week`); definisi "satu tanaman" sepenuhnya urusan frontend.
 * Seluruh fungsi di sini pure agar mudah dinalar dan diuji.
 *
 * Prinsip positive-only: `total_logged_days` hanya bisa bertambah, jadi tanaman
 * tidak pernah menyusut, layu, atau hilang. Tidak ada target, tidak ada streak.
 */

/** Jumlah catatan harian yang menumbuhkan satu tahap pertumbuhan. */
export const LOGS_PER_STAGE = 3;

/** Tahap per tanaman: 1 tunas, 2 berdaun, 3 mekar. */
export const STAGES_PER_PLANT = 3;

/** Jumlah petak tanaman di kebun. */
export const GARDEN_SLOTS = 7;

/** Total tahap pertumbuhan yang bisa ditampung kebun. */
export const MAX_GROWTH_STAGES = GARDEN_SLOTS * STAGES_PER_PLANT;

/** 0 = petak kosong, 1 = tunas, 2 = berdaun, 3 = mekar. */
export type PlantStage = 0 | 1 | 2 | 3;

export interface GardenStats {
  stages: PlantStage[];
  /** Tanaman yang sudah muncul (tahap > 0). */
  plantCount: number;
  /** Tanaman yang sudah mekar penuh. */
  bloomCount: number;
  /** Seluruh petak sudah mekar. */
  isFull: boolean;
}

/**
 * Tahap pertumbuhan yang sudah terkumpul.
 *
 * Memakai `ceil` supaya catatan pertama langsung memunculkan tunas — umpan
 * balik instan lebih penting daripada pembagian yang persis rata.
 */
export function growthStages(totalLoggedDays: number): number {
  const logs = Math.max(0, Math.floor(totalLoggedDays));
  if (logs === 0) return 0;
  return Math.min(MAX_GROWTH_STAGES, Math.ceil(logs / LOGS_PER_STAGE));
}

/**
 * Tahap dibagi bergilir ke seluruh petak, bukan menuntaskan satu tanaman dulu.
 * Efeknya: petak baru terisi lebih cepat di awal, dan kebun selalu tampak
 * beragam (campuran tunas, daun, dan bunga) alih-alih deretan seragam.
 */
export function plantStages(totalLoggedDays: number): PlantStage[] {
  const stages = growthStages(totalLoggedDays);
  const base = Math.floor(stages / GARDEN_SLOTS);
  const remainder = stages % GARDEN_SLOTS;
  return Array.from({ length: GARDEN_SLOTS }, (_, index) => {
    const stage = base + (index < remainder ? 1 : 0);
    return Math.min(STAGES_PER_PLANT, stage) as PlantStage;
  });
}

export function gardenStats(totalLoggedDays: number): GardenStats {
  const stages = plantStages(totalLoggedDays);
  const plantCount = stages.filter((stage) => stage > 0).length;
  const bloomCount = stages.filter((stage) => stage === STAGES_PER_PLANT).length;
  return { stages, plantCount, bloomCount, isFull: bloomCount === GARDEN_SLOTS };
}

/**
 * Tanaman baru yang muncul dalam 7 hari terakhir — dihitung dengan
 * membandingkan kebun sekarang terhadap kebun sebelum catatan minggu ini.
 */
export function newPlantsThisWeek(totalLoggedDays: number, newThisWeek: number): number {
  const now = gardenStats(totalLoggedDays).plantCount;
  const before = gardenStats(Math.max(0, totalLoggedDays - Math.max(0, newThisWeek))).plantCount;
  return Math.max(0, now - before);
}

export interface GardenHeadline {
  title: string;
  caption: string;
}

export function gardenHeadline(totalLoggedDays: number, newThisWeek: number): GardenHeadline {
  const { stages, plantCount, bloomCount, isFull } = gardenStats(totalLoggedDays);
  const newPlants = newPlantsThisWeek(totalLoggedDays, newThisWeek);

  if (plantCount === 0) {
    return {
      title: 'Tanahmu sudah siap',
      caption: 'Catatan pertamamu akan menumbuhkan tunas di sini.',
    };
  }

  const maxStage = Math.max(...stages);
  const title = isFull
    ? 'Kebunmu mekar penuh'
    : bloomCount > 0
      ? 'Kebunmu sedang mekar'
      : maxStage >= 2
        ? 'Kebunmu makin rimbun'
        : 'Tunasmu mulai tumbuh';

  const caption =
    newPlants > 0
      ? `${newPlants} tanaman baru minggu ini`
      : `${plantCount} tanaman tumbuh dari ${totalLoggedDays} catatanmu`;

  return { title, caption };
}
