import raw from './dailyContent.json';

export type InsightKind = 'did_you_know' | 'fyi' | 'fun_fact';

export interface DailyInsight {
  id: string;
  kind: InsightKind;
  icon: string;
  body: string;
}

export const INSIGHT_LABELS: Record<InsightKind, string> = {
  did_you_know: 'Did You Know?',
  fyi: 'FYI',
  fun_fact: 'Fun Fact',
};

/**
 * Metro butuh path `require` yang statis, jadi JSON hanya menyimpan kunci ikon
 * dan pemetaan ke aset sebenarnya dilakukan di sini.
 */
export const CONTENT_ICONS: Record<string, number> = {
  menstrual: require('../../assets/phases/menstrual.png'),
  follicular: require('../../assets/phases/follicular.png'),
  ovulation: require('../../assets/phases/ovulation.png'),
  luteal: require('../../assets/phases/luteal.png'),
  'luna-sitting': require('../../assets/mascot/luna-sitting.png'),
  'luna-tea': require('../../assets/mascot/luna-tea.png'),
  'luna-cozy': require('../../assets/mascot/luna-cozy.png'),
  'luna-peeking': require('../../assets/mascot/luna-peeking.png'),
  'luna-waving': require('../../assets/mascot/luna-waving.png'),
  // Pose baru — dinamai sesuai ekspresinya, bukan nomor filenya, supaya
  // pemilihan ikon di file konten bisa dibaca tanpa membuka gambarnya.
  'luna-cocoa': require('../../assets/mascot/luna1.png'),
  'luna-chef': require('../../assets/mascot/luna2.png'),
  'luna-sleeping': require('../../assets/mascot/luna3.png'),
  'luna-cool': require('../../assets/mascot/luna4.png'),
  'luna-autumn': require('../../assets/mascot/luna5.png'),
  'luna-surprise': require('../../assets/mascot/luna6.png'),
  'luna-shy': require('../../assets/mascot/luna7.png'),
  'luna-telescope': require('../../assets/mascot/luna8.png'),
  'luna-heart': require('../../assets/mascot/luna9.png'),
  'luna-star': require('../../assets/mascot/luna10.png'),
  // Tidak ada pose "berpikir" tersendiri; konten pelurus mitos memakai pose
  // teropong yang lebih pas untuk "menyelidiki".
  'luna-thinking': require('../../assets/mascot/luna8.png'),
};

/**
 * Maskot yang dirotasi harian di kartu utama Beranda.
 *
 * `luna-watering` sengaja tidak ada di sini — pose itu dikhususkan untuk Taman
 * Luna supaya kebun punya identitas visualnya sendiri.
 */
export const HERO_MASCOTS: number[] = [
  require('../../assets/mascot/luna-sitting.png'),
  require('../../assets/mascot/luna-cozy.png'),
  require('../../assets/mascot/luna-waving.png'),
  require('../../assets/mascot/luna-peeking.png'),
  require('../../assets/mascot/luna-tea.png'),
  require('../../assets/mascot/luna1.png'),
  require('../../assets/mascot/luna2.png'),
  require('../../assets/mascot/luna3.png'),
  require('../../assets/mascot/luna4.png'),
  require('../../assets/mascot/luna5.png'),
  require('../../assets/mascot/luna6.png'),
  require('../../assets/mascot/luna7.png'),
  require('../../assets/mascot/luna8.png'),
  require('../../assets/mascot/luna9.png'),
  require('../../assets/mascot/luna10.png'),
];

function normalizeKind(value: string): InsightKind {
  return value === 'did_you_know' || value === 'fyi' || value === 'fun_fact' ? value : 'fyi';
}

/**
 * JSON tidak bisa menyempitkan tipe `kind` sendiri, jadi dinormalkan di sini —
 * salah tulis di file konten jatuh ke `fyi`, bukan bikin kartu tanpa warna.
 */
export const DAILY_INSIGHTS: DailyInsight[] = raw.insights.map((item) => ({
  id: item.id,
  kind: normalizeKind(item.kind),
  icon: item.icon,
  body: item.body,
}));

export const DAILY_MOTIVATIONS: string[] = raw.motivations;
