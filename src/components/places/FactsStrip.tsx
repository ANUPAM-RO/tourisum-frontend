import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Fact {
  icon: LucideIcon;
  label: string;
  value: React.ReactNode;
  tone?: 'default' | 'success';
}

/** Card of key facts that overlaps the bottom of the hero. */
export default function FactsStrip({ facts }: { facts: Fact[] }) {
  return (
    <div className="relative z-10 mx-auto -mt-12 max-w-7xl px-4 sm:px-6 lg:px-8">
      <dl className="grid grid-cols-2 overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-xl shadow-stone-900/5 dark:border-stone-800 dark:bg-stone-900 dark:shadow-black/30 md:grid-cols-5">
        {facts.map(({ icon: Icon, label, value, tone }, i) => (
          <div
            key={label}
            className={cn(
              'flex items-center gap-3 border-stone-100 p-4 dark:border-stone-800 md:border-b-0 md:border-r md:p-5 md:last:border-r-0',
              i % 2 === 0 && 'border-r',
              i < facts.length - (facts.length % 2 === 0 ? 2 : 1) && 'border-b',
              i === facts.length - 1 && facts.length % 2 === 1 && 'col-span-2 border-r-0 md:col-span-1'
            )}
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400">
              <Icon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <dt className="text-xs font-medium uppercase tracking-wider text-stone-500 dark:text-stone-400">{label}</dt>
              <dd
                className={cn(
                  'mt-0.5 truncate text-sm font-semibold',
                  tone === 'success' ? 'text-emerald-600 dark:text-emerald-400' : 'text-stone-900 dark:text-white'
                )}
              >
                {value}
              </dd>
            </div>
          </div>
        ))}
      </dl>
    </div>
  );
}
