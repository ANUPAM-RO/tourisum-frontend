'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Star } from 'lucide-react';
import type { Hotel } from '@/types';
import SafeImage from '@/components/shared/SafeImage';
import { EASE_OUT, amenityIcon, formatDistance, formatINR } from './utils';

interface HotelCardProps {
  hotel: Hotel;
  index?: number;
}

export default function HotelCard({ hotel, index = 0 }: HotelCardProps) {
  const amenities = hotel.amenities ?? [];
  const extra = amenities.length - 3;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.06, ease: EASE_OUT }}
      className="h-full"
    >
      <Link
        href={`/hotels/${hotel.slug}`}
        className="lift group flex h-full flex-col overflow-hidden rounded-2xl border border-stone-200/80 bg-white hover:shadow-xl hover:shadow-stone-200/70 dark:border-stone-800 dark:bg-stone-900 dark:hover:shadow-black/30"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-stone-100 dark:bg-stone-800">
          <SafeImage
            src={hotel.images?.[0]}
            width={640}
            alt={hotel.name}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

          {hotel.starRating > 0 && (
            <span
              className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-stone-800 shadow-sm"
              aria-label={`${hotel.starRating} star hotel`}
            >
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              {hotel.starRating}-star
            </span>
          )}

          {hotel.category?.[0] && (
            <span className="absolute bottom-3 left-3 rounded-full bg-stone-900/80 px-2.5 py-1 text-[11px] font-semibold text-white">
              {hotel.category[0]}
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col p-5">
          <h3 className="text-lg font-semibold leading-snug text-stone-900 transition-colors group-hover:text-orange-600 dark:text-white">
            {hotel.name}
          </h3>
          {(hotel.address || hotel.distance) && (
            <p className="mt-1 flex items-center gap-1.5 text-sm text-stone-500 dark:text-stone-400">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{hotel.address || formatDistance(hotel.distance)}</span>
            </p>
          )}

          {amenities.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {amenities.slice(0, 3).map((amenity) => {
                const Icon = amenityIcon(amenity);
                return (
                  <li
                    key={amenity}
                    className="flex items-center gap-1.5 rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-600 dark:bg-stone-800 dark:text-stone-300"
                  >
                    <Icon className="h-3.5 w-3.5 text-orange-500" />
                    {amenity}
                  </li>
                );
              })}
              {extra > 0 && (
                <li className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-500 dark:bg-stone-800 dark:text-stone-400">
                  +{extra}
                </li>
              )}
            </ul>
          )}

          <div className="mt-auto pt-4">
            <div className="flex items-end justify-between border-t border-stone-100 pt-4 dark:border-stone-800">
              <div>
                <p className="text-xs text-stone-500 dark:text-stone-400">From</p>
                <p className="text-xl font-bold tracking-tight text-stone-900 dark:text-white">
                  {formatINR(hotel.pricePerNight)}
                  <span className="ml-1 text-sm font-normal text-stone-500 dark:text-stone-400">/ night</span>
                </p>
              </div>
              <span className="rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-3.5 py-1.5 text-xs font-semibold text-white opacity-90 transition-opacity group-hover:opacity-100">
                View stay
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function StayCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-stone-200/80 bg-white dark:border-stone-800 dark:bg-stone-900">
      <div className="aspect-[4/3] animate-pulse bg-stone-200 dark:bg-stone-800" />
      <div className="space-y-3 p-5">
        <div className="h-5 w-2/3 animate-pulse rounded bg-stone-200 dark:bg-stone-800" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-stone-100 dark:bg-stone-800/70" />
        <div className="flex gap-2 pt-1">
          <div className="h-6 w-20 animate-pulse rounded-full bg-stone-100 dark:bg-stone-800/70" />
          <div className="h-6 w-16 animate-pulse rounded-full bg-stone-100 dark:bg-stone-800/70" />
        </div>
        <div className="flex items-center justify-between border-t border-stone-100 pt-4 dark:border-stone-800">
          <div className="h-6 w-24 animate-pulse rounded bg-stone-200 dark:bg-stone-800" />
          <div className="h-7 w-20 animate-pulse rounded-full bg-stone-100 dark:bg-stone-800/70" />
        </div>
      </div>
    </div>
  );
}
