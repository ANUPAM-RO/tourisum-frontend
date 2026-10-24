'use client';

import { useMemo, useState } from 'react';
import { Compass } from 'lucide-react';
import PageHeader from '@/components/shared/PageHeader';
import ChipGroup from '@/components/shared/ChipGroup';
import EmptyState from '@/components/shared/EmptyState';
import { useTours } from '@/lib/hooks';
import TourCard, { TourCardSkeleton } from './TourCard';

const ALL = 'All tours';

export default function ToursContent() {
  const { data: tours = [], isLoading } = useTours();
  const [tag, setTag] = useState(ALL);

  const tags = useMemo(() => [ALL, ...new Set(tours.flatMap((t) => t.tags))], [tours]);
  const shown = tag === ALL ? tours : tours.filter((t) => t.tags.includes(tag));

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <PageHeader
        eyebrow="Group tours"
        title={<>Travel with <em className="italic text-orange-300">us</em></>}
        description="Small-group trips with fixed departure dates. Pick a tour, choose your date and book your seats in a minute."
        image="https://images.unsplash.com/photo-1524492412937-b28074a5d7da"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Tours' }]}
      />

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {tags.length > 2 && (
          <ChipGroup options={tags} value={tag} onChange={setTag} layoutId="tour-tags" label="Tour types" className="mb-8" />
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, i) => <TourCardSkeleton key={i} />)}
          </div>
        ) : shown.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {shown.map((tour, i) => <TourCard key={tour._id} tour={tour} index={i} />)}
          </div>
        ) : (
          <EmptyState icon={Compass} title="No tours yet" description="New group tours are being planned — check back soon." />
        )}
      </section>
    </div>
  );
}
