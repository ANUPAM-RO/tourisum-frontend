import type { RoomPlan, Tour, TourDeparture } from '@/types';

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

/** Lowest per-person price across room types, for "From" labels. */
export const fromPrice = (t: Pick<Tour, 'price' | 'priceQuad'>) => (t.priceQuad ? Math.min(t.price, t.priceQuad) : t.price);

// Room allocation and pricing. Mirrors backend/src/utils/roomPricing.ts — keep them in sync.

export const MAX_TRAVELLERS = 50;

export const ROOM_TYPES = [
  { key: 'double', size: 2, label: '2 in a room' },
  { key: 'triple', size: 3, label: '3 in a room' },
  { key: 'quad', size: 4, label: '4 in a room' },
] as const;

/** Default plan: everyone in 2-person rooms (one room may hold a single traveller). */
export const suggestRooms = (travellers: number): RoomPlan => ({ double: Math.ceil(travellers / 2), triple: 0, quad: 0 });

/**
 * Prices a room plan. 3- and 4-person rooms must be full; 2-person rooms may have one
 * room with a single traveller. `error` explains why a plan doesn't fit the group.
 */
export function quoteRooms(tour: Pick<Tour, 'price' | 'priceQuad'>, travellers: number, rooms: RoomPlan) {
  const inShared = rooms.triple * 3 + rooms.quad * 4;
  const inDoubles = travellers - inShared;
  const total = Math.max(0, inDoubles) * tour.price + inShared * (tour.priceQuad || 0);

  let error: string | null = null;
  if (!tour.priceQuad && inShared > 0) error = 'This tour only offers 2 in a room.';
  else if (inDoubles < 0) error = `Those rooms sleep ${inShared}, but you have ${travellers} traveller${travellers === 1 ? '' : 's'}.`;
  else if (rooms.double * 2 < inDoubles) {
    const missing = inDoubles - rooms.double * 2;
    error = `Add a room for ${missing} more traveller${missing === 1 ? '' : 's'}.`;
  } else if (rooms.double * 2 - inDoubles > 1) error = 'Too many rooms — remove a 2-person room.';

  return { inDoubles: Math.max(0, inDoubles), inShared, total, error };
}

/** "2 rooms × 2, 1 room × 3" */
export const roomsSummary = (rooms: RoomPlan) =>
  ROOM_TYPES.filter((t) => rooms[t.key] > 0)
    .map((t) => `${rooms[t.key]} room${rooms[t.key] === 1 ? '' : 's'} × ${t.size}`)
    .join(', ');
