'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, Mail, MessageCircle, Minus, Phone, Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/context/AuthContext';
import { useAgency } from '@/lib/hooks';
import { cn } from '@/lib/utils';

interface BookTourDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultDestination?: string;
}

const budgets = ['Budget', 'Standard', 'Luxury'];

const inputClass =
  'h-10 w-full rounded-[10px] border border-stone-200 bg-stone-50/60 px-3 text-sm text-stone-900 placeholder:text-stone-400 outline-none transition-[border-color,box-shadow,background-color] focus:border-orange-400 focus:bg-white focus:ring-[3px] focus:ring-orange-500/15 dark:border-stone-700 dark:bg-stone-800/60 dark:text-white dark:focus:bg-stone-900';

const labelClass = 'mb-1 block text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400';

export default function BookTourDialog({ open, onOpenChange, defaultDestination = '' }: BookTourDialogProps) {
  const agency = useAgency();
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: '',
    phone: '',
    destination: '',
    date: '',
    travellers: 2,
    budget: 'Standard',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Prefill each time the dialog opens (destination from the page, contact from the logged-in user).
  useEffect(() => {
    if (!open) return;
    setForm((f) => ({
      ...f,
      destination: defaultDestination || f.destination,
      name: f.name || user?.name || '',
      phone: f.phone || user?.phone || '',
    }));
    setErrors({});
  }, [open, defaultDestination, user]);

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors((err) => ({ ...err, [key]: '' }));
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (form.name.trim().length < 2) next.name = 'Enter your name';
    if (!/^[+\d][\d\s-]{8,14}$/.test(form.phone.trim())) next.phone = 'Enter a valid number';
    if (!form.destination.trim() && form.message.trim().length < 5) next.message = 'Tell us your query or where you’d like to go';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const enquiryText = () =>
    [
      `Hi ${agency.name}, I have a query.`,
      '',
      `Name: ${form.name.trim()}`,
      `Phone: ${form.phone.trim()}`,
      form.destination.trim() && `Destination: ${form.destination.trim()}`,
      form.date && `Travel date: ${form.date}`,
      `Travellers: ${form.travellers}`,
      `Budget: ${form.budget}`,
      form.message.trim() && `Query: ${form.message.trim()}`,
    ]
      .filter(Boolean)
      .join('\n');

  const send = (channel: 'whatsapp' | 'email') => {
    if (!validate()) return;
    const url =
      channel === 'whatsapp'
        ? agency.whatsAppLink(enquiryText())
        : agency.mailLink(form.destination.trim() ? `Query: ${form.destination.trim()}` : `Query from ${form.name.trim()}`, enquiryText());
    window.open(url, '_blank', 'noopener,noreferrer');
    toast.success(`Query ready — ${agency.name} will get back to you shortly.`);
    onOpenChange(false);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[calc(100dvh-2rem)] w-[calc(100%-1.5rem)] max-w-[min(56rem,calc(100%-1.5rem))] gap-0 overflow-hidden rounded-[22px] bg-white p-0 shadow-2xl ring-0 sm:max-w-[min(56rem,calc(100%-2rem))] dark:bg-stone-900"
      >
        <div className="grid max-h-[calc(100dvh-2rem)] grid-rows-[auto_minmax(0,1fr)] md:grid-cols-[19rem_1fr] md:grid-rows-1">
          {/* Agent panel */}
          <aside className="relative overflow-hidden bg-stone-950 px-5 py-5 text-white md:px-7 md:py-8">
            <div className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full bg-orange-500/30 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -right-16 h-56 w-56 rounded-full bg-rose-500/20 blur-3xl" />

            <div className="relative">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-300">Raise your query</p>
              <DialogTitle className="mt-2 pr-10 font-display text-2xl font-semibold leading-tight tracking-tight text-white md:text-[28px] md:pr-0">
                How can {agency.name} help?
              </DialogTitle>
              <DialogDescription className="mt-2 hidden text-sm leading-relaxed text-white/60 md:block">
                Ask about a tour, a custom trip, prices or anything else — we usually reply within a few hours.
              </DialogDescription>

              <div className="mt-4 flex items-center gap-3 md:mt-7">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-rose-500 text-sm font-semibold shadow-lg shadow-orange-500/30">
                  {agency.initials}
                </span>
                <div className="min-w-0 text-sm">
                  <p className="font-semibold">{agency.name}</p>
                  <p className="text-white/55">{agency.title}</p>
                </div>
              </div>

              <ul className="mt-6 hidden space-y-2.5 text-sm text-white/75 md:block">
                {agency.highlights.map((h) => (
                  <li key={h} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                    {h}
                  </li>
                ))}
              </ul>

              <div className="mt-4 grid grid-cols-2 gap-2 md:mt-8">
                <a
                  href={agency.telLink}
                  className="flex h-10 items-center justify-center gap-1.5 rounded-[10px] bg-white/10 text-sm font-medium transition-colors hover:bg-white/20"
                >
                  <Phone className="h-4 w-4" />
                  Call
                </a>
                <a
                  href={`mailto:${agency.email}`}
                  className="flex h-10 items-center justify-center gap-1.5 rounded-[10px] bg-white/10 text-sm font-medium transition-colors hover:bg-white/20"
                >
                  <Mail className="h-4 w-4" />
                  Email
                </a>
              </div>
              <p className="mt-3 hidden text-xs text-white/45 md:block">
                {agency.phoneDisplay} · {agency.email}
              </p>
            </div>
          </aside>

          {/* Form */}
          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              send('whatsapp');
            }}
            className="scrollbar-none overflow-y-auto px-5 py-5 md:px-7 md:py-7"
          >
            <h3 className="mb-4 hidden text-base font-semibold text-stone-900 md:block dark:text-white">Your query</h3>

            <div className="grid grid-cols-2 gap-x-3 gap-y-3.5">
              <div>
                <label htmlFor="bt-name" className={labelClass}>Name</label>
                <input id="bt-name" value={form.name} onChange={update('name')} placeholder="Full name" autoComplete="name" className={cn(inputClass, errors.name && 'border-rose-400')} />
                {errors.name && <p className="mt-1 text-xs text-rose-600">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="bt-phone" className={labelClass}>Phone</label>
                <input id="bt-phone" type="tel" inputMode="tel" autoComplete="tel" value={form.phone} onChange={update('phone')} placeholder="Mobile number" className={cn(inputClass, errors.phone && 'border-rose-400')} />
                {errors.phone && <p className="mt-1 text-xs text-rose-600">{errors.phone}</p>}
              </div>
              <div className="col-span-2">
                <label htmlFor="bt-dest" className={labelClass}>
                  Destination or tour <span className="normal-case tracking-normal text-stone-400">(optional)</span>
                </label>
                <input id="bt-dest" value={form.destination} onChange={update('destination')} placeholder="e.g. Darjeeling, Goa, Rajasthan" className={cn(inputClass, errors.destination && 'border-rose-400')} />
                {errors.destination && <p className="mt-1 text-xs text-rose-600">{errors.destination}</p>}
              </div>
              <div>
                <label htmlFor="bt-date" className={labelClass}>Travel date</label>
                <input id="bt-date" type="date" min={today} value={form.date} onChange={update('date')} className={inputClass} />
              </div>
              <div>
                <span id="bt-trav-label" className={labelClass}>Travellers</span>
                <div role="group" aria-labelledby="bt-trav-label" className="flex h-10 items-center justify-between rounded-[10px] border border-stone-200 bg-stone-50/60 p-1 dark:border-stone-700 dark:bg-stone-800/60">
                  <button
                    type="button"
                    aria-label="Fewer travellers"
                    disabled={form.travellers <= 1}
                    onClick={() => setForm((f) => ({ ...f, travellers: f.travellers - 1 }))}
                    className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-white text-stone-600 shadow-sm transition-colors hover:text-orange-600 disabled:opacity-40 dark:bg-stone-900 dark:text-stone-300"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="text-sm font-semibold text-stone-800 dark:text-white" aria-live="polite">
                    {form.travellers} {form.travellers === 1 ? 'person' : 'people'}
                  </span>
                  <button
                    type="button"
                    aria-label="More travellers"
                    disabled={form.travellers >= 30}
                    onClick={() => setForm((f) => ({ ...f, travellers: f.travellers + 1 }))}
                    className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-white text-stone-600 shadow-sm transition-colors hover:text-orange-600 disabled:opacity-40 dark:bg-stone-900 dark:text-stone-300"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="col-span-2">
                <span className={labelClass}>Budget</span>
                <div role="radiogroup" className="grid grid-cols-3 gap-1 rounded-[12px] bg-stone-100 p-1 dark:bg-stone-800">
                  {budgets.map((b) => (
                    <button
                      key={b}
                      type="button"
                      role="radio"
                      aria-checked={form.budget === b}
                      onClick={() => setForm((f) => ({ ...f, budget: b }))}
                      className={cn(
                        'h-8 rounded-[9px] text-sm font-medium transition-colors',
                        form.budget === b
                          ? 'bg-white text-orange-600 shadow-sm dark:bg-stone-950 dark:text-orange-400'
                          : 'text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-white'
                      )}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>
              <div className="col-span-2">
                <label htmlFor="bt-msg" className={labelClass}>Your query</label>
                <textarea id="bt-msg" rows={3} value={form.message} onChange={update('message')} placeholder="Ask anything — dates, prices, hotels, a custom plan…" className={cn(inputClass, 'h-auto resize-none py-2', errors.message && 'border-rose-400')} />
                {errors.message && <p className="mt-1 text-xs text-rose-600">{errors.message}</p>}
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <button
                type="submit"
                className="flex h-11 w-full shrink-0 items-center justify-center gap-2 rounded-[12px] sm:w-auto sm:flex-1 bg-gradient-to-r from-orange-500 to-rose-500 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition-[filter,transform] hover:brightness-110 active:scale-[0.98]"
              >
                <MessageCircle className="h-4 w-4" />
                Send on WhatsApp
              </button>
              <button
                type="button"
                onClick={() => send('email')}
                className="flex h-11 shrink-0 items-center justify-center gap-2 rounded-[12px] border border-stone-200 px-5 text-sm font-semibold text-stone-700 transition-colors hover:bg-stone-50 dark:border-stone-700 dark:text-white dark:hover:bg-stone-800"
              >
                <Mail className="h-4 w-4" />
                Email instead
              </button>
            </div>
            <p className="mt-3 text-center text-xs text-stone-400">
              Your details are shared only with {agency.name} to answer your query.
            </p>
          </form>
        </div>

        <DialogClose
          aria-label="Close"
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 md:bg-stone-100 md:text-stone-600 md:hover:bg-stone-200 md:hover:text-stone-900 dark:md:bg-stone-800 dark:md:text-stone-300"
        >
          <X className="h-4 w-4" />
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
