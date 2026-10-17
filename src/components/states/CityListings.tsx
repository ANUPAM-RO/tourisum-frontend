'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, MapPin, Star } from 'lucide-react';
import SafeImage from '@/components/shared/SafeImage';
import { cn, formatRating } from '@/lib/utils';
import type { Hotel, Restaurant } from '@/types';

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

const cardClass =
  'lift group flex h-full flex-col overflow-hidden rounded-2xl border border-stone-200/80 bg-white hover:shadow-xl hover:shadow-stone-200/70 dark:border-stone-800 dark:bg-stone-900 dark:hover:shadow-black/30';

function Reveal({ index, children }: { index: number; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.06, ease: EASE_OUT }}
      className="h-full"
    >
      {children}
    </motion.div>
  );
}

/** Renders a Link when the item has a slug, otherwise a plain container. */
function CardShell({ href, children }: { href?: string; children: React.ReactNode }) {
  return href ? (
    <Link href={href} className={cardClass}>
      {children}
    </Link>
  ) : (
    <div className={cardClass}>{children}</div>
  );
}

const formatINR = (n?: number) => (typeof n === 'number' && n > 0 ? `₹${n.toLocaleString('en-IN')}` : null);

export function HotelCard({ hotel, index = 0 }: { hotel: Hotel; index?: number }) {
  const price = formatINR(hotel.pricePerNight);
  const stars = Math.max(0, Math.min(5, Math.round(hotel.starRating || 0)));

  return (
    <Reveal index={index}>
      <CardShell href={hotel.slug ? `/hotels/${hotel.slug}` : undefined}>
        <div className="relative aspect-[16/10] overflow-hidden bg-stone-100 dark:bg-stone-800">
          <SafeImage
            src={hotel.images?.[0] || (hotel as unknown as { image?: string }).image}
            width={640}
            alt={hotel.name}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          {stars > 0 && (
            <span className="absolute left-3 top-3 flex items-center gap-0.5 rounded-full bg-white/95 px-2.5 py-1 shadow-sm">
              {Array.from({ length: stars }, (_, i) => (
                <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
              ))}
            </span>
          )}
        </div>
        <div className="flex flex-1 flex-col p-5">
          <h3 className="font-semibold text-stone-900 transition-colors group-hover:text-orange-600 dark:text-white">{hotel.name}</h3>
          {(hotel.address || hotel.distance) && (
            <p className="mt-1 flex items-start gap-1.5 text-sm text-stone-500 dark:text-stone-400">
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span className="line-clamp-1">
                {hotel.address}
                {hotel.address && hotel.distance ? ' · ' : ''}
                {hotel.distance}
              </span>
            </p>
          )}
          {hotel.amenities?.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {hotel.amenities.slice(0, 3).map((a) => (
                <span key={a} className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs text-stone-600 dark:bg-stone-800 dark:text-stone-300">
                  {a}
                </span>
              ))}
            </div>
          )}
          <div className="mt-auto pt-4">
            <div className="flex items-end justify-between border-t border-stone-100 pt-4 dark:border-stone-800">
              <p className="text-lg font-semibold text-stone-900 dark:text-white">
                {price ?? <span className="text-sm font-normal text-stone-500">Price on request</span>}
                {price && <span className="text-sm font-normal text-stone-500"> /night</span>}
              </p>
              {hotel.slug && (
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-orange-600">
                  View
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              )}
            </div>
          </div>
        </div>
      </CardShell>
    </Reveal>
  );
}

const DIET: Record<string, { label: string; className: string }> = {
  veg: { label: 'Pure veg', className: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' },
  'non-veg': { label: 'Non-veg', className: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300' },
  both: { label: 'Veg & non-veg', className: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300' },
};

export function RestaurantCard({ restaurant, index = 0 }: { restaurant: Restaurant; index?: number }) {
  const cost = formatINR(restaurant.averageCost);
  const diet = restaurant.vegNonVeg ? DIET[restaurant.vegNonVeg] : undefined;

  return (
    <Reveal index={index}>
      <CardShell href={restaurant.slug ? `/restaurants/${restaurant.slug}` : undefined}>
        <div className="relative aspect-[16/10] overflow-hidden bg-stone-100 dark:bg-stone-800">
          <SafeImage
            src={restaurant.images?.[0] || (restaurant as unknown as { image?: string }).image}
            width={640}
            alt={restaurant.name}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-stone-900 shadow-sm">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            {formatRating(restaurant.rating, '4.0')}
          </span>
        </div>
        <div className="flex flex-1 flex-col p-5">
          <h3 className="font-semibold text-stone-900 transition-colors group-hover:text-orange-600 dark:text-white">{restaurant.name}</h3>
          {restaurant.cuisine?.length > 0 && (
            <p className="mt-1 line-clamp-1 text-sm text-stone-500 dark:text-stone-400">{restaurant.cuisine.join(' · ')}</p>
          )}
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
            {diet && <span className={cn('rounded-full px-2.5 py-0.5 font-medium', diet.className)}>{diet.label}</span>}
            {restaurant.openingTime && restaurant.closingTime && (
              <span className="inline-flex items-center gap-1 text-stone-500 dark:text-stone-400">
                <Clock className="h-3 w-3" />
                {restaurant.openingTime} – {restaurant.closingTime}
              </span>
            )}
            {restaurant.distance && <span className="text-stone-500 dark:text-stone-400">{restaurant.distance}</span>}
          </div>
          <div className="mt-auto pt-4">
            <div className="flex items-center justify-between border-t border-stone-100 pt-4 text-sm dark:border-stone-800">
              <span className="text-stone-500 dark:text-stone-400">Avg. cost</span>
              <span className="font-semibold text-stone-900 dark:text-white">{cost ? `${cost} / person` : '—'}</span>
            </div>
          </div>
        </div>
      </CardShell>
    </Reveal>
  );
}
