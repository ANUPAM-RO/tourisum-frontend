'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, MapPin } from 'lucide-react';
import SafeImage from '@/components/shared/SafeImage';
import type { City } from '@/types';

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

export default function CityCard({ city, index = 0 }: { city: City; index?: number }) {
  const placeCount = Array.isArray(city.popularPlaces) ? city.popularPlaces.length : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.06, ease: EASE_OUT }}
    >
      <Link
        href={`/cities/${city.slug}`}
        className="lift group relative block aspect-[4/3] overflow-hidden rounded-2xl bg-stone-200 hover:shadow-xl hover:shadow-stone-200/70 dark:bg-stone-800 dark:hover:shadow-black/30"
      >
        <SafeImage
          src={city.image}
          width={640}
          alt={city.name}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />

        <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-stone-900 opacity-0 shadow-md transition-[opacity,transform] duration-300 group-hover:-translate-y-0.5 group-hover:opacity-100">
          <ArrowUpRight className="h-4 w-4" />
        </span>

        <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-5">
          <h3 className="font-display text-xl font-semibold leading-tight sm:text-2xl">{city.name}</h3>
          <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-white/75">
            <MapPin className="h-3 w-3" />
            {placeCount > 0 ? `${placeCount} ${placeCount === 1 ? 'place' : 'places'} to explore` : 'Explore city'}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
