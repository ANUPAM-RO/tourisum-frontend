'use client';

import { useEffect, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { AlertCircle, ArrowRight, Baby, BadgePercent, BedDouble, Check, CheckCircle2, Clock, Loader2, MessageCircle, Minus, Plus, ShieldCheck, User, X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/context/AuthContext';
import { useAgency } from '@/lib/hooks';
import { cn } from '@/lib/utils';
import { MAX_TRAVELLERS, ROOM_TYPES, discountPercent, formatINR, formatTourDate, fromPrice, quoteRooms, roomsSummary, seatsLabel, seatsLeftOf, suggestRooms } from '@/lib/tours';
import { bookingService } from '@/services/tourService';
import type { Booking, RoomPlan, Tour } from '@/types';

const inputClass =
  'h-11 w-full rounded-[10px] border border-stone-200 bg-stone-50/60 px-3 text-sm text-stone-900 placeholder:text-stone-400 outline-none transition-[border-color,box-shadow,background-color] focus:border-orange-400 focus:bg-white focus:ring-[3px] focus:ring-orange-500/15 dark:border-stone-700 dark:bg-stone-800/60 dark:text-white';
const labelClass = 'mb-1 block text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400';

const stepButton =
  'flex h-9 w-9 items-center justify-center rounded-full bg-stone-100 text-stone-700 transition-all hover:bg-orange-500 hover:text-white hover:shadow-md hover:shadow-orange-500/25 active:scale-95 disabled:pointer-events-none disabled:opacity-35 dark:bg-stone-800 dark:text-stone-200';

function Stepper({ label, hint, icon: Icon, value, min, max, onChange }: { label: string; hint: React.ReactNode; icon: LucideIcon; value: number; min: number; max: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-orange-500 dark:bg-orange-950/40">
          <Icon className="h-4 w-4" />
        </span>
        <div>
          <p className="text-sm font-semibold text-stone-900 dark:text-white">{label}</p>
          <p className="text-xs text-stone-500 dark:text-stone-400">{hint}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button type="button" aria-label={`Fewer ${label.toLowerCase()}`} disabled={value <= min} onClick={() => onChange(value - 1)} className={stepButton}>
          <Minus className="h-3.5 w-3.5" />
        </button>
        <span className="w-6 text-center text-base font-bold tabular-nums text-stone-900 dark:text-white">{value}</span>
        <button type="button" aria-label={`More ${label.toLowerCase()}`} disabled={value >= max} onClick={() => onChange(value + 1)} className={stepButton}>
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

export default function BookingPanel({ tour }: { tour: Tour }) {
  const { user } = useAuth();
  const agency = useAgency();
  const queryClient = useQueryClient();
  const departures = tour.departures;
  const firstOpen = departures.find((d) => seatsLeftOf(d) > 0);

  const [departureId, setDepartureId] = useState(firstOpen?._id ?? '');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState<RoomPlan>(() => suggestRooms(2));
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [booking, setBooking] = useState<Booking | null>(null);

  const departure = departures.find((d) => d._id === departureId);
  const seatsLeft = departure ? seatsLeftOf(departure) : 0;
  const travellers = adults + children;
  const maxTravellers = Math.min(MAX_TRAVELLERS, seatsLeft);
  // 3- and 4-person rooms are only offered when the tour has a price for them.
  const hasQuad = !!tour.priceQuad;
  const quote = quoteRooms(tour, travellers, rooms);
  const total = quote.total;

  // A new group size starts from the default plan (all 2-person rooms).
  useEffect(() => {
    setRooms(suggestRooms(travellers));
  }, [travellers]);

  // Keep the traveller count within the seats left on the chosen date.
  useEffect(() => {
    if (!departure) return;
    if (adults > seatsLeft) setAdults(Math.max(1, seatsLeft));
    if (adults + children > seatsLeft) setChildren(Math.max(0, seatsLeft - Math.min(adults, seatsLeft)));
  }, [departureId]);

  useEffect(() => {
    if (!open) return;
    setForm((f) => ({ ...f, name: f.name || user?.name || '', email: f.email || user?.email || '', phone: f.phone || user?.phone || '' }));
  }, [open, user]);

  const validate = () => {
    const next: Record<string, string> = {};
    if (form.name.trim().length < 2) next.name = 'Enter your name';
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) next.email = 'Enter a valid email';
    if (!/^[+\d][\d\s-]{7,15}$/.test(form.phone.trim())) next.phone = 'Enter a valid phone number';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!departure || !validate()) return;
    setSubmitting(true);
    try {
      const res = await bookingService.create({
        tourId: tour._id,
        departureId: departure._id,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        adults,
        children,
        message: form.message.trim(),
        rooms,
      });
      setBooking(res.data);
      queryClient.invalidateQueries({ queryKey: ['tour', tour.slug] });
      queryClient.invalidateQueries({ queryKey: ['tours'] });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Could not complete the booking. Please try again.');
      queryClient.invalidateQueries({ queryKey: ['tour', tour.slug] });
    } finally {
      setSubmitting(false);
    }
  };

  const closeDialog = (next: boolean) => {
    setOpen(next);
    if (!next && booking) {
      setBooking(null);
      setForm((f) => ({ ...f, message: '' }));
    }
  };

  const whatsappText = useMemo(
    () =>
      booking
        ? `Hi ${agency.name}, I just booked "${booking.tourTitle}" for ${formatTourDate(booking.departureDate)} (ref ${booking.reference}, ${booking.adults + booking.children} travellers).`
        : '',
    [booking, agency.name]
  );

  if (!departures.length) {
    return (
      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-stone-200/70 dark:bg-stone-900 dark:ring-stone-800">
        <p className="text-sm text-stone-500 dark:text-stone-400">From, per person</p>
        <p className="text-3xl font-bold text-stone-900 dark:text-white">{formatINR(fromPrice(tour))}</p>
        <p className="mt-4 text-sm text-stone-600 dark:text-stone-300">New departure dates are coming soon.</p>
        <a href={agency.whatsAppLink(`Hi ${agency.name}, I'm interested in the "${tour.title}" tour. When is the next departure?`)} target="_blank" rel="noopener noreferrer" className="mt-5 flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 font-semibold text-white hover:bg-emerald-700">
          <MessageCircle className="h-4 w-4" />
          Ask about dates
        </a>
      </div>
    );
  }

  // The original (strike-through) price is for 2 in a room, so savings only count those travellers.
  const discount = discountPercent(tour);
  const savings = discount > 0 ? (tour.originalPrice! - tour.price) * quote.inDoubles : 0;
  const unitFor = (key: keyof RoomPlan) => (key === 'double' ? tour.price : tour.priceQuad || 0);
  const roomCount = rooms.double + rooms.triple + rooms.quad;
  const breakdown = ROOM_TYPES.filter((t) => rooms[t.key] > 0).map((t) => {
    const people = t.key === 'double' ? quote.inDoubles : rooms[t.key] * t.size;
    return { ...t, count: rooms[t.key], people, unit: unitFor(t.key), amount: people * unitFor(t.key) };
  });

  return (
    <div id="book" className="scroll-mt-28 overflow-hidden rounded-[28px] bg-white shadow-xl shadow-stone-200/70 ring-1 ring-stone-200/70 dark:bg-stone-900 dark:shadow-none dark:ring-stone-800">
      {/* Price header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-rose-50/70 to-amber-50 px-6 pb-5 pt-6 dark:from-orange-950/30 dark:via-rose-950/20 dark:to-stone-900">
        <div className="pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full bg-gradient-to-br from-orange-300/40 to-rose-300/30 blur-2xl dark:from-orange-700/20 dark:to-rose-700/10" />
        <div className="relative flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-orange-700/80 dark:text-orange-300/80">Per person · 2 in a room</p>
            <p className="mt-1.5 flex items-baseline gap-2">
              <span className="text-[2rem] font-bold leading-none tracking-tight text-stone-900 dark:text-white">{formatINR(tour.price)}</span>
              {discount > 0 && <span className="text-sm text-stone-400 line-through">{formatINR(tour.originalPrice!)}</span>}
            </p>
            {hasQuad && (
              <p className="mt-1.5 text-xs text-stone-600 dark:text-stone-300">
                or <span className="font-semibold text-stone-900 dark:text-white">{formatINR(tour.priceQuad!)}</span> with 3–4 in a room
              </p>
            )}
          </div>
          {discount > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-2.5 py-1 text-xs font-bold text-white shadow-md shadow-orange-500/25">
              <BadgePercent className="h-3.5 w-3.5" />
              {discount}% off
            </span>
          )}
        </div>
      </div>

      <div className="p-6 pt-5">
        <p className={labelClass}>Choose a departure</p>
        <div className="mt-2 space-y-2.5" role="radiogroup" aria-label="Departure dates">
          {departures.map((d) => {
            const left = seatsLeftOf(d);
            const selected = d._id === departureId;
            const filled = d.seatsTotal ? Math.min(100, Math.round(((d.seatsTotal - left) / d.seatsTotal) * 100)) : 0;
            const tone = left === 0 ? 'text-stone-400' : left <= 5 ? 'text-rose-600' : 'text-emerald-600';
            const bar = left === 0 ? 'bg-stone-400' : left <= 5 ? 'bg-rose-500' : 'bg-emerald-500';
            return (
              <button
                key={d._id}
                type="button"
                role="radio"
                aria-checked={selected}
                disabled={left === 0}
                onClick={() => setDepartureId(d._id)}
                className={cn(
                  'group flex w-full items-center gap-3.5 rounded-2xl border p-2.5 pr-4 text-left transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50',
                  selected
                    ? 'border-transparent bg-gradient-to-r from-orange-50 to-rose-50 shadow-md shadow-orange-500/10 ring-2 ring-orange-400 dark:from-orange-950/40 dark:to-rose-950/30'
                    : 'border-stone-200 bg-white hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md hover:shadow-stone-200/60 dark:border-stone-700 dark:bg-stone-900 dark:hover:shadow-none'
                )}
              >
                {/* Calendar leaf */}
                <span
                  className={cn(
                    'flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl transition-colors',
                    selected ? 'bg-gradient-to-br from-orange-500 to-rose-500 text-white shadow-md shadow-orange-500/30' : 'bg-stone-100 text-stone-800 group-hover:bg-orange-100 dark:bg-stone-800 dark:text-stone-100'
                  )}
                >
                  <span className={cn('text-[10px] font-semibold uppercase tracking-wider', selected ? 'text-white/85' : 'text-orange-600 dark:text-orange-400')}>
                    {formatTourDate(d.startDate, { month: 'short' })}
                  </span>
                  <span className="text-lg font-bold leading-none">{formatTourDate(d.startDate, { day: 'numeric' })}</span>
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-stone-900 dark:text-white">
                    {formatTourDate(d.startDate, { weekday: 'long' })}
                    <span className="font-normal text-stone-400"> · {formatTourDate(d.startDate, { year: 'numeric' })}</span>
                  </span>
                  <span className="mt-1.5 flex items-center gap-2">
                    <span className="h-1.5 w-16 shrink-0 overflow-hidden rounded-full bg-stone-200/80 dark:bg-stone-700">
                      <span className={cn('block h-full rounded-full', bar)} style={{ width: `${Math.max(filled, 4)}%` }} />
                    </span>
                    <span className={cn('truncate text-[11px] font-semibold', tone)}>{seatsLabel(d)}</span>
                  </span>
                </span>

                <span
                  className={cn(
                    'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                    selected ? 'border-orange-500 bg-orange-500 text-white' : 'border-stone-300 dark:border-stone-600'
                  )}
                >
                  {selected && <Check className="h-3 w-3" strokeWidth={3} />}
                </span>
              </button>
            );
          })}
        </div>

        <p className={cn(labelClass, 'mt-6')}>Travellers</p>
        <div className="mt-2 divide-y divide-stone-100 rounded-2xl border border-stone-200 px-4 dark:divide-stone-800 dark:border-stone-700">
          <Stepper label="Adults" hint="12+ years" icon={User} value={adults} min={1} max={Math.max(1, maxTravellers - children)} onChange={setAdults} />
          <Stepper label="Children" hint="Under 12" icon={Baby} value={children} min={0} max={Math.max(0, maxTravellers - adults)} onChange={setChildren} />
        </div>

        <div className="mt-6 flex items-center justify-between">
          <p className={labelClass}>Rooms</p>
          {hasQuad && (
            <button type="button" onClick={() => setRooms(suggestRooms(travellers))} className="text-xs font-semibold text-orange-600 hover:text-orange-700 dark:text-orange-400">
              Reset
            </button>
          )}
        </div>
        {hasQuad ? (
          <div className="mt-2 divide-y divide-stone-100 rounded-2xl border border-stone-200 px-4 dark:divide-stone-800 dark:border-stone-700">
            {ROOM_TYPES.map((t) => (
              <Stepper
                key={t.key}
                label={t.label}
                hint={`${formatINR(unitFor(t.key))} per person`}
                icon={BedDouble}
                value={rooms[t.key]}
                min={0}
                max={t.key === 'double' ? Math.ceil(travellers / 2) : Math.floor(travellers / t.size)}
                onChange={(v) => setRooms((r) => ({ ...r, [t.key]: v }))}
              />
            ))}
          </div>
        ) : (
          <div className="mt-2 flex items-center gap-3 rounded-2xl border border-stone-200 px-4 py-3 dark:border-stone-700">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-orange-500 dark:bg-orange-950/40">
              <BedDouble className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-semibold text-stone-900 dark:text-white">
                {rooms.double} room{rooms.double === 1 ? '' : 's'} · 2 in a room
              </p>
              <p className="text-xs text-stone-500 dark:text-stone-400">{formatINR(tour.price)} per person</p>
            </div>
          </div>
        )}
        <p className={cn('mt-2 flex items-center gap-1.5 text-xs font-medium', quote.error ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400')}>
          {quote.error ? <AlertCircle className="h-3.5 w-3.5 shrink-0" /> : <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />}
          {quote.error ?? (travellers === 1 ? 'Room set for 1 traveller' : `All ${travellers} travellers have a bed`)}
        </p>

        <div className="mt-5 rounded-2xl border border-dashed border-stone-200 p-4 dark:border-stone-700">
          <p className={labelClass}>Price breakdown</p>
          <ul className="mt-2 space-y-2.5">
            {breakdown.map((line) => (
              <li key={line.key} className="flex items-start justify-between gap-3 text-sm">
                <span>
                  <span className="font-medium text-stone-800 dark:text-stone-100">
                    {line.label} <span className="font-normal text-stone-400">× {line.count} room{line.count === 1 ? '' : 's'}</span>
                  </span>
                  <span className="block text-xs text-stone-500 dark:text-stone-400">
                    {line.people} traveller{line.people === 1 ? '' : 's'} × {formatINR(line.unit)}
                  </span>
                </span>
                <span className="tabular-nums text-stone-700 dark:text-stone-200">{formatINR(line.amount)}</span>
              </li>
            ))}
          </ul>
          {savings > 0 && (
            <div className="mt-1.5 flex items-center justify-between text-sm font-medium text-emerald-600 dark:text-emerald-400">
              <span>You save</span>
              <span className="tabular-nums">{formatINR(savings)}</span>
            </div>
          )}
          <div className="mt-3 flex items-end justify-between border-t border-stone-100 pt-3 dark:border-stone-800">
            <span className="text-sm font-semibold text-stone-900 dark:text-white">
              Total
              <span className="block text-xs font-normal text-stone-500 dark:text-stone-400">
                {travellers} traveller{travellers === 1 ? '' : 's'} · {roomCount} room{roomCount === 1 ? '' : 's'}
              </span>
            </span>
            <span className={cn('bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-2xl font-bold tabular-nums tracking-tight text-transparent', quote.error && 'opacity-40')}>{formatINR(total)}</span>
          </div>
        </div>

        <button
          type="button"
          disabled={!departure || seatsLeft === 0 || !!quote.error}
          onClick={() => setOpen(true)}
          className="group mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-rose-500 py-3.5 text-base font-semibold text-white shadow-lg shadow-orange-500/30 transition-all hover:shadow-xl hover:shadow-orange-500/40 hover:brightness-105 active:scale-[0.99] disabled:opacity-50"
        >
          Book now
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>

        <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] font-medium text-stone-600 dark:text-stone-300">
          <span className="flex items-center gap-1.5 rounded-xl bg-emerald-50 px-2.5 py-2 dark:bg-emerald-950/30">
            <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-500" />
            No payment now
          </span>
          <span className="flex items-center gap-1.5 rounded-xl bg-sky-50 px-2.5 py-2 dark:bg-sky-950/30">
            <Clock className="h-4 w-4 shrink-0 text-sky-500" />
            Confirmed within 24h
          </span>
        </div>
      </div>

      <Dialog open={open} onOpenChange={closeDialog}>
        <DialogContent showCloseButton={false} className="w-[calc(100%-1.5rem)] max-w-lg gap-0 rounded-[22px] bg-white p-0 dark:bg-stone-900">
          <DialogClose className="absolute right-4 top-4 rounded-full p-1.5 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-700 dark:hover:bg-stone-800" aria-label="Close">
            <X className="h-5 w-5" />
          </DialogClose>

          {booking ? (
            <div className="p-7 text-center">
              <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-500" />
              <DialogTitle className="mt-4 font-display text-2xl font-semibold text-stone-900 dark:text-white">Booking received!</DialogTitle>
              <DialogDescription className="mt-2 text-sm text-stone-600 dark:text-stone-400">
                We&apos;ve reserved your seats. {agency.name} will call or email you within 24 hours to confirm and share payment details.
              </DialogDescription>
              <div className="mt-6 rounded-2xl bg-stone-50 p-5 text-left text-sm dark:bg-stone-800/60">
                <div className="flex justify-between"><span className="text-stone-500">Reference</span><span className="font-mono font-semibold text-stone-900 dark:text-white">{booking.reference}</span></div>
                <div className="mt-2 flex justify-between gap-4"><span className="text-stone-500">Tour</span><span className="text-right font-medium text-stone-900 dark:text-white">{booking.tourTitle}</span></div>
                <div className="mt-2 flex justify-between"><span className="text-stone-500">Departure</span><span className="font-medium text-stone-900 dark:text-white">{formatTourDate(booking.departureDate)}</span></div>
                <div className="mt-2 flex justify-between"><span className="text-stone-500">Travellers</span><span className="font-medium text-stone-900 dark:text-white">{booking.adults} adult{booking.adults > 1 ? 's' : ''}{booking.children ? `, ${booking.children} child${booking.children > 1 ? 'ren' : ''}` : ''}</span></div>
                {booking.rooms && <div className="mt-2 flex justify-between gap-4"><span className="text-stone-500">Rooms</span><span className="text-right font-medium text-stone-900 dark:text-white">{roomsSummary(booking.rooms)} people</span></div>}
                <div className="mt-3 flex justify-between border-t border-stone-200 pt-3 dark:border-stone-700"><span className="font-medium text-stone-700 dark:text-stone-300">Total</span><span className="font-bold text-stone-900 dark:text-white">{formatINR(booking.totalPrice)}</span></div>
              </div>
              <a href={agency.whatsAppLink(whatsappText)} target="_blank" rel="noopener noreferrer" className="mt-5 flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 font-semibold text-white hover:bg-emerald-700">
                <MessageCircle className="h-4 w-4" />
                Send details on WhatsApp
              </a>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="p-7">
              <DialogTitle className="pr-8 font-display text-2xl font-semibold text-stone-900 dark:text-white">Your details</DialogTitle>
              <DialogDescription className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                {tour.title} · {departure && formatTourDate(departure.startDate)} · {travellers} traveller{travellers > 1 ? 's' : ''} · {roomsSummary(rooms)} people · {formatINR(total)}
              </DialogDescription>

              <div className="mt-6 space-y-4">
                <div>
                  <label htmlFor="bk-name" className={labelClass}>Full name</label>
                  <input id="bk-name" autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={cn(inputClass, errors.name && 'border-rose-400')} />
                  {errors.name && <p className="mt-1 text-xs text-rose-600">{errors.name}</p>}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="bk-email" className={labelClass}>Email</label>
                    <input id="bk-email" type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={cn(inputClass, errors.email && 'border-rose-400')} />
                    {errors.email && <p className="mt-1 text-xs text-rose-600">{errors.email}</p>}
                  </div>
                  <div>
                    <label htmlFor="bk-phone" className={labelClass}>Phone</label>
                    <input id="bk-phone" type="tel" inputMode="tel" autoComplete="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={cn(inputClass, errors.phone && 'border-rose-400')} />
                    {errors.phone && <p className="mt-1 text-xs text-rose-600">{errors.phone}</p>}
                  </div>
                </div>
                <div>
                  <label htmlFor="bk-msg" className={labelClass}>Anything we should know? (optional)</label>
                  <textarea id="bk-msg" rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Room preferences, food requirements, pickup point…" className={cn(inputClass, 'h-auto py-2.5')} />
                </div>
              </div>

              <button type="submit" disabled={submitting} className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 font-semibold text-white shadow-lg shadow-orange-500/25 transition-[filter] hover:brightness-110 disabled:opacity-60">
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                Confirm booking · {formatINR(total)}
              </button>
              <p className="mt-3 text-center text-xs text-stone-500 dark:text-stone-400">No payment is taken now. Your details are shared only with {agency.name}.</p>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
