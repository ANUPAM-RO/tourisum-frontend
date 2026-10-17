'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import SafeImage from '@/components/shared/SafeImage';
import { EASE_OUT } from '@/components/home/motion';

interface MiniCardProps {
  href: string;
  image?: string | null;
  title: string;
  /** Small label over the image (category, star rating...). */
  badge?: React.ReactNode;
  subtitle?: React.ReactNode;
  meta?: React.ReactNode;
  index?: number;
}

/** Compact horizontal-friendly card used for nearby spots, hotels and restaurants. */
export default function MiniCard({ href, image, title, badge, subtitle, meta, index = 0 }: MiniCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: (index % 3) * 0.06, ease: EASE_OUT }}
      className="h-full"
    >
      <Link
        href={href}
        className="lift group flex h-full flex-col overflow-hidden rounded-2xl border border-stone-200/80 bg-white hover:shadow-lg hover:shadow-stone-200/70 dark:border-stone-800 dark:bg-stone-900 dark:hover:shadow-black/30"
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-stone-100 dark:bg-stone-800">
          <SafeImage
            src={image}
            width={480}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          {badge && (
            <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-stone-800 shadow-sm">
              {badge}
            </span>
          )}
        </div>
        <div className="flex flex-1 flex-col p-4">
          <h3 className="font-semibold text-stone-900 transition-colors group-hover:text-orange-600 dark:text-white">{title}</h3>
          {subtitle && <div className="mt-1 text-sm text-stone-500 dark:text-stone-400">{subtitle}</div>}
          {meta && (
            <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 pt-3 text-sm text-stone-600 dark:text-stone-300">
              {meta}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
