'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Heart, MapPin, Play, Star, Ticket } from 'lucide-react';
import { useToggleFavorite } from '@/lib/hooks';
import { cn, formatRating } from '@/lib/utils';
import type { Place } from '@/types';
import SafeImage from './SafeImage';

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

export function placeLocation(place: Place) {
  const city = typeof place.city === 'object' ? place.city?.name : '';
  const state = typeof place.state === 'object' ? place.state?.name : '';
  return [city, state].filter(Boolean).join(', ');
}

interface PlaceCardProps {
  place: Place;
  /** Position in the grid — used to stagger the reveal within a row. */
  index?: number;
  showDescription?: boolean;
}

export default function PlaceCard({ place, index = 0, showDescription = false }: PlaceCardProps) {
  const { isFavorite, toggle } = useToggleFavorite();
  const favorite = isFavorite(place._id);
  const isFree = !place.entryFee || place.entryFee.toLowerCase().includes('free');
  const location = placeLocation(place);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.06, ease: EASE_OUT }}
      className="h-full"
    >
      <Link
        href={`/places/${place.slug}`}
        className="lift group flex h-full flex-col overflow-hidden rounded-2xl border border-stone-200/80 bg-white hover:shadow-xl hover:shadow-stone-200/70 dark:border-stone-800 dark:bg-stone-900 dark:hover:shadow-black/30"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-stone-100 dark:bg-stone-800">
          <SafeImage
            src={place.images?.[0]}
            width={640}
            alt={place.name}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            {place.category?.slice(0, 2).map((cat) => (
              <span key={cat} className="rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-stone-800 shadow-sm">
                {cat}
              </span>
            ))}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggle(place._id);
            }}
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 shadow-md transition-transform duration-200 hover:scale-110 active:scale-95"
            aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={cn('h-4 w-4', favorite ? 'fill-rose-500 text-rose-500' : 'text-stone-700')} />
          </button>

          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            <span className="flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-stone-900 shadow-sm">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              {formatRating(place.rating)}
              {place.reviews?.length > 0 && <span className="font-normal text-stone-500">({place.reviews.length})</span>}
            </span>
            {place.videos?.length > 0 && (
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-500 shadow-sm" title="Has videos">
                <Play className="h-3 w-3 fill-white text-white" />
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <h3 className="text-lg font-semibold text-stone-900 transition-colors group-hover:text-orange-600 dark:text-white">
            {place.name}
          </h3>
          {location && (
            <p className="mt-1 flex items-center gap-1.5 text-sm text-stone-500 dark:text-stone-400">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{location}</span>
            </p>
          )}
          {showDescription && place.description && (
            <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-stone-600 dark:text-stone-400">{place.description}</p>
          )}
          <div className="mt-auto pt-4">
            <div className="flex items-center justify-between border-t border-stone-100 pt-4 text-sm dark:border-stone-800">
              <span className="flex min-w-0 items-center gap-1.5 text-stone-500 dark:text-stone-400">
                <Calendar className="h-4 w-4 shrink-0" />
                <span className="truncate">{place.bestTimeToVisit || 'Year-round'}</span>
              </span>
              <span className={cn('flex shrink-0 items-center gap-1.5 font-semibold', isFree ? 'text-emerald-600' : 'text-stone-900 dark:text-white')}>
                <Ticket className="h-4 w-4" />
                {isFree ? 'Free' : place.entryFee}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function PlaceCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-stone-200/80 bg-white dark:border-stone-800 dark:bg-stone-900">
      <div className="aspect-[4/3] animate-pulse bg-stone-200 dark:bg-stone-800" />
      <div className="space-y-3 p-5">
        <div className="h-5 w-2/3 animate-pulse rounded bg-stone-200 dark:bg-stone-800" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-stone-100 dark:bg-stone-800/70" />
        <div className="h-4 w-full animate-pulse rounded bg-stone-100 dark:bg-stone-800/70" />
      </div>
    </div>
  );
}
