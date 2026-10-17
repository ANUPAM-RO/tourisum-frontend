'use client';

import { useDeferredValue, useMemo, useState } from 'react';
import { ChevronDown, Compass, MapPin, Search, X } from 'lucide-react';
import { usePlaces, useStates } from '@/lib/hooks';
import { cn } from '@/lib/utils';
import type { Place } from '@/types';
import PageHeader from '@/components/shared/PageHeader';
import PlaceCard, { PlaceCardSkeleton } from '@/components/shared/PlaceCard';
import ChipGroup from '@/components/shared/ChipGroup';
import EmptyState from '@/components/shared/EmptyState';
import FancySelect from '@/components/shared/FancySelect';

const categories = ['All', 'Hill Station', 'Beach', 'Heritage', 'Wildlife', 'Religious', 'Adventure', 'Honeymoon', 'Family Trip'];

const HEADER_IMAGE = 'https://images.unsplash.com/photo-1477587458883-47145ed94245';

function stateMatches(place: Place, selected: string) {
  if (selected === 'All') return true;
  if (typeof place.state !== 'object' || !place.state) return false;
  return place.state.name === selected || place.state.slug === selected;
}

export default function PlacesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedState, setSelectedState] = useState('All');
  // Keeps typing responsive while the grid re-filters.
  const deferredQuery = useDeferredValue(searchQuery);

  const { data: placesData, isLoading: placesLoading } = usePlaces({ limit: 50 });
  const { data: statesData } = useStates({ limit: 50 });

  const places = useMemo(() => placesData?.data ?? [], [placesData]);
  const states = statesData?.data ?? [];

  const filteredPlaces = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
    return places.filter((place) => {
      const matchesSearch =
        !q || place.name.toLowerCase().includes(q) || place.description?.toLowerCase().includes(q);
      const matchesCategory = selectedCategory === 'All' || place.category?.includes(selectedCategory);
      return matchesSearch && matchesCategory && stateMatches(place, selectedState);
    });
  }, [places, deferredQuery, selectedCategory, selectedState]);

  const hasFilters = searchQuery !== '' || selectedCategory !== 'All' || selectedState !== 'All';
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedState('All');
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <PageHeader
        image={HEADER_IMAGE}
        eyebrow="Explore India"
        title={<>Tourist <em className="italic text-orange-300">destinations</em></>}
        description="Forts, beaches, hill stations and sacred towns — find the places worth the journey."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Places' }]}
      >
        <form
          role="search"
          onSubmit={(e) => e.preventDefault()}
          className="flex max-w-2xl items-center gap-3 rounded-2xl bg-white p-2 pl-5 shadow-2xl shadow-black/30"
        >
          <Search className="h-5 w-5 shrink-0 text-orange-500" />
          <label htmlFor="places-search" className="sr-only">Search places</label>
          <input
            id="places-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or what you'd like to see..."
            className="h-11 w-full bg-transparent text-[15px] text-stone-900 outline-none placeholder:text-stone-400"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-700"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </form>
      </PageHeader>

      {/* Sticky filter bar */}
      <div className="sticky top-16 z-30 border-b border-stone-200/80 bg-white/95 dark:border-stone-800 dark:bg-stone-950/95 lg:top-[68px]">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <ChipGroup
            options={categories}
            value={selectedCategory}
            onChange={setSelectedCategory}
            layoutId="places-category"
            label="Filter by category"
            className="md:pb-0"
          />
          <FancySelect
            label="State"
            icon={MapPin}
            value={selectedState}
            onChange={setSelectedState}
            options={[{ value: 'All', label: 'All states' }, ...states.map((s) => ({ value: s.name, label: s.name }))]}
            align="right"
            className="shrink-0 md:w-56"
          />
        </div>
      </div>

      {/* Results */}
      <section className="py-10 md:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex min-h-8 flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-stone-600 dark:text-stone-400" aria-live="polite">
              {placesLoading ? (
                'Loading destinations...'
              ) : (
                <>
                  Showing <span className="font-semibold text-stone-900 dark:text-white">{filteredPlaces.length}</span>{' '}
                  destination{filteredPlaces.length !== 1 ? 's' : ''}
                  {selectedState !== 'All' && <> in <span className="font-semibold text-stone-900 dark:text-white">{selectedState}</span></>}
                </>
              )}
            </p>
            {hasFilters && !placesLoading && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-orange-600 transition-colors hover:bg-orange-50 dark:text-orange-400 dark:hover:bg-orange-950/40"
              >
                <X className="h-3.5 w-3.5" />
                Clear filters
              </button>
            )}
          </div>

          <div
            className={cn(
              'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 transition-opacity duration-200',
              deferredQuery !== searchQuery && 'opacity-70'
            )}
          >
            {placesLoading ? (
              Array.from({ length: 6 }, (_, i) => <PlaceCardSkeleton key={i} />)
            ) : filteredPlaces.length > 0 ? (
              filteredPlaces.map((place, i) => (
                <PlaceCard key={place._id} place={place} index={i} showDescription />
              ))
            ) : (
              <EmptyState
                icon={Compass}
                title="No places found"
                description="Try a different search term, category or state."
                action={
                  hasFilters ? (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="rounded-full bg-stone-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-600 dark:bg-white dark:text-stone-900 dark:hover:bg-orange-500 dark:hover:text-white"
                    >
                      Clear filters
                    </button>
                  ) : undefined
                }
              />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
