'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Building2, Compass, Landmark, MapPin, Search, X } from 'lucide-react';
import { useStates } from '@/lib/hooks';
import PageHeader from '@/components/shared/PageHeader';
import SafeImage from '@/components/shared/SafeImage';
import EmptyState from '@/components/shared/EmptyState';
import type { State } from '@/types';

const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const HEADER_IMAGE = 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da';

function count(list: unknown) {
  return Array.isArray(list) ? list.length : 0;
}

function StateCard({ state, index }: { state: State; index: number }) {
  const cities = count(state.popularCities);
  const places = count(state.popularPlaces);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.06, ease: EASE_OUT }}
      className="h-full"
    >
      <Link
        href={`/states/${state.slug}`}
        className="lift group flex h-full flex-col overflow-hidden rounded-2xl border border-stone-200/80 bg-white hover:shadow-xl hover:shadow-stone-200/70 dark:border-stone-800 dark:bg-stone-900 dark:hover:shadow-black/30"
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-stone-100 dark:bg-stone-800">
          <SafeImage
            src={state.image}
            width={640}
            alt={state.name}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5 text-white">
            <h3 className="font-display text-2xl font-semibold leading-tight">{state.name}</h3>
            {state.capital && (
              <p className="mt-1 flex items-center gap-1.5 text-sm text-white/80">
                <MapPin className="h-3.5 w-3.5" />
                {state.capital}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col p-5">
          {state.description && (
            <p className="line-clamp-2 text-sm leading-relaxed text-stone-600 dark:text-stone-400">{state.description}</p>
          )}
          <div className="mt-auto flex items-center justify-between gap-3 pt-4">
            <div className="flex flex-wrap gap-1.5 text-xs font-medium text-stone-600 dark:text-stone-300">
              {cities > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2.5 py-1 dark:bg-stone-800">
                  <Building2 className="h-3 w-3" />
                  {cities} {cities === 1 ? 'city' : 'cities'}
                </span>
              )}
              {places > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2.5 py-1 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300">
                  <Landmark className="h-3 w-3" />
                  {places} {places === 1 ? 'place' : 'places'}
                </span>
              )}
            </div>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-stone-100 text-stone-700 transition-colors group-hover:bg-orange-500 group-hover:text-white dark:bg-stone-800 dark:text-stone-200">
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function StateCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-stone-200/80 bg-white dark:border-stone-800 dark:bg-stone-900">
      <div className="aspect-[16/10] animate-pulse bg-stone-200 dark:bg-stone-800" />
      <div className="space-y-3 p-5">
        <div className="h-4 w-full animate-pulse rounded bg-stone-100 dark:bg-stone-800/70" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-stone-100 dark:bg-stone-800/70" />
        <div className="h-6 w-28 animate-pulse rounded-full bg-stone-100 dark:bg-stone-800/70" />
      </div>
    </div>
  );
}

export default function StatesPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: statesData, isLoading } = useStates({ limit: 50 });
  const states = useMemo(() => (statesData?.data || []) as State[], [statesData]);

  const query = searchQuery.trim().toLowerCase();
  const filteredStates = useMemo(
    () =>
      query
        ? states.filter(
            (state) =>
              state.name.toLowerCase().includes(query) || state.capital?.toLowerCase().includes(query)
          )
        : states,
    [states, query]
  );

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <PageHeader
        size="lg"
        image={HEADER_IMAGE}
        eyebrow="Destinations"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'States' }]}
        title={
          <>
            Explore the states of <em className="italic text-gradient-warm pr-1">India</em>
          </>
        }
        description="From Himalayan valleys to tropical backwaters — pick a state to discover its cities, landmarks, food and the best time to go."
      >
        <form
          role="search"
          onSubmit={(e) => e.preventDefault()}
          className="relative max-w-xl"
        >
          <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by state or capital…"
            aria-label="Search states"
            className="h-14 w-full rounded-full border-0 bg-white pl-13 pr-12 text-base text-stone-900 shadow-2xl shadow-black/20 outline-none ring-orange-500/40 transition-shadow placeholder:text-stone-400 focus:ring-4 [&::-webkit-search-cancel-button]:hidden"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-900"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </form>
        {!isLoading && states.length > 0 && (
          <p className="mt-4 text-sm text-white/65">
            <span className="font-semibold text-white">{states.length}</span> states to explore
          </p>
        )}
      </PageHeader>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
        {!isLoading && query && filteredStates.length > 0 && (
          <p className="mb-6 text-sm text-stone-500 dark:text-stone-400">
            Showing <span className="font-semibold text-stone-900 dark:text-white">{filteredStates.length}</span> of{' '}
            {states.length} states for “{searchQuery.trim()}”
          </p>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            Array.from({ length: 6 }, (_, i) => <StateCardSkeleton key={i} />)
          ) : filteredStates.length > 0 ? (
            filteredStates.map((state, index) => <StateCard key={state._id} state={state} index={index} />)
          ) : (
            <EmptyState
              icon={Compass}
              title={query ? 'No states match your search' : 'No states available yet'}
              description={
                query ? 'Try a different spelling, or search by the state capital.' : 'Check back soon — new destinations are on the way.'
              }
              action={
                query ? (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="rounded-full bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-600 dark:bg-orange-500"
                  >
                    Clear search
                  </button>
                ) : undefined
              }
            />
          )}
        </div>
      </section>
    </div>
  );
}
