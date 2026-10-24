'use client';

import { useEffect, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { CalendarDays, CheckCircle2, Loader2, MessageCircle, Minus, Plus, ShieldCheck, X } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/context/AuthContext';
import { useAgency } from '@/lib/hooks';
import { cn } from '@/lib/utils';
import { formatINR, formatTourDate, seatsLabel, seatsLeftOf } from '@/lib/tours';
import { bookingService } from '@/services/tourService';
import type { Booking, Tour } from '@/types';

const inputClass =
  'h-11 w-full rounded-[10px] border border-stone-200 bg-stone-50/60 px-3 text-sm text-stone-900 placeholder:text-stone-400 outline-none transition-[border-color,box-shadow,background-color] focus:border-orange-400 focus:bg-white focus:ring-[3px] focus:ring-orange-500/15 dark:border-stone-700 dark:bg-stone-800/60 dark:text-white';
const labelClass = 'mb-1 block text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400';

function Stepper({ label, hint, value, min, max, onChange }: { label: string; hint: string; value: number; min: number; max: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className="text-sm font-medium text-stone-900 dark:text-white">{label}</p>
        <p className="text-xs text-stone-500 dark:text-stone-400">{hint}</p>
      </div>
      <div className="flex items-center gap-3">
        <button type="button" aria-label={`Fewer ${label.toLowerCase()}`} disabled={value <= min} onClick={() => onChange(value - 1)} className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-200 text-stone-700 transition-colors hover:border-orange-400 hover:text-orange-600 disabled:opacity-40 dark:border-stone-700 dark:text-stone-200">
          <Minus className="h-3.5 w-3.5" />
        </button>
        <span className="w-5 text-center font-semibold tabular-nums text-stone-900 dark:text-white">{value}</span>
        <button type="button" aria-label={`More ${label.toLowerCase()}`} disabled={value >= max} onClick={() => onChange(value + 1)} className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-200 text-stone-700 transition-colors hover:border-orange-400 hover:text-orange-600 disabled:opacity-40 dark:border-stone-700 dark:text-stone-200">
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
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [booking, setBooking] = useState<Booking | null>(null);

  const departure = departures.find((d) => d._id === departureId);
  const seatsLeft = departure ? seatsLeftOf(departure) : 0;
  const travellers = adults + children;
  const total = tour.price * travellers;

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
        <p className="text-3xl font-bold text-stone-900 dark:text-white">{formatINR(tour.price)}</p>
        <p className="mt-4 text-sm text-stone-600 dark:text-stone-300">New departure dates are coming soon.</p>
        <a href={agency.whatsAppLink(`Hi ${agency.name}, I'm interested in the "${tour.title}" tour. When is the next departure?`)} target="_blank" rel="noopener noreferrer" className="mt-5 flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 font-semibold text-white hover:bg-emerald-700">
          <MessageCircle className="h-4 w-4" />
          Ask about dates
        </a>
      </div>
    );
  }

  return (
    <div id="book" className="scroll-mt-28 rounded-3xl bg-white p-6 shadow-lg shadow-stone-200/60 ring-1 ring-stone-200/70 dark:bg-stone-900 dark:shadow-none dark:ring-stone-800">
      <p className="text-sm text-stone-500 dark:text-stone-400">From, per person</p>
      <p className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-stone-900 dark:text-white">{formatINR(tour.price)}</span>
        {tour.originalPrice && tour.originalPrice > tour.price && (
          <span className="text-stone-400 line-through">{formatINR(tour.originalPrice)}</span>
        )}
      </p>

      <p className={cn(labelClass, 'mt-6')}>Choose a departure</p>
      <div className="space-y-2" role="radiogroup" aria-label="Departure dates">
        {departures.map((d) => {
          const left = seatsLeftOf(d);
          const selected = d._id === departureId;
          return (
            <button
              key={d._id}
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={left === 0}
              onClick={() => setDepartureId(d._id)}
              className={cn(
                'flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-50',
                selected ? 'border-orange-400 bg-orange-50 ring-2 ring-orange-500/20 dark:bg-orange-950/30' : 'border-stone-200 hover:border-orange-300 dark:border-stone-700'
              )}
            >
              <span className="flex items-center gap-2.5 text-sm font-semibold text-stone-900 dark:text-white">
                <CalendarDays className="h-4 w-4 text-orange-500" />
                {formatTourDate(d.startDate, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
              <span className={cn('text-xs font-medium', left === 0 ? 'text-stone-400' : left <= 5 ? 'text-rose-600' : 'text-emerald-600')}>
                {seatsLabel(d)}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-5 divide-y divide-stone-100 dark:divide-stone-800">
        <Stepper label="Adults" hint="12+ years" value={adults} min={1} max={Math.max(1, Math.min(20, seatsLeft - children))} onChange={setAdults} />
        <Stepper label="Children" hint="Under 12" value={children} min={0} max={Math.max(0, Math.min(20, seatsLeft - adults))} onChange={setChildren} />
      </div>

      <div className="mt-4 flex items-center justify-between rounded-xl bg-stone-50 px-4 py-3 dark:bg-stone-800/60">
        <span className="text-sm text-stone-600 dark:text-stone-300">
          {formatINR(tour.price)} × {travellers}
        </span>
        <span className="text-lg font-bold text-stone-900 dark:text-white">{formatINR(total)}</span>
      </div>

      <button
        type="button"
        disabled={!departure || seatsLeft === 0}
        onClick={() => setOpen(true)}
        className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 font-semibold text-white shadow-lg shadow-orange-500/25 transition-[filter] hover:brightness-110 disabled:opacity-50"
      >
        Book now
      </button>
      <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-stone-500 dark:text-stone-400">
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
        No payment now — we confirm your seats within 24 hours
      </p>

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
                {tour.title} · {departure && formatTourDate(departure.startDate)} · {travellers} traveller{travellers > 1 ? 's' : ''} · {formatINR(total)}
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
