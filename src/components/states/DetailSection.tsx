'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

interface DetailSectionProps {
  id: string;
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

/**
 * Consistent section block for the state / city detail pages.
 * `scroll-mt` clears the fixed navbar plus the sticky in-page nav.
 */
export default function DetailSection({ id, eyebrow, title, description, action, children, className }: DetailSectionProps) {
  return (
    <section id={id} className={cn('scroll-mt-36 lg:scroll-mt-40', className)}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5, ease: EASE_OUT }}
        className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <p className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-orange-600 dark:text-orange-400">
            <span className="h-px w-6 bg-orange-500/70" />
            {eyebrow}
          </p>
          <h2 className="font-display text-2xl font-semibold tracking-tight text-stone-900 md:text-3xl dark:text-white">
            {title}
          </h2>
          {description && (
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-stone-500 md:text-base dark:text-stone-400">{description}</p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </motion.div>
      {children}
    </section>
  );
}

/** Plain white panel used for info blocks inside sections and the sidebar. */
export function Panel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('rounded-2xl border border-stone-200/80 bg-white p-5 sm:p-6 dark:border-stone-800 dark:bg-stone-900', className)}>
      {children}
    </div>
  );
}

/** Small muted note used when a section has no data yet. */
export function SectionNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-2xl border border-dashed border-stone-300 bg-white px-5 py-8 text-center text-sm text-stone-500 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-400">
      {children}
    </p>
  );
}
