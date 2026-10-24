'use client';

import { motion } from 'framer-motion';
import { BedDouble, Coffee, Flag, PlaneLanding, Sandwich, UtensilsCrossed } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { TourDay } from '@/types';
import { cn } from '@/lib/utils';
import { EASE_OUT } from '@/components/stays/utils';

const MEAL_STYLES: Record<string, { icon: LucideIcon; className: string }> = {
  breakfast: { icon: Coffee, className: 'bg-amber-50 text-amber-700 ring-amber-200/70 dark:bg-amber-950/30 dark:text-amber-300 dark:ring-amber-900/50' },
  lunch: { icon: Sandwich, className: 'bg-emerald-50 text-emerald-700 ring-emerald-200/70 dark:bg-emerald-950/30 dark:text-emerald-300 dark:ring-emerald-900/50' },
  dinner: { icon: UtensilsCrossed, className: 'bg-indigo-50 text-indigo-700 ring-indigo-200/70 dark:bg-indigo-950/30 dark:text-indigo-300 dark:ring-indigo-900/50' },
};
const FALLBACK_MEAL = { icon: UtensilsCrossed, className: 'bg-stone-100 text-stone-700 ring-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:ring-stone-700' };

/** "Fort Kochi — heritage boutique hotel" → ["Fort Kochi", "heritage boutique hotel"]. */
function splitStay(stay: string) {
  const [place, ...rest] = stay.split(/\s+[—–-]\s+/);
  return rest.length ? { place, detail: rest.join(' — ') } : { place: stay, detail: '' };
}

export default function TourItinerary({ days }: { days: TourDay[] }) {
  const last = days.length - 1;

  return (
    <ol className="relative">
      {days.map((d, i) => {
        const tag = i === 0 ? { label: 'Arrival', icon: PlaneLanding } : i === last && last > 0 ? { label: 'Departure', icon: Flag } : null;
        const stay = d.stay ? splitStay(d.stay) : null;

        return (
          <motion.li
            key={d.day}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.45, ease: EASE_OUT }}
            className="group relative grid grid-cols-[3.5rem_1fr] gap-4 pb-6 last:pb-0 sm:grid-cols-[4rem_1fr] sm:gap-5"
          >
            {/* Timeline rail */}
            <div className="relative flex flex-col items-center">
              <div className="relative z-10 flex h-14 w-14 flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-rose-500 text-white shadow-lg shadow-orange-500/25 ring-4 ring-white transition-transform duration-300 group-hover:scale-105 sm:h-16 sm:w-16 dark:ring-stone-900">
                <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/80">Day</span>
                <span className="text-xl font-bold leading-none sm:text-2xl">{String(d.day).padStart(2, '0')}</span>
              </div>
              {i < last && <div className="mt-2 w-0.5 flex-1 rounded-full bg-gradient-to-b from-orange-300 via-rose-200 to-stone-200 dark:from-orange-800 dark:via-rose-900/60 dark:to-stone-800" />}
            </div>

            {/* Day card */}
            <div className="rounded-2xl border border-stone-200/80 bg-gradient-to-br from-white to-stone-50/80 p-5 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-orange-200 group-hover:shadow-lg group-hover:shadow-orange-500/5 sm:p-6 dark:border-stone-800 dark:from-stone-900 dark:to-stone-900/60 dark:group-hover:border-orange-900/60">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h3 className="text-lg font-semibold leading-snug text-stone-900 sm:text-xl dark:text-white">{d.title}</h3>
                {tag && (
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-orange-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-orange-700 dark:bg-orange-950/50 dark:text-orange-300">
                    <tag.icon className="h-3 w-3" />
                    {tag.label}
                  </span>
                )}
              </div>

              {d.description && <p className="mt-2.5 leading-relaxed text-stone-600 dark:text-stone-400">{d.description}</p>}

              {(d.meals.length > 0 || stay) && (
                <div className="mt-4 flex flex-col gap-3 border-t border-dashed border-stone-200 pt-4 sm:flex-row sm:items-center sm:justify-between dark:border-stone-800">
                  {d.meals.length > 0 ? (
                    <ul className="flex flex-wrap gap-1.5" aria-label="Meals included">
                      {d.meals.map((meal) => {
                        const { icon: Icon, className } = MEAL_STYLES[meal.trim().toLowerCase()] ?? FALLBACK_MEAL;
                        return (
                          <li key={meal} className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1', className)}>
                            <Icon className="h-3.5 w-3.5" />
                            {meal}
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <span className="text-xs text-stone-400">Meals on your own</span>
                  )}

                  {stay && (
                    <div className="flex items-center gap-2.5 rounded-xl bg-orange-50/80 px-3 py-2 dark:bg-orange-950/20">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-orange-500 shadow-sm dark:bg-stone-800">
                        <BedDouble className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 leading-tight">
                        <p className="text-sm font-semibold text-stone-800 dark:text-stone-100">{stay.place}</p>
                        {stay.detail && <p className="text-xs capitalize text-stone-500 dark:text-stone-400">{stay.detail}</p>}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.li>
        );
      })}
    </ol>
  );
}
