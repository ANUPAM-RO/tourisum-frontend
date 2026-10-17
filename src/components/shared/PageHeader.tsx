'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import SafeImage from './SafeImage';

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

export interface Crumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: React.ReactNode;
  eyebrow?: string;
  description?: React.ReactNode;
  image?: string | null;
  breadcrumbs?: Crumb[];
  /** Extra content under the description — search bars, stats, actions. */
  children?: React.ReactNode;
  size?: 'md' | 'lg';
  className?: string;
}

/**
 * Dark, image-backed page header shared by all customer pages.
 * Includes the top padding needed to clear the fixed navbar (h-16 / lg:h-[68px]).
 */
export default function PageHeader({
  title,
  eyebrow,
  description,
  image,
  breadcrumbs,
  children,
  size = 'md',
  className,
}: PageHeaderProps) {
  return (
    <section
      className={cn(
        'relative isolate overflow-hidden bg-stone-950 pt-16 lg:pt-[68px]',
        className
      )}
    >
      {image && (
        <SafeImage
          src={image}
          width={1920}
          priority
          hideFallback
          alt=""
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
      )}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/80 via-black/55 to-black/25" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      {!image && (
        <>
          <div className="pointer-events-none absolute -left-32 -top-32 -z-10 h-96 w-96 rounded-full bg-orange-500/25 blur-[110px]" />
          <div className="pointer-events-none absolute -bottom-40 right-0 -z-10 h-96 w-96 rounded-full bg-rose-500/20 blur-[110px]" />
        </>
      )}

      <div
        className={cn(
          'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8',
          size === 'lg' ? 'py-16 md:py-24' : 'py-12 md:py-16'
        )}
      >
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-white/60">
              {breadcrumbs.map((crumb, i) => (
                <li key={`${crumb.label}-${i}`} className="flex items-center gap-1.5">
                  {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-white/35" />}
                  {crumb.href ? (
                    <Link href={crumb.href} className="transition-colors hover:text-white">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-white/90" aria-current="page">{crumb.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: EASE_OUT }}
          className="max-w-3xl text-white"
        >
          {eyebrow && (
            <p className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-orange-300">
              <span className="h-px w-6 bg-orange-300/70" />
              {eyebrow}
            </p>
          )}
          <h1
            className={cn(
              'font-display font-semibold leading-[1.08] tracking-tight',
              size === 'lg' ? 'text-4xl sm:text-5xl lg:text-6xl' : 'text-4xl md:text-5xl'
            )}
          >
            {title}
          </h1>
          {description && (
            <div className="mt-4 max-w-2xl text-base leading-relaxed text-white/75 md:text-lg">{description}</div>
          )}
        </motion.div>

        {children && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1, ease: EASE_OUT }}
            className="mt-8"
          >
            {children}
          </motion.div>
        )}
      </div>
    </section>
  );
}
