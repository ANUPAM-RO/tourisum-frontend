'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, MapPin, Star } from 'lucide-react';
import type { Restaurant } from '@/types';
import { cn, formatRating } from '@/lib/utils';
import SafeImage from '@/components/shared/SafeImage';
import { EASE_OUT, dietLabel, formatDistance, formatINR, priceLevel, uniqueCuisines } from './utils';

/** The familiar Indian food-label marker: green square/dot for veg, red for non-veg. */
export function DietMarker({ type, className }: { type: Restaurant['vegNonVeg']; className?: string }) {
  if (type === 'both') {
    return (
      <span className={cn('flex items-center gap-0.5', className)} aria-hidden>
        <DietMarker type="veg" />
        <DietMarker type="non-veg" />
      </span>
    );
  }
  const veg = type === 'veg';
  return (
    <span
      aria-hidden
      className={cn(
        'flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-[3px] border-[1.5px] bg-white',
        veg ? 'border-emerald-600' : 'border-rose-600',
        className
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', veg ? 'bg-emerald-600' : 'bg-rose-600')} />
    </span>
  );
}

export function PriceLevel({ cost, className }: { cost?: number; className?: string }) {
  const level = priceLevel(cost);
  if (!level) return null;
  return (
    <span className={cn('font-semibold tracking-wider', className)} aria-label={`Price level ${level} of 4`}>
      <span className="text-stone-900 dark:text-white">{'₹'.repeat(level)}</span>
      <span className="text-stone-300 dark:text-stone-600">{'₹'.repeat(4 - level)}</span>
    </span>
  );
}

interface RestaurantCardProps {
  restaurant: Restaurant;
  index?: number;
}

export default function RestaurantCard({ restaurant, index = 0 }: RestaurantCardProps) {
  const cuisines = uniqueCuisines(restaurant.cuisine);
  const hours = [restaurant.openingTime, restaurant.closingTime].filter(Boolean).join(' – ');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.06, ease: EASE_OUT }}
      className="h-full"
    >
      <Link
        href={`/restaurants/${restaurant.slug}`}
        className="lift group flex h-full flex-col overflow-hidden rounded-2xl border border-stone-200/80 bg-white hover:shadow-xl hover:shadow-stone-200/70 dark:border-stone-800 dark:bg-stone-900 dark:hover:shadow-black/30"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-stone-100 dark:bg-stone-800">
          <SafeImage
            src={restaurant.images?.[0]}
            width={640}
            alt={restaurant.name}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

          {restaurant.vegNonVeg && (
            <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-stone-800 shadow-sm">
              <DietMarker type={restaurant.vegNonVeg} />
              {dietLabel[restaurant.vegNonVeg] ?? restaurant.vegNonVeg}
            </span>
          )}

          <span className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-stone-900 shadow-sm">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            {formatRating(restaurant.rating)}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <h3 className="text-lg font-semibold leading-snug text-stone-900 transition-colors group-hover:text-orange-600 dark:text-white">
            {restaurant.name}
          </h3>
          {(restaurant.address || restaurant.distance) && (
            <p className="mt-1 flex items-center gap-1.5 text-sm text-stone-500 dark:text-stone-400">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{restaurant.address || formatDistance(restaurant.distance)}</span>
            </p>
          )}

          {cuisines.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {cuisines.slice(0, 3).map((c) => (
                <li
                  key={c}
                  className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-700 dark:bg-orange-950/40 dark:text-orange-300"
                >
                  {c}
                </li>
              ))}
              {cuisines.length > 3 && (
                <li className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-500 dark:bg-stone-800 dark:text-stone-400">
                  +{cuisines.length - 3}
                </li>
              )}
            </ul>
          )}

          <div className="mt-auto pt-4">
            <div className="flex items-center justify-between gap-3 border-t border-stone-100 pt-4 text-sm dark:border-stone-800">
              <span className="flex min-w-0 items-center gap-1.5 text-stone-500 dark:text-stone-400">
                <Clock className="h-4 w-4 shrink-0" />
                <span className="truncate">{hours || 'Hours vary'}</span>
              </span>
              <span className="flex shrink-0 items-center gap-2">
                <PriceLevel cost={restaurant.averageCost} className="text-xs" />
                {restaurant.averageCost > 0 && (
                  <span className="font-semibold text-stone-900 dark:text-white">
                    {formatINR(restaurant.averageCost)}
                    <span className="font-normal text-stone-500 dark:text-stone-400"> for one</span>
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
