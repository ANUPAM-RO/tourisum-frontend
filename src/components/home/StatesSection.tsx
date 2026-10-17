'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, MapPin } from 'lucide-react';
import { useStates } from '@/lib/hooks';
import { cn } from '@/lib/utils';
import SafeImage from '@/components/shared/SafeImage';
import SectionHeading from './SectionHeading';
import { fadeUp, revealOnce, stagger } from './motion';

export default function StatesSection() {
  // Same query key as the hero's state picker, so this is served from the shared cache.
  const { data, isLoading } = useStates({ limit: 50 });
  const states = (data?.data ?? []).slice(0, 5);

  return (
    <section className="bg-stone-50 py-20 md:py-28 dark:bg-stone-900/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          align="left"
          eyebrow="States of India"
          title={<>Every state, a different <em className="italic text-gradient-warm pr-1">world</em></>}
          description="Unique cultures, cuisines and landscapes — start with a state and go deeper."
          action={
            <Link
              href="/states"
              className="group inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-stone-900 hover:text-orange-600 dark:text-white"
            >
              Explore all states
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          }
        />

        <motion.div
          {...revealOnce}
          variants={stagger}
          className="grid auto-rows-[220px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {isLoading
            ? Array.from({ length: 5 }, (_, i) => (
                <div
                  key={i}
                  className={cn(
                    'animate-pulse rounded-2xl bg-stone-200 dark:bg-stone-800',
                    i === 0 && 'sm:col-span-2 sm:row-span-2'
                  )}
                />
              ))
            : states.map((state, i) => {
                const featured = i === 0;
                return (
                  <motion.div
                    key={state._id}
                    variants={fadeUp}
                    className={cn(featured && 'sm:col-span-2 sm:row-span-2')}
                  >
                    <Link
                      href={`/states/${state.slug}`}
                      className="group relative block h-full overflow-hidden rounded-2xl bg-stone-200 dark:bg-stone-800"
                    >
                      <SafeImage
                        src={state.image}
                        width={featured ? 1100 : 600}
                        alt={state.name}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      <span className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-stone-900 opacity-0 shadow-md transition-[opacity,transform] duration-300 group-hover:opacity-100 group-hover:-translate-y-0.5">
                        <ArrowUpRight className="h-4 w-4" />
                      </span>

                      <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-6">
                        {state.capital && (
                          <p className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-white/70">
                            <MapPin className="h-3 w-3" />
                            {state.capital}
                          </p>
                        )}
                        <h3 className={cn('font-display font-semibold leading-tight', featured ? 'text-3xl sm:text-4xl' : 'text-2xl')}>
                          {state.name}
                        </h3>
                        <p className={cn('mt-2 text-sm text-white/75', featured ? 'line-clamp-2 max-w-md' : 'line-clamp-1')}>
                          {state.description}
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
        </motion.div>
      </div>
    </section>
  );
}
