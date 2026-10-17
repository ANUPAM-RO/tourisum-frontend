'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { fadeUp, revealOnce } from '@/components/home/motion';

interface DetailSectionProps {
  id: string;
  eyebrow: string;
  title: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

/** A titled content block on the place detail page; anchors work with the sticky SectionNav. */
export default function DetailSection({ id, eyebrow, title, action, children, className }: DetailSectionProps) {
  return (
    <motion.section
      id={id}
      {...revealOnce}
      variants={fadeUp}
      className={cn(
        'scroll-mt-32 rounded-2xl border border-stone-200/80 bg-white p-6 dark:border-stone-800 dark:bg-stone-900 md:p-8 lg:scroll-mt-36',
        className
      )}
    >
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-orange-600 dark:text-orange-400">
            <span className="h-px w-6 bg-orange-500/70" />
            {eyebrow}
          </p>
          <h2 className="font-display text-2xl font-semibold tracking-tight text-stone-900 dark:text-white md:text-3xl">
            {title}
          </h2>
        </div>
        {action}
      </div>
      {children}
    </motion.section>
  );
}
