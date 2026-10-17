'use client';

import { motion } from 'framer-motion';
import { CloudRain, Snowflake, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

interface Weather {
  summer?: string;
  winter?: string;
  monsoon?: string;
}

const SEASONS = [
  { key: 'summer', label: 'Summer', icon: Sun, tone: 'bg-amber-50 text-amber-500 dark:bg-amber-950/40' },
  { key: 'monsoon', label: 'Monsoon', icon: CloudRain, tone: 'bg-teal-50 text-teal-600 dark:bg-teal-950/40' },
  { key: 'winter', label: 'Winter', icon: Snowflake, tone: 'bg-sky-50 text-sky-500 dark:bg-sky-950/40' },
] as const;

export function hasWeather(weather?: Weather | null) {
  return !!weather && SEASONS.some((s) => weather[s.key]);
}

export default function WeatherSeasons({ weather }: { weather?: Weather | null }) {
  if (!weather) return null;
  const seasons = SEASONS.filter((s) => weather[s.key]);

  return (
    <div className={cn('grid gap-4', seasons.length >= 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2')}>
      {seasons.map(({ key, label, icon: Icon, tone }, i) => (
        <motion.div
          key={key}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.45, delay: (i % 3) * 0.06, ease: EASE_OUT }}
          className="rounded-2xl border border-stone-200/80 bg-white p-5 dark:border-stone-800 dark:bg-stone-900"
        >
          <div className="flex items-center justify-between">
            <span className={cn('flex h-10 w-10 items-center justify-center rounded-xl', tone)}>
              <Icon className="h-5 w-5" />
            </span>
          </div>
          <h3 className="mt-4 font-semibold text-stone-900 dark:text-white">{label}</h3>
          <p className="mt-1 text-sm leading-relaxed text-stone-600 dark:text-stone-400">{weather[key]}</p>
        </motion.div>
      ))}
    </div>
  );
}
