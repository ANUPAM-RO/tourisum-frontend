'use client';

import { motion } from 'framer-motion';
import { MapPin, Navigation, Star } from 'lucide-react';
import type { TourHotel } from '@/types';
import SafeImage from '@/components/shared/SafeImage';
import { EASE_OUT, formatINR } from '@/components/stays/utils';

/** The hotel's own map link, else a Google Maps search on its name and location. */
function hotelMapLink(hotel: TourHotel) {
  if (hotel.googleMapLink) return hotel.googleMapLink;
  const query = [hotel.name, hotel.location].filter(Boolean).join(', ');
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function TourHotelCard({ hotel, index = 0 }: { hotel: TourHotel; index?: number }) {
  const stars = Math.max(0, Math.min(5, Math.round(hotel.starRating || 0)));

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: (index % 2) * 0.06, ease: EASE_OUT }}
      className="flex h-full flex-col overflow-hidden rounded-2xl border border-stone-200/80 bg-white dark:border-stone-800 dark:bg-stone-900"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-stone-100 dark:bg-stone-800">
        <SafeImage src={hotel.image} width={640} alt={hotel.name} className="h-full w-full object-cover" />
        {stars > 0 && (
          <span
            className="absolute left-3 top-3 flex items-center gap-0.5 rounded-full bg-white/95 px-2.5 py-1 shadow-sm"
            aria-label={`${stars} star hotel`}
          >
            {Array.from({ length: stars }, (_, i) => (
              <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            ))}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-semibold leading-snug text-stone-900 dark:text-white">{hotel.name}</h3>
        {hotel.location && (
          <p className="mt-1 flex items-start gap-1.5 text-sm text-stone-500 dark:text-stone-400">
            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            {hotel.location}
          </p>
        )}

        <div className="mt-auto pt-4">
          <div className="flex items-end justify-between gap-3 border-t border-stone-100 pt-4 dark:border-stone-800">
            {hotel.pricePerNight > 0 ? (
              <div>
                <p className="text-xs text-stone-500 dark:text-stone-400">From</p>
                <p className="text-xl font-bold tracking-tight text-stone-900 dark:text-white">
                  {formatINR(hotel.pricePerNight)}
                  <span className="ml-1 text-sm font-normal text-stone-500 dark:text-stone-400">/ night</span>
                </p>
              </div>
            ) : (
              <span />
            )}
            <a
              href={hotelMapLink(hotel)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm shadow-orange-500/25 hover:opacity-90"
            >
              <Navigation className="h-3.5 w-3.5" />
              Google Maps
            </a>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default function TourHotels({ hotels }: { hotels: TourHotel[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {hotels.map((hotel, i) => (
        <TourHotelCard key={`${hotel.name}-${i}`} hotel={hotel} index={i} />
      ))}
    </div>
  );
}
