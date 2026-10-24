'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useTours } from '@/lib/hooks';
import TourCard, { TourCardSkeleton } from '@/components/tours/TourCard';
import SectionHeading from './SectionHeading';

/** "Your next tour with us" — the soonest upcoming group tours. */
export default function ToursSection() {
  const { data: tours, isLoading } = useTours({ limit: 3 });

  if (!isLoading && !tours?.length) return null;

  return (
    <section className="bg-gradient-to-b from-orange-50/60 to-white py-20 md:py-28 dark:from-stone-900/60 dark:to-stone-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          align="left"
          eyebrow="Group tours"
          title={<>Your next tour <em className="italic text-gradient-warm pr-1">with us</em></>}
          description="Hand-crafted group trips with fixed departures — hotels, transport and a tour coordinator all taken care of."
          action={
            <Link
              href="/tours"
              className="group inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-stone-900 hover:text-orange-600 dark:text-white"
            >
              See all tours
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          }
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? Array.from({ length: 3 }, (_, i) => <TourCardSkeleton key={i} />)
            : tours!.map((tour, i) => <TourCard key={tour._id} tour={tour} index={i} />)}
        </div>
      </div>
    </section>
  );
}
