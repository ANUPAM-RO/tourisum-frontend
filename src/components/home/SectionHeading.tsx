'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { fadeUp, revealOnce } from './motion';

interface SectionHeadingProps {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  align?: 'center' | 'left';
  tone?: 'light' | 'dark';
  action?: React.ReactNode;
  className?: string;
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  tone = 'light',
  action,
  className,
}: SectionHeadingProps) {
  const centered = align === 'center';
  const dark = tone === 'dark';

  return (
    <motion.div
      {...revealOnce}
      variants={fadeUp}
      className={cn(
        'mb-12 md:mb-14 flex gap-6',
        centered ? 'flex-col items-center text-center' : 'flex-col md:flex-row md:items-end md:justify-between',
        className
      )}
    >
      <div className={cn(centered && 'max-w-2xl')}>
        <p
          className={cn(
            'mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em]',
            dark ? 'text-orange-300' : 'text-orange-600'
          )}
        >
          <span className={cn('h-px w-6', dark ? 'bg-orange-300/70' : 'bg-orange-500/70')} />
          {eyebrow}
        </p>
        <h2
          className={cn(
            'font-display text-4xl md:text-5xl font-semibold tracking-tight leading-[1.1]',
            dark ? 'text-white' : 'text-stone-900 dark:text-white'
          )}
        >
          {title}
        </h2>
        {description && (
          <p
            className={cn(
              'mt-4 text-base md:text-lg leading-relaxed',
              dark ? 'text-white/65' : 'text-stone-600 dark:text-stone-400',
              centered && 'mx-auto'
            )}
          >
            {description}
          </p>
        )}
      </div>
      {action}
    </motion.div>
  );
}
