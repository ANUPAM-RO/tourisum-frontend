'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { Camera, ChevronLeft, ChevronRight, Heart, MapPin, Share2, Star } from 'lucide-react';
import { cn, formatRating, optimizeImage } from '@/lib/utils';
import type { Place } from '@/types';
import SafeImage from '@/components/shared/SafeImage';
import { placeLocation } from '@/components/shared/PlaceCard';
import { EASE_OUT } from '@/components/home/motion';

interface PlaceHeroProps {
  place: Place;
  favorite: boolean;
  onToggleFavorite: () => void;
  onShare: () => void;
}

const MAX_THUMBS = 5;

/** Full-bleed image gallery hero with title, breadcrumbs and quick actions. */
export default function PlaceHero({ place, favorite, onToggleFavorite, onShare }: PlaceHeroProps) {
  const images = useMemo(() => place.images?.filter(Boolean) ?? [], [place.images]);
  const [selected, setSelected] = useState(0);
  const count = images.length;
  const location = placeLocation(place);
  const state = typeof place.state === 'object' ? place.state : null;

  const go = (dir: 1 | -1) => setSelected((i) => (i + dir + count) % count);

  // Warm the next image so switching feels instant.
  useEffect(() => {
    if (count < 2) return;
    const next = new Image();
    next.src = optimizeImage(images[(selected + 1) % count], 1920);
  }, [selected, count, images]);

  return (
    <section className="relative isolate flex min-h-[540px] h-[72svh] max-h-[780px] flex-col overflow-hidden bg-stone-950 pt-16 lg:pt-[68px]">
      <AnimatePresence initial={false}>
        <motion.div
          key={selected}
          className="absolute inset-0 -z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          drag={count > 1 ? 'x' : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
          onDragEnd={(_, info) => {
            if (info.offset.x < -60) go(1);
            else if (info.offset.x > 60) go(-1);
          }}
        >
          <SafeImage
            src={images[selected]}
            width={1920}
            priority={selected === 0}
            alt={`${place.name} — photo ${selected + 1}`}
            className="h-full w-full object-cover"
            draggable={false}
          />
        </motion.div>
      </AnimatePresence>
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/30 to-black/45" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-black/50 via-transparent to-transparent" />

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 sm:px-6 lg:px-8">
        {/* Top row: breadcrumbs + actions */}
        <div className="flex items-start justify-between gap-4 pt-6">
          <nav aria-label="Breadcrumb" className="min-w-0">
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-white/65">
              <li><Link href="/" className="transition-colors hover:text-white">Home</Link></li>
              <li className="flex items-center gap-1.5">
                <ChevronRight className="h-3.5 w-3.5 text-white/35" />
                <Link href="/places" className="transition-colors hover:text-white">Places</Link>
              </li>
              {state?.slug && (
                <li className="hidden items-center gap-1.5 sm:flex">
                  <ChevronRight className="h-3.5 w-3.5 text-white/35" />
                  <Link href={`/states/${state.slug}`} className="transition-colors hover:text-white">{state.name}</Link>
                </li>
              )}
              <li className="flex min-w-0 items-center gap-1.5">
                <ChevronRight className="h-3.5 w-3.5 text-white/35" />
                <span className="truncate text-white/90" aria-current="page">{place.name}</span>
              </li>
            </ol>
          </nav>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={onShare}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-stone-800 shadow-md transition-transform duration-200 hover:scale-105 active:scale-95"
              aria-label="Share this place"
            >
              <Share2 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onToggleFavorite}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-md transition-transform duration-200 hover:scale-105 active:scale-95"
              aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
              aria-pressed={favorite}
            >
              <Heart className={cn('h-4 w-4', favorite ? 'fill-rose-500 text-rose-500' : 'text-stone-800')} />
            </button>
          </div>
        </div>

        {/* Bottom row: title + thumbnails */}
        <div className="mt-auto flex flex-col gap-6 pb-20 md:flex-row md:items-end md:justify-between md:pb-24">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE_OUT }}
            className="max-w-3xl text-white"
          >
            {place.category?.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {place.category.map((cat) => (
                  <span key={cat} className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
                    {cat}
                  </span>
                ))}
              </div>
            )}
            <h1 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              {place.name}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-white/85">
              {location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-orange-300" />
                  {location}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="font-semibold text-white">{formatRating(place.rating)}</span>
                <span className="text-white/60">
                  ({place.reviews?.length ?? 0} review{place.reviews?.length === 1 ? '' : 's'})
                </span>
              </span>
            </div>
          </motion.div>

          {count > 1 && (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => go(-1)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/30 text-white transition-colors hover:bg-white hover:text-stone-900"
                aria-label="Previous photo"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="hidden gap-2 lg:flex">
                {images.slice(0, MAX_THUMBS).map((img, i) => (
                  <button
                    key={`${img}-${i}`}
                    type="button"
                    onClick={() => setSelected(i)}
                    aria-label={`Show photo ${i + 1}`}
                    aria-current={selected === i}
                    className={cn(
                      'h-14 w-20 overflow-hidden rounded-lg ring-2 ring-offset-2 ring-offset-black/40 transition-[opacity,box-shadow] duration-200',
                      selected === i ? 'ring-white opacity-100' : 'ring-transparent opacity-60 hover:opacity-100'
                    )}
                  >
                    <SafeImage src={img} width={200} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
              <span className="flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1.5 text-sm font-medium tabular-nums text-white">
                <Camera className="h-4 w-4" />
                {selected + 1} / {count}
              </span>
              <button
                type="button"
                onClick={() => go(1)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/30 text-white transition-colors hover:bg-white hover:text-stone-900"
                aria-label="Next photo"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
