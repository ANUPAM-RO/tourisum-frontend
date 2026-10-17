'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { ChevronLeft, ChevronRight, Grid2X2, Images, Share2, X } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import SafeImage from '@/components/shared/SafeImage';
import type { Crumb } from '@/components/shared/PageHeader';
import { EASE_OUT } from './utils';

/* ------------------------------------------------------------------ */
/* Breadcrumbs (light variant, for detail pages)                       */
/* ------------------------------------------------------------------ */

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-stone-500 dark:text-stone-400">
        {items.map((crumb, i) => (
          <li key={`${crumb.label}-${i}`} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-stone-300 dark:text-stone-600" />}
            {crumb.href ? (
              <Link href={crumb.href} className="transition-colors hover:text-orange-600">
                {crumb.label}
              </Link>
            ) : (
              <span className="line-clamp-1 text-stone-800 dark:text-stone-200" aria-current="page">
                {crumb.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/* Share                                                               */
/* ------------------------------------------------------------------ */

export function ShareButton({ title, className }: { title: string; className?: string }) {
  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard');
    } catch (err) {
      // AbortError = the user closed the share sheet; nothing to report.
      if ((err as Error)?.name !== 'AbortError') toast.error('Could not share this page');
    }
  };

  return (
    <button
      type="button"
      onClick={share}
      className={cn(
        'inline-flex h-10 items-center gap-2 rounded-full border border-stone-200 bg-white px-4 text-sm font-medium text-stone-700 transition-colors hover:border-stone-300 hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200 dark:hover:bg-stone-800',
        className
      )}
    >
      <Share2 className="h-4 w-4" />
      Share
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Gallery: mosaic on desktop, swipeable strip on mobile, lightbox     */
/* ------------------------------------------------------------------ */

const restSpans: Record<number, string[]> = {
  1: ['col-span-2 row-span-2'],
  2: ['col-span-2', 'col-span-2'],
  3: ['col-span-2', '', ''],
  4: ['', '', '', ''],
};

export function DetailGallery({ images, alt }: { images: string[]; alt: string }) {
  const photos = images.filter(Boolean);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [mobileIndex, setMobileIndex] = useState(0);
  const stripRef = useRef<HTMLDivElement>(null);

  const rest = photos.slice(1, 5);
  const spans = restSpans[rest.length] ?? [];

  const onStripScroll = () => {
    const el = stripRef.current;
    if (!el) return;
    setMobileIndex(Math.round(el.scrollLeft / el.clientWidth));
  };

  if (photos.length === 0) {
    return (
      <div className="overflow-hidden rounded-3xl">
        <SafeImage src={null} alt={alt} className="aspect-[16/9] w-full md:aspect-auto md:h-[440px]" />
      </div>
    );
  }

  return (
    <>
      {/* Mobile: native scroll-snap carousel */}
      <div className="relative -mx-4 sm:mx-0 md:hidden">
        <div
          ref={stripRef}
          onScroll={onStripScroll}
          className="flex snap-x snap-mandatory overflow-x-auto sm:rounded-3xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {photos.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => setLightbox(i)}
              className="aspect-[4/3] w-full shrink-0 snap-center"
              aria-label={`Open photo ${i + 1}`}
            >
              <SafeImage src={src} width={960} priority={i === 0} alt={`${alt} — photo ${i + 1}`} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
        {photos.length > 1 && (
          <span className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-semibold text-white">
            {mobileIndex + 1} / {photos.length}
          </span>
        )}
      </div>

      {/* Desktop: mosaic */}
      <div
        className={cn(
          'relative hidden h-[440px] gap-2 overflow-hidden rounded-3xl md:grid lg:h-[480px]',
          rest.length > 0 ? 'grid-cols-4 grid-rows-2' : 'grid-cols-1'
        )}
      >
        <GalleryTile
          src={photos[0]}
          alt={alt}
          width={1600}
          priority
          onClick={() => setLightbox(0)}
          className={rest.length > 0 ? 'col-span-2 row-span-2' : ''}
        />
        {rest.map((src, i) => (
          <GalleryTile
            key={`${src}-${i}`}
            src={src}
            alt={`${alt} — photo ${i + 2}`}
            width={800}
            onClick={() => setLightbox(i + 1)}
            className={spans[i]}
          />
        ))}
        {photos.length > 1 && (
          <button
            type="button"
            onClick={() => setLightbox(0)}
            className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-stone-900 shadow-lg transition-transform hover:scale-[1.03] active:scale-95"
          >
            <Grid2X2 className="h-4 w-4" />
            Show all {photos.length} photos
          </button>
        )}
      </div>

      <Lightbox images={photos} alt={alt} index={lightbox} onChange={setLightbox} />
    </>
  );
}

function GalleryTile({
  src,
  alt,
  width,
  priority,
  onClick,
  className,
}: {
  src: string;
  alt: string;
  width: number;
  priority?: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button type="button" onClick={onClick} className={cn('group relative overflow-hidden bg-stone-100 dark:bg-stone-800', className)}>
      <SafeImage
        src={src}
        width={width}
        priority={priority}
        alt={alt}
        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
      <span className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
    </button>
  );
}

function Lightbox({
  images,
  alt,
  index,
  onChange,
}: {
  images: string[];
  alt: string;
  index: number | null;
  onChange: (index: number | null) => void;
}) {
  const open = index !== null;
  const count = images.length;

  const step = useCallback(
    (dir: 1 | -1) => {
      if (index === null) return;
      onChange((index + dir + count) % count);
    },
    [index, count, onChange]
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onChange(null);
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, step, onChange]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`${alt} photos`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[70] flex flex-col bg-stone-950/95"
          onClick={() => onChange(null)}
        >
          <div className="flex items-center justify-between px-4 py-4 text-white sm:px-6" onClick={(e) => e.stopPropagation()}>
            <span className="flex items-center gap-2 text-sm font-medium text-white/80">
              <Images className="h-4 w-4" />
              {index + 1} / {count}
            </span>
            <button
              type="button"
              onClick={() => onChange(null)}
              aria-label="Close gallery"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-6 sm:px-16">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25, ease: EASE_OUT }}
                className="flex h-full w-full items-center justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                <SafeImage
                  src={images[index]}
                  width={1920}
                  priority
                  alt={`${alt} — photo ${index + 1}`}
                  className="max-h-full max-w-full rounded-xl object-contain"
                />
              </motion.div>
            </AnimatePresence>

            {count > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    step(-1);
                  }}
                  aria-label="Previous photo"
                  className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25 sm:left-4"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    step(1);
                  }}
                  aria-label="Next photo"
                  className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25 sm:right-4"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------ */
/* Layout pieces                                                       */
/* ------------------------------------------------------------------ */

export interface Fact {
  icon: LucideIcon;
  label: string;
  value: React.ReactNode;
}

export function FactsStrip({ facts }: { facts: Fact[] }) {
  if (facts.length === 0) return null;
  return (
    <dl className="grid grid-cols-2 divide-stone-200/80 overflow-hidden rounded-2xl border border-stone-200/80 bg-white dark:divide-stone-800 dark:border-stone-800 dark:bg-stone-900 sm:flex sm:divide-x">
      {facts.map(({ icon: Icon, label, value }) => (
        <div key={label} className="flex min-w-0 flex-1 items-center gap-3 p-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400">
            <Icon className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <dt className="text-xs text-stone-500 dark:text-stone-400">{label}</dt>
            <dd className="truncate text-sm font-semibold text-stone-900 dark:text-white">{value}</dd>
          </div>
        </div>
      ))}
    </dl>
  );
}

export function DetailSection({
  id,
  eyebrow,
  title,
  children,
  className,
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease: EASE_OUT }}
      className={cn(
        'scroll-mt-24 rounded-3xl border border-stone-200/80 bg-white p-6 dark:border-stone-800 dark:bg-stone-900 md:p-8',
        className
      )}
    >
      {eyebrow && (
        <p className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-orange-600 dark:text-orange-400">
          <span className="h-px w-6 bg-orange-500/70" />
          {eyebrow}
        </p>
      )}
      <h2 className="mb-5 font-display text-2xl font-semibold tracking-tight text-stone-900 dark:text-white md:text-3xl">
        {title}
      </h2>
      {children}
    </motion.section>
  );
}

/** A single contact / info row used in the sidebar card. */
export function ContactRow({
  icon: Icon,
  label,
  value,
  href,
  external,
}: {
  icon: LucideIcon;
  label: string;
  value: React.ReactNode;
  href?: string;
  external?: boolean;
}) {
  const content = (
    <>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-stone-100 text-stone-600 transition-colors group-hover:bg-orange-50 group-hover:text-orange-600 dark:bg-stone-800 dark:text-stone-300">
        <Icon className="h-4 w-4" />
      </span>
      <span className="min-w-0">
        <span className="block text-xs text-stone-500 dark:text-stone-400">{label}</span>
        <span className="block truncate text-sm font-medium text-stone-900 dark:text-white">{value}</span>
      </span>
    </>
  );
  const cls = 'group flex items-center gap-3 rounded-xl p-2 -mx-2';
  if (!href) return <div className={cls}>{content}</div>;
  return (
    <a
      href={href}
      {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
      className={cn(cls, 'transition-colors hover:bg-stone-50 dark:hover:bg-stone-800/60')}
    >
      {content}
    </a>
  );
}

/** Fixed bottom action bar for small screens. Pair with bottom padding on the page. */
export function MobileActionBar({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-stone-200/80 bg-white px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_-12px_rgba(0,0,0,0.15)] dark:border-stone-800 dark:bg-stone-950 lg:hidden">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">{children}</div>
    </div>
  );
}

export const primaryCta =
  'inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-6 font-semibold text-white shadow-lg shadow-orange-500/25 transition-[opacity,transform] hover:opacity-95 active:scale-[0.98]';
export const secondaryCta =
  'inline-flex items-center justify-center gap-2 rounded-full border border-stone-200 bg-white px-6 font-semibold text-stone-800 transition-colors hover:border-stone-300 hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:hover:bg-stone-800';

/** Loading skeleton matching the detail layout. */
export function DetailSkeleton() {
  return (
    <div className="min-h-screen bg-stone-50 pt-16 dark:bg-stone-950 lg:pt-[68px]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="h-4 w-48 animate-pulse rounded bg-stone-200 dark:bg-stone-800" />
        <div className="mt-5 h-10 w-2/3 max-w-lg animate-pulse rounded-lg bg-stone-200 dark:bg-stone-800" />
        <div className="mt-3 h-4 w-1/3 animate-pulse rounded bg-stone-200/70 dark:bg-stone-800/70" />
        <div className="mt-8 aspect-[4/3] w-full animate-pulse rounded-3xl bg-stone-200 dark:bg-stone-800 md:aspect-auto md:h-[440px]" />
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="h-20 animate-pulse rounded-2xl bg-stone-200/70 dark:bg-stone-800/70" />
            <div className="h-48 animate-pulse rounded-3xl bg-stone-200/70 dark:bg-stone-800/70" />
          </div>
          <div className="hidden h-80 animate-pulse rounded-3xl bg-stone-200/70 dark:bg-stone-800/70 lg:block" />
        </div>
      </div>
    </div>
  );
}
