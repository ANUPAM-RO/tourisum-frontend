'use client';

import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

export interface KeyFact {
  icon: LucideIcon;
  label: string;
  value?: string | null;
}

/** White facts strip that overlaps the bottom edge of the dark PageHeader. */
export default function KeyFacts({ facts }: { facts: KeyFact[] }) {
  const visible = facts.filter((f) => f.value);
  if (visible.length === 0) return null;

  return (
    <div className="relative z-10 mx-auto -mt-10 max-w-7xl px-4 sm:px-6 lg:px-8">
      <motion.dl
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.15, ease: EASE_OUT }}
        className={cn(
          'grid grid-cols-2 overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-xl shadow-stone-900/5 dark:border-stone-800 dark:bg-stone-900 dark:shadow-black/30',
          visible.length >= 4 ? 'lg:grid-cols-4' : visible.length === 3 ? 'lg:grid-cols-3' : ''
        )}
      >
        {visible.map(({ icon: Icon, label, value }, i) => (
          <div
            key={label}
            className={cn(
              'flex items-start gap-3 p-4 sm:p-5',
              'border-stone-100 dark:border-stone-800',
              i % 2 === 1 && 'border-l',
              i >= 2 && 'border-t lg:border-t-0',
              i > 0 && 'lg:border-l'
            )}
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500 dark:bg-orange-950/40">
              <Icon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <dt className="text-xs font-medium uppercase tracking-wider text-stone-500 dark:text-stone-400">{label}</dt>
              <dd className="mt-0.5 line-clamp-2 text-sm font-semibold leading-snug text-stone-900 sm:text-base dark:text-white" title={typeof value === 'string' ? value : undefined}>{value}</dd>
            </div>
          </div>
        ))}
      </motion.dl>
    </div>
  );
}
