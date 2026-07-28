/**
 * Pemilihan konten yang berganti sekali sehari.
 *
 * Sengaja deterministik, bukan `Math.random()`: konten harus tetap sama
 * sepanjang hari itu walau komponennya re-render berkali-kali, lalu berganti
 * tepat saat tanggal berubah.
 */

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Jumlah hari sejak epoch untuk sebuah tanggal ISO (`YYYY-MM-DD`).
 *
 * Dihitung lewat `Date.UTC` dari komponen tanggalnya, bukan `new Date(iso)`,
 * supaya hasilnya bilangan bulat yang tidak terpengaruh zona waktu maupun
 * pergeseran DST.
 */
export function dayNumber(isoDate: string): number {
  const [year, month, day] = isoDate.split('-').map(Number);
  return Math.floor(Date.UTC(year, month - 1, day) / MS_PER_DAY);
}

/**
 * Ambil satu item berdasarkan tanggal. `offset` dipakai agar dua daftar yang
 * dirotasi pada hari yang sama tidak selalu bergerak seirama.
 */
export function pickForDay<T>(items: readonly T[], isoDate: string, offset = 0): T | undefined {
  if (items.length === 0) return undefined;
  const index = (((dayNumber(isoDate) + offset) % items.length) + items.length) % items.length;
  return items[index];
}
