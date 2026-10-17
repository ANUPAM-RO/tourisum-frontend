'use client';

import React, { useDeferredValue, useMemo, useState } from 'react';
import { RotateCcw, SlidersHorizontal, UtensilsCrossed } from 'lucide-react';
import { useRestaurants } from '@/lib/hooks';
import { cn } from '@/lib/utils';
import PageHeader from '@/components/shared/PageHeader';
import ChipGroup from '@/components/shared/ChipGroup';
import EmptyState from '@/components/shared/EmptyState';
import RestaurantCard from '@/components/stays/RestaurantCard';
import { StayCardSkeleton } from '@/components/stays/HotelCard';
import { FilterSelect, HeaderSearch, type Option } from '@/components/stays/ListingControls';

const cuisines = ['All', 'Indian', 'Mughlai', 'Chinese', 'Tibetan', 'South Indian', 'Goan', 'Seafood', 'Continental', 'North Indian', 'Rajasthani', 'Kerala', 'Sweets'];

const cityOptions: Option[] = [
  { value: 'All', label: 'All cities' },
  { value: 'Jaipur', label: 'Jaipur' },
  { value: 'Jodhpur', label: 'Jodhpur' },
  { value: 'Kochi', label: 'Kochi' },
  { value: 'Munnar', label: 'Munnar' },
  { value: 'Goa', label: 'Goa' },
];

const dietOptions: Option[] = [
  { value: 'All', label: 'Any diet' },
  { value: 'veg', label: 'Pure veg' },
  { value: 'non-veg', label: 'Non-veg' },
  { value: 'both', label: 'Veg & non-veg' },
];

const sortOptions: Option[] = [
  { value: 'rating', label: 'Highest rated' },
  { value: 'cost-low', label: 'Cost: low to high' },
  { value: 'cost-high', label: 'Cost: high to low' },
];

export default function RestaurantsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [vegNonVeg, setVegNonVeg] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('rating');
  const deferredQuery = useDeferredValue(searchQuery);

  const { data: restaurantsData, isLoading } = useRestaurants({ limit: 50 });

  const filteredRestaurants = useMemo(() => {
    const restaurants = restaurantsData?.data ?? [];
    const q = deferredQuery.trim().toLowerCase();
    const cuisine = selectedCuisine.toLowerCase();
    return restaurants
      .filter((r) => {
        const matchesSearch =
          !q ||
          r.name?.toLowerCase().includes(q) ||
          r.address?.toLowerCase().includes(q) ||
          r.cuisine?.some((c) => c.toLowerCase().includes(q));
        const matchesCity = selectedCity === 'All' || r.address?.toLowerCase().includes(selectedCity.toLowerCase());
        const matchesCuisine = selectedCuisine === 'All' || r.cuisine?.some((c) => c.toLowerCase().includes(cuisine));
        const matchesVeg = vegNonVeg === 'All' || r.vegNonVeg === vegNonVeg;
        return matchesSearch && matchesCity && matchesCuisine && matchesVeg;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        if (sortBy === 'cost-low') return (a.averageCost || 0) - (b.averageCost || 0);
        if (sortBy === 'cost-high') return (b.averageCost || 0) - (a.averageCost || 0);
        return 0;
      });
  }, [restaurantsData, deferredQuery, selectedCity, selectedCuisine, vegNonVeg, sortBy]);

  const hasFilters = !!searchQuery || selectedCity !== 'All' || selectedCuisine !== 'All' || vegNonVeg !== 'All';
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCity('All');
    setSelectedCuisine('All');
    setVegNonVeg('All');
  };

  const selects = (
    <>
      <FilterSelect label="Diet" value={vegNonVeg} onChange={setVegNonVeg} options={dietOptions} />
      <FilterSelect label="City" value={selectedCity} onChange={setSelectedCity} options={cityOptions} />
      <FilterSelect label="Sort by" value={sortBy} onChange={setSortBy} options={sortOptions} />
    </>
  );

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <PageHeader
        image="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4"
        eyebrow="Eat like a local"
        title={<>Where India <em className="italic text-orange-300">eats</em></>}
        description="From royal Rajasthani thalis to Kerala seafood shacks — discover local flavours and fine dining near you."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Restaurants' }]}
      >
        <HeaderSearch value={searchQuery} onChange={setSearchQuery} placeholder="Search by restaurant, cuisine or area" />
      </PageHeader>

      {/* Sticky filter bar */}
      <div className="sticky top-16 z-30 border-b border-stone-200/80 bg-white/95 dark:border-stone-800 dark:bg-stone-950/95 lg:top-[68px]">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <ChipGroup
                options={cuisines}
                value={selectedCuisine}
                onChange={setSelectedCuisine}
                layoutId="restaurant-cuisine-filter"
                label="Cuisine"
                className="pb-0"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowFilters((s) => !s)}
              aria-expanded={showFilters}
              className={cn(
                'flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors lg:hidden',
                showFilters || selectedCity !== 'All' || vegNonVeg !== 'All'
                  ? 'border-orange-300 bg-orange-50 text-orange-700 dark:border-orange-500/40 dark:bg-orange-950/40 dark:text-orange-300'
                  : 'border-stone-200 text-stone-700 dark:border-stone-700 dark:text-stone-200'
              )}
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span className="hidden sm:inline">Filters</span>
            </button>
            <div className="hidden shrink-0 items-center gap-2 lg:flex">{selects}</div>
          </div>
          {showFilters && <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3 lg:hidden">{selects}</div>}
        </div>
      </div>

      {/* Results */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-12 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <p className="text-sm text-stone-600 dark:text-stone-400" aria-live="polite">
            {isLoading ? (
              'Finding restaurants…'
            ) : (
              <>
                <span className="font-semibold text-stone-900 dark:text-white">{filteredRestaurants.length}</span> restaurant
                {filteredRestaurants.length !== 1 ? 's' : ''} found
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
          ) : filteredRestaurants.length > 0 ? (
            filteredRestaurants.map((restaurant, index) => (
              <RestaurantCard key={restaurant._id} restaurant={restaurant} index={index} />
            ))
          ) : (
            <EmptyState
              icon={UtensilsCrossed}
              title="No restaurants match your search"
              description="Try another cuisine or city, or clear your filters to see everything."
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
