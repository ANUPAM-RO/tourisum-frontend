'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, CalendarDays, Clock, MapPin, Users } from 'lucide-react';
import SafeImage from '@/components/shared/SafeImage';
import { cn } from '@/lib/utils';
import { discountPercent, durationLabel, formatINR, fromPrice, formatTourDate, seatsLabel, seatsLeftOf } from '@/lib/tours';
import type { Tour } from '@/types';

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

export default function TourCard({ tour, index = 0 }: { tour: Tour; index?: number }) {
  const next = tour.nextDeparture;
  const left = next ? seatsLeftOf(next) : 0;
  const discount = discountPercent(tour);
  const route = tour.places.map((p) => p.name).join(' · ');

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay: (index % 3) * 0.08, ease: EASE_OUT }}
      className="group relative flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-stone-200/70 transition-shadow duration-300 hover:shadow-xl hover:shadow-orange-500/10 dark:bg-stone-900 dark:ring-stone-800"
    >
      <Link href={`/tours/${tour.slug}`} className="relative block aspect-[4/3] overflow-hidden">
        <SafeImage
          src={tour.coverImage}
          width={960}
          alt={tour.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-stone-800 backdrop-blur">
            <Clock className="h-3.5 w-3.5 text-orange-500" />
            {durationLabel(tour)}
          </span>
          {discount > 0 && (
            <span className="rounded-full bg-rose-500 px-3 py-1 text-xs font-semibold text-white">{discount}% off</span>
          )}
        </div>
        {next && (
          <span
            className={cn(
              'absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold backdrop-blur',
              left <= 5 ? 'bg-rose-500/90 text-white' : 'bg-black/45 text-white'
            )}
          >
            <Users className="h-3.5 w-3.5" />
            {seatsLabel(next)}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        {route && (
          <p className="flex items-center gap-1.5 text-xs font-medium text-orange-600 dark:text-orange-400">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="line-clamp-1">{route}</span>
          </p>
        )}
        <h3 className="mt-2 font-display text-xl font-semibold leading-snug text-stone-900 dark:text-white">
          <Link href={`/tours/${tour.slug}`} className="hover:text-orange-600">
            {tour.title}
          </Link>
        </h3>
        {tour.tagline && <p className="mt-1.5 line-clamp-2 text-sm text-stone-500 dark:text-stone-400">{tour.tagline}</p>}

        <p className="mt-4 flex items-center gap-2 text-sm text-stone-600 dark:text-stone-300">
          <CalendarDays className="h-4 w-4 text-orange-500" />
          {next ? (
            <>Next departure <span className="font-semibold text-stone-900 dark:text-white">{formatTourDate(next.startDate)}</span></>
          ) : (
            'New dates coming soon'
          )}
        </p>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-stone-100 pt-4 dark:border-stone-800">
          <div>
            <p className="text-xs text-stone-500 dark:text-stone-400">From, per person</p>
            <p className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-stone-900 dark:text-white">{formatINR(fromPrice(tour))}</span>
              {discount > 0 && fromPrice(tour) === tour.price && <span className="text-sm text-stone-400 line-through">{formatINR(tour.originalPrice!)}</span>}
            </p>
          </div>
          <Link
            href={`/tours/${tour.slug}`}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-orange-500/25 transition-[filter] hover:brightness-110"
          >
            {next ? 'Book now' : 'View tour'}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

export function TourCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl bg-white ring-1 ring-stone-200/70 dark:bg-stone-900 dark:ring-stone-800">
      <div className="aspect-[4/3] animate-pulse bg-stone-200 dark:bg-stone-800" />
      <div className="space-y-3 p-5">
        <div className="h-3 w-2/3 animate-pulse rounded bg-stone-200 dark:bg-stone-800" />
        <div className="h-5 w-4/5 animate-pulse rounded bg-stone-200 dark:bg-stone-800" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-stone-200 dark:bg-stone-800" />
      </div>
    </div>
  );
}
