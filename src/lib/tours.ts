import type { Tour, TourDeparture } from '@/types';

export const formatINR = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;

/** Departure dates are stored as UTC midnight; format in UTC so they never shift a day. */
export const formatTourDate = (iso: string, opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' }) =>
  new Date(iso).toLocaleDateString('en-IN', { ...opts, timeZone: 'UTC' });

export const durationLabel = (t: Pick<Tour, 'durationDays' | 'durationNights'>) =>
  `${t.durationDays}D / ${t.durationNights}N`;

export const seatsLeftOf = (d: TourDeparture) => d.seatsLeft ?? Math.max(0, d.seatsTotal - d.seatsBooked);

export function seatsLabel(d: TourDeparture) {
  const left = seatsLeftOf(d);
  if (left === 0) return 'Sold out';
  if (left <= 5) return `Only ${left} seat${left === 1 ? '' : 's'} left`;
  return `${left} seats available`;
}

export const discountPercent = (t: Pick<Tour, 'price' | 'originalPrice'>) =>
  t.originalPrice && t.originalPrice > t.price ? Math.round((1 - t.price / t.originalPrice) * 100) : 0;

export const DIFFICULTY_STYLES: Record<Tour['difficulty'], string> = {
  Easy: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
  Moderate: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
  Challenging: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300',
};
