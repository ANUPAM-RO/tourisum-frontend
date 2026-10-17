'use client';

import { motion } from 'framer-motion';
import { Bus, Plane, ShieldCheck, ThumbsDown, ThumbsUp, TrainFront, UtensilsCrossed } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { City } from '@/types';

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

const reveal = (i: number) => ({
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.45, delay: (i % 3) * 0.06, ease: EASE_OUT },
});

/* ---------------------------------- Transport --------------------------------- */

interface TransportRow {
  icon: LucideIcon;
  mode: string;
  title: string;
  details: { label: string; value?: string }[];
}

export function transportRows(t?: City['transportation'] | null): TransportRow[] {
  if (!t) return [];
  const rows: TransportRow[] = [];
  if (t.nearestAirport?.name)
    rows.push({
      icon: Plane,
      mode: 'By air',
      title: t.nearestAirport.name,
      details: [
        { label: 'Distance', value: t.nearestAirport.distance },
        { label: 'Cab cost', value: t.nearestAirport.cabCost },
      ],
    });
  if (t.nearestStation?.name)
    rows.push({
      icon: TrainFront,
      mode: 'By train',
      title: t.nearestStation.name,
      details: [
        { label: 'Distance', value: t.nearestStation.distance },
        { label: 'Taxi fare', value: t.nearestStation.taxiFare },
      ],
    });
  if (t.busStand?.name)
    rows.push({
      icon: Bus,
      mode: 'By road',
      title: t.busStand.name,
      details: [{ label: 'Local auto', value: t.busStand.autoFare }],
    });
  return rows;
}

export function TransportList({ rows }: { rows: TransportRow[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {rows.map(({ icon: Icon, mode, title, details }, i) => (
        <motion.div
          key={mode}
          {...reveal(i)}
          className="rounded-2xl border border-stone-200/80 bg-white p-5 dark:border-stone-800 dark:bg-stone-900"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-500 dark:bg-orange-950/40">
              <Icon className="h-5 w-5" />
            </span>
            <p className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">{mode}</p>
          </div>
          <h3 className="mt-4 font-semibold leading-snug text-stone-900 dark:text-white">{title}</h3>
          <dl className="mt-3 space-y-1.5 text-sm">
            {details
              .filter((d) => d.value)
              .map((d) => (
                <div key={d.label} className="flex justify-between gap-3">
                  <dt className="text-stone-500 dark:text-stone-400">{d.label}</dt>
                  <dd className="text-right font-medium text-stone-800 dark:text-stone-200">{d.value}</dd>
                </div>
              ))}
          </dl>
        </motion.div>
      ))}
    </div>
  );
}

/* ----------------------------------- Budget ----------------------------------- */

type Tier = Partial<Record<'hotel' | 'food' | 'travel' | 'tickets' | 'shopping' | 'total', string>>;

const TIER_ORDER = ['budget', 'standard', 'luxury'];
const TIER_LABEL: Record<string, string> = { budget: 'Backpacker', standard: 'Comfort', luxury: 'Luxury' };
const BUDGET_ROWS: { key: keyof Tier; label: string; suffix?: string }[] = [
  { key: 'hotel', label: 'Hotel', suffix: '/night' },
  { key: 'food', label: 'Food', suffix: '/day' },
  { key: 'travel', label: 'Local travel', suffix: '/day' },
  { key: 'tickets', label: 'Tickets' },
  { key: 'shopping', label: 'Shopping' },
];

export function budgetTiers(b?: City['estimatedBudget'] | null): [string, Tier][] {
  if (!b) return [];
  return (Object.entries(b) as [string, Tier][])
    .filter(([, tier]) => tier && Object.values(tier).some(Boolean))
    .sort((a, b) => {
      const ia = TIER_ORDER.indexOf(a[0]);
      const ib = TIER_ORDER.indexOf(b[0]);
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    });
}

export function BudgetTiers({ tiers }: { tiers: [string, Tier][] }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {tiers.map(([type, tier], i) => {
        const featured = type === 'standard';
        return (
          <motion.div
            key={type}
            {...reveal(i)}
            className={cn(
              'relative flex flex-col rounded-2xl border bg-white p-5 sm:p-6 dark:bg-stone-900',
              featured
                ? 'border-orange-300 shadow-lg shadow-orange-500/10 dark:border-orange-500/50'
                : 'border-stone-200/80 dark:border-stone-800'
            )}
          >
            {featured && (
              <span className="absolute -top-3 left-5 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white">
                Most popular
              </span>
            )}
            <p className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              {TIER_LABEL[type] ?? type}
            </p>
            <p className="mt-1 font-display text-3xl font-semibold tracking-tight text-stone-900 dark:text-white">
              {tier.total || '—'}
              {tier.total && <span className="ml-1 font-sans text-sm font-normal text-stone-500">/day</span>}
            </p>
            <dl className="mt-5 space-y-2 border-t border-stone-100 pt-4 text-sm dark:border-stone-800">
              {BUDGET_ROWS.filter((r) => tier[r.key]).map((r) => (
                <div key={r.key} className="flex justify-between gap-3">
                  <dt className="text-stone-500 dark:text-stone-400">{r.label}</dt>
                  <dd className="text-right font-medium text-stone-800 dark:text-stone-200">
                    {tier[r.key]}
                    {r.suffix && <span className="font-normal text-stone-400">{r.suffix}</span>}
                  </dd>
                </div>
              ))}
            </dl>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ------------------------------------ Food ------------------------------------ */

export function LocalFoods({ foods }: { foods: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2.5">
      {foods.map((food) => (
        <li
          key={food}
          className="inline-flex items-center gap-2 rounded-full border border-orange-200/70 bg-orange-50/70 px-4 py-2 text-sm font-medium text-orange-800 dark:border-orange-900/60 dark:bg-orange-950/30 dark:text-orange-200"
        >
          <UtensilsCrossed className="h-3.5 w-3.5 text-orange-500" />
          {food}
        </li>
      ))}
    </ul>
  );
}

/* ---------------------------------- Tips -------------------------------------- */

export function hasTips(t?: City['travelTips'] | null) {
  return !!t && [t.dos, t.donts, t.safety].some((l) => Array.isArray(l) && l.length > 0);
}

const TIP_GROUPS = [
  { key: 'dos', title: "Do's", icon: ThumbsUp, tone: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40', dot: 'bg-emerald-500' },
  { key: 'donts', title: "Don'ts", icon: ThumbsDown, tone: 'bg-rose-50 text-rose-600 dark:bg-rose-950/40', dot: 'bg-rose-500' },
  { key: 'safety', title: 'Safety', icon: ShieldCheck, tone: 'bg-amber-50 text-amber-600 dark:bg-amber-950/40', dot: 'bg-amber-500' },
] as const;

export function TravelTips({ tips }: { tips: City['travelTips'] }) {
  const groups = TIP_GROUPS.filter((g) => Array.isArray(tips[g.key]) && tips[g.key].length > 0);
  return (
    <div className={cn('grid gap-4', groups.length >= 3 ? 'md:grid-cols-3' : groups.length === 2 ? 'md:grid-cols-2' : '')}>
      {groups.map(({ key, title, icon: Icon, tone, dot }, i) => (
        <motion.div
          key={key}
          {...reveal(i)}
          className="rounded-2xl border border-stone-200/80 bg-white p-5 dark:border-stone-800 dark:bg-stone-900"
        >
          <h3 className="flex items-center gap-2.5 font-semibold text-stone-900 dark:text-white">
            <span className={cn('flex h-8 w-8 items-center justify-center rounded-lg', tone)}>
              <Icon className="h-4 w-4" />
            </span>
            {title}
          </h3>
          <ul className="mt-4 space-y-2.5">
            {tips[key].map((tip) => (
              <li key={tip} className="flex gap-2.5 text-sm leading-relaxed text-stone-600 dark:text-stone-300">
                <span className={cn('mt-2 h-1.5 w-1.5 shrink-0 rounded-full', dot)} />
                {tip}
              </li>
            ))}
          </ul>
        </motion.div>
      ))}
    </div>
  );
}
