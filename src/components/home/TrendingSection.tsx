'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Compass } from 'lucide-react';
import { usePlaces } from '@/lib/hooks';
import { cn } from '@/lib/utils';
import PlaceCard, { PlaceCardSkeleton } from '@/components/shared/PlaceCard';
import ChipGroup from '@/components/shared/ChipGroup';
import EmptyState from '@/components/shared/EmptyState';
import SectionHeading from './SectionHeading';

const filters = ['All', 'Heritage', 'Hill Station', 'Beach', 'Wildlife', 'Adventure'];

export default function TrendingSection() {
  const [active, setActive] = useState('All');
  const { data, isLoading, isFetching, isPlaceholderData } = usePlaces({
    limit: 6,
    category: active !== 'All' ? active : undefined,
  });
  const places = data?.data ?? [];

  return (
    <section className="bg-white py-20 md:py-28 dark:bg-stone-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          align="left"
          eyebrow="Trending this season"
          title={<>Places everyone is <em className="italic text-gradient-warm pr-1">talking</em> about</>}
          action={
            <ChipGroup
              options={filters}
              value={active}
              onChange={setActive}
              layoutId="trending-filter"
              label="Filter destinations"
              className="md:pb-0"
            />
          }
        />

        <div
          className={cn(
            'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 transition-opacity duration-300',
            isFetching && isPlaceholderData && 'opacity-50'
          )}
        >
          {isLoading ? (
            Array.from({ length: 6 }, (_, i) => <PlaceCardSkeleton key={i} />)
          ) : places.length > 0 ? (
            places.map((place, i) => <PlaceCard key={place._id} place={place} index={i} />)
          ) : (
            <EmptyState icon={Compass} title="Nothing here yet" description="No destinations found in this category — try another filter." />
          )}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/places"
            className="group inline-flex items-center gap-2 rounded-full bg-stone-900 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-orange-600 dark:bg-white dark:text-stone-900 dark:hover:bg-orange-500 dark:hover:text-white"
          >
            View all destinations
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
