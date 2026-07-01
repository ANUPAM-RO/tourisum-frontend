'use client';

import React, { useState, Suspense, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Search,
  MapPin,
  Star,
  Heart,
  Filter,
  SlidersHorizontal,
  Clock,
  Eye,
  ArrowRight,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { usePlaces, useStates, useCategories, useToggleFavorite } from '@/lib/hooks';
import { formatRating, cn } from '@/lib/utils';

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="pt-20 min-h-screen flex items-center justify-center">Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [selectedState, setSelectedState] = useState(searchParams.get('state') || 'All');
  const [minRating, setMinRating] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 12;

  const { data: placesData, isLoading: placesLoading } = usePlaces({
    page,
    limit,
    category: selectedCategory !== 'All' ? selectedCategory : undefined,
    state: selectedState !== 'All' ? selectedState : undefined,
    search: searchQuery || undefined,
    minRating: minRating > 0 ? minRating : undefined,
  });

  const { data: statesData } = useStates({ limit: 50 });
  const { data: categoriesData } = useCategories();
  const { isFavorite, toggle } = useToggleFavorite();

  const places = placesData?.data || [];
  const states = statesData?.data || [];
  const categories = categoriesData?.data?.map((c) => c.name) || [];

  const handleFilterChange = (type: string, value: string) => {
    setPage(1);
    const params = new URLSearchParams(searchParams.toString());
    if (type === 'q' && value) params.set('q', value);
    else if (type === 'q') params.delete('q');
    if (type === 'category' && value !== 'All') params.set('category', value);
    else if (type === 'category') params.delete('category');
    if (type === 'state' && value !== 'All') params.set('state', value);
    else if (type === 'state') params.delete('state');
    router.push(`/search?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    handleFilterChange('q', searchQuery);
  };

  return (
    <div className="pt-20">
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-600 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold text-white mb-6"
          >
            {selectedCategory !== 'All' ? `${selectedCategory} Destinations` : 'Search Destinations'}
          </motion.h1>
          <div className="flex flex-col md:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by destination, state, city, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 bg-white rounded-xl text-lg"
              />
            </form>
            <Button
              variant="secondary"
              onClick={() => setShowFilters(!showFilters)}
              className="h-14 px-6 md:hidden"
            >
              <SlidersHorizontal className="h-5 w-5 mr-2" />
              Filters
            </Button>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className={`${showFilters ? 'block' : 'hidden'} md:block bg-white dark:bg-gray-950 border-b dark:border-gray-800`}>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5" />
            <h3 className="font-semibold">Filters</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              value={selectedCategory}
              onValueChange={(v) => {
                if (!v) return;
                setSelectedCategory(v);
                handleFilterChange('category', v);
              }}
            >
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={selectedState}
              onValueChange={(v) => {
                if (!v) return;
                setSelectedState(v);
                handleFilterChange('state', v);
              }}
            >
              <SelectTrigger className="h-12">
                <SelectValue placeholder="State" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All States</SelectItem>
                {states.map((state: any) => (
                  <SelectItem key={state._id} value={state.name}>{state.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-500 mb-2">Min Rating: {minRating}+</p>
              <input
                type="range"
                min="0"
                max="5"
                step="0.5"
                value={minRating}
                onChange={(e) => setMinRating(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-6">
            <p className="text-gray-600 dark:text-gray-400">
              Found {places.length} destination{places.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {placesLoading ? [...Array(6)].map((_, index) => (
              <div key={index} className="h-96 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />
            )) : places.map((place: any, index: number) => (
              <motion.div
                key={place._id || place.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={`/places/${place.slug}`}>
                  <Card className="card-hover border-0 overflow-hidden group cursor-pointer h-full bg-white dark:bg-gray-800/50 shadow-sm hover:shadow-xl">
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={place.images?.[0] || place.image}
                        alt={place.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                        {place.category?.slice(0, 2).map((cat: string) => (
                          <Badge key={cat} className="bg-white/90 text-gray-900">
                            {cat}
                          </Badge>
                        ))}
                        {place.entryFee?.toLowerCase().includes('free') && (
                          <Badge className="bg-emerald-500/90 text-white">
                            Free Entry
                          </Badge>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(place._id); }}
                        className="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                        aria-label={isFavorite(place._id) ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        <Heart className={cn('h-4 w-4', isFavorite(place._id) && 'fill-red-500 text-red-500')} />
                      </button>
                      <div className="absolute bottom-4 left-4 text-white">
                        <h3 className="text-xl font-bold">{place.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-white/80">
                          <MapPin className="h-4 w-4" />
                          {typeof place.city === 'object' ? place.city?.name : ''}{typeof place.state === 'object' && place.state?.name ? `, ${place.state.name}` : ''}
                        </div>
                      </div>
                      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-semibold text-gray-900">{formatRating(place.rating)}</span>
                      </div>
                    </div>
                    <CardContent className="p-5">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {place.bestTimeToVisit || 'Year-round'}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t dark:border-gray-700">
                        <div>
                          <span className="text-xs text-gray-500">Entry from</span>
                          <p className="font-bold text-blue-600 text-lg">{place.entryFee || 'Free'}</p>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Eye className="h-4 w-4" />
                          {place.reviews?.length || 0} reviews
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>

          {places.length === 0 && !placesLoading && (
            <div className="text-center py-16">
              <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No destinations found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          )}

          {placesData?.pagination && placesData.pagination.pages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              {Array.from({ length: placesData.pagination.pages }, (_, i) => i + 1).map((p) => (
                <Button
                  key={p}
                  variant={p === page ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPage(p)}
                  className={p === page ? 'bg-blue-600 hover:bg-blue-700' : ''}
                >
                  {p}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(placesData.pagination!.pages, p + 1))}
                disabled={page === placesData.pagination!.pages}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
