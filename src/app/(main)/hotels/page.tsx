'use client';

import React, { useDeferredValue, useMemo, useState } from 'react';
import { BedDouble, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { useHotels } from '@/lib/hooks';
import { cn } from '@/lib/utils';
import PageHeader from '@/components/shared/PageHeader';
import ChipGroup from '@/components/shared/ChipGroup';
import EmptyState from '@/components/shared/EmptyState';
import HotelCard, { StayCardSkeleton } from '@/components/stays/HotelCard';
import { FilterSelect, HeaderSearch, type Option } from '@/components/stays/ListingControls';

const priceBands: Record<string, [number, number]> = {
  'Any price': [0, Infinity],
  'Under ₹3,000': [0, 2999],
  '₹3,000 – ₹8,000': [3000, 8000],
  '₹8,000 – ₹15,000': [8001, 15000],
  '₹15,000+': [15001, Infinity],
};
const priceOptions = Object.keys(priceBands);

const cityOptions: Option[] = [
  { value: 'All', label: 'All cities' },
  { value: 'Jaipur', label: 'Jaipur' },
  { value: 'Jodhpur', label: 'Jodhpur' },
  { value: 'Kochi', label: 'Kochi' },
  { value: 'Munnar', label: 'Munnar' },
  { value: 'Panaji', label: 'Panaji' },
];

const sortOptions: Option[] = [
  { value: 'rating', label: 'Recommended' },
  { value: 'price-low', label: 'Price: low to high' },
  { value: 'price-high', label: 'Price: high to low' },
  { value: 'stars', label: 'Most stars' },
];

export default function HotelsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [priceBand, setPriceBand] = useState(priceOptions[0]);
  const [sortBy, setSortBy] = useState('rating');
  const [showFilters, setShowFilters] = useState(false);
  const deferredQuery = useDeferredValue(searchQuery);

  const { data: hotelsData, isLoading } = useHotels({ limit: 50 });

  const filteredHotels = useMemo(() => {
    const hotels = hotelsData?.data ?? [];
    const q = deferredQuery.trim().toLowerCase();
    const [min, max] = priceBands[priceBand] ?? priceBands['Any price'];
    return hotels
      .filter((hotel) => {
        const price = hotel.pricePerNight || 0;
        const matchesSearch =
          !q || hotel.name?.toLowerCase().includes(q) || hotel.address?.toLowerCase().includes(q);
        const matchesCity = selectedCity === 'All' || hotel.address?.toLowerCase().includes(selectedCity.toLowerCase());
        const matchesPrice = price >= min && price <= max;
        return matchesSearch && matchesCity && matchesPrice;
      })
      .sort((a, b) => {
        // Hotels have no guest rating, so "recommended" ranks by star class then value.
        if (sortBy === 'rating' || sortBy === 'stars')
          return (b.starRating || 0) - (a.starRating || 0) || (a.pricePerNight || 0) - (b.pricePerNight || 0);
        if (sortBy === 'price-low') return (a.pricePerNight || 0) - (b.pricePerNight || 0);
        if (sortBy === 'price-high') return (b.pricePerNight || 0) - (a.pricePerNight || 0);
        return 0;
      });
  }, [hotelsData, deferredQuery, selectedCity, priceBand, sortBy]);

  const hasFilters = !!searchQuery || selectedCity !== 'All' || priceBand !== priceOptions[0];
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCity('All');
    setPriceBand(priceOptions[0]);
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <PageHeader
        image="https://images.unsplash.com/photo-1566073771259-6a8506099945"
        eyebrow="Stays across India"
        title={<>Find your <em className="italic text-orange-300">perfect</em> stay</>}
        description="Heritage havelis, hillside retreats and beachfront resorts — handpicked hotels for every budget."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Hotels' }]}
      >
        <HeaderSearch value={searchQuery} onChange={setSearchQuery} placeholder="Search hotels by name or location" />
      </PageHeader>

      {/* Sticky filter bar */}
      <div className="sticky top-16 z-30 border-b border-stone-200/80 bg-white/95 dark:border-stone-800 dark:bg-stone-950/95 lg:top-[68px]">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <ChipGroup
                options={priceOptions}
                value={priceBand}
                onChange={setPriceBand}
                layoutId="hotel-price-filter"
                label="Price per night"
                className="pb-0"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowFilters((s) => !s)}
              aria-expanded={showFilters}
              className={cn(
                'flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors md:hidden',
                showFilters || selectedCity !== 'All'
                  ? 'border-orange-300 bg-orange-50 text-orange-700 dark:border-orange-500/40 dark:bg-orange-950/40 dark:text-orange-300'
                  : 'border-stone-200 text-stone-700 dark:border-stone-700 dark:text-stone-200'
              )}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </button>
            <div className="hidden shrink-0 items-center gap-2 md:flex">
              <FilterSelect label="City" value={selectedCity} onChange={setSelectedCity} options={cityOptions} />
              <FilterSelect label="Sort by" value={sortBy} onChange={setSortBy} options={sortOptions} />
            </div>
          </div>
          {showFilters && (
            <div className="mt-3 grid grid-cols-2 gap-2 md:hidden">
              <FilterSelect label="City" value={selectedCity} onChange={setSelectedCity} options={cityOptions} />
              <FilterSelect label="Sort by" value={sortBy} onChange={setSortBy} options={sortOptions} />
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-12 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <p className="text-sm text-stone-600 dark:text-stone-400" aria-live="polite">
            {isLoading ? (
              'Finding stays…'
            ) : (
              <>
                <span className="font-semibold text-stone-900 dark:text-white">{filteredHotels.length}</span> hotel
                {filteredHotels.length !== 1 ? 's' : ''} found
              </>
            )}
          </p>
          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="flex items-center gap-1.5 text-sm font-medium text-orange-600 transition-colors hover:text-orange-700 dark:text-orange-400"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Clear filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            Array.from({ length: 6 }, (_, i) => <StayCardSkeleton key={i} />)
          ) : filteredHotels.length > 0 ? (
            filteredHotels.map((hotel, index) => <HotelCard key={hotel._id} hotel={hotel} index={index} />)
          ) : (
            <EmptyState
              icon={BedDouble}
              title="No hotels match your search"
              description="Try a different city, widen the price range or clear your filters."
              action={
                hasFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="rounded-full bg-stone-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-600 dark:bg-white dark:text-stone-900 dark:hover:bg-orange-500 dark:hover:text-white"
                  >
                    Clear filters
                  </button>
                )
              }
            />
          )}
        </div>
      </section>
    </div>
  );
}
