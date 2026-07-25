const DAY_NAMES = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const MONTH_NAMES = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

function parseISODate(isoDate: string): Date {
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function todayISO(): string {
  return toISODate(new Date());
}

export function addDaysISO(isoDate: string, days: number): string {
  const date = parseISODate(isoDate);
  date.setDate(date.getDate() + days);
  return toISODate(date);
}

export function formatLongDate(isoDate: string): string {
  const date = parseISODate(isoDate);
  return `${DAY_NAMES[date.getDay()]}, ${date.getDate()} ${MONTH_NAMES[date.getMonth()]}`;
}

export function formatMonthYear(isoDate: string): string {
  const date = parseISODate(isoDate);
  return `${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;
}

/** Whole-day difference (b - a), ignoring time-of-day. */
export function diffInDays(isoDateA: string, isoDateB: string): number {
  const a = parseISODate(isoDateA);
  const b = parseISODate(isoDateB);
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round((b.getTime() - a.getTime()) / msPerDay);
}

export function isSameOrBefore(isoDateA: string, isoDateB: string): boolean {
  return isoDateA <= isoDateB;
}
