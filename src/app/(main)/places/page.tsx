'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  MapPin,
  Search,
  Star,
  Heart,
  ArrowRight,
  Filter,
  SlidersHorizontal,
  Clock,
  Calendar,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { usePlaces, useStates } from '@/lib/hooks';

const categories = ['All', 'Hill Station', 'Beach', 'Heritage', 'Wildlife', 'Religious', 'Adventure', 'Honeymoon', 'Family Trip'];

export default function PlacesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedState, setSelectedState] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  const { data: placesData, isLoading: placesLoading } = usePlaces({ limit: 50 });
  const { data: statesData } = useStates({ limit: 50 });

  const places = placesData?.data || [];
  const states = statesData?.data || [];

  const filteredPlaces = places.filter((place: any) => {
    const matchesSearch = place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || place.category?.includes(selectedCategory);
    const matchesState = selectedState === 'All' || place.state?.name === selectedState || place.state?.slug === selectedState;
    return matchesSearch && matchesCategory && matchesState;
  });

  return (
    <div className="pt-20">
      {/* Header */}
      <section className="relative h-64 md:h-80 bg-gradient-to-br from-emerald-600 to-blue-600 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 text-center text-white px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Tourist Destinations
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-white/90"
          >
            Explore India's most beautiful places
          </motion.p>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="sticky top-16 md:top-20 z-40 bg-white dark:bg-gray-950 border-b dark:border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search places..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 rounded-xl"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden h-12"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <div className={`${showFilters ? 'flex' : 'hidden'} md:flex flex-col md:flex-row gap-4`}>
              <Select value={selectedCategory} onValueChange={(v) => v && setSelectedCategory(v)}>
                <SelectTrigger className="w-full md:w-48 h-12">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedState} onValueChange={(v) => v && setSelectedState(v)}>
                <SelectTrigger className="w-full md:w-48 h-12">
                  <SelectValue placeholder="State" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All States</SelectItem>
                  {states.map((state: any) => (
                    <SelectItem key={state._id} value={state.name}>{state.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Places Grid */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-6">
            <p className="text-gray-600 dark:text-gray-400">
              Showing {filteredPlaces.length} destination{filteredPlaces.length !== 1 ? 's' : ''}
            </p>
          </div>

          {placesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-96 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlaces.map((place: any, index: number) => (
                <motion.div
                  key={place._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link href={`/places/${place.slug}`}>
                    <Card className="card-hover border-0 overflow-hidden group cursor-pointer h-full bg-white dark:bg-gray-800/50 shadow-sm hover:shadow-xl">
                      <div className="relative h-56 overflow-hidden">
                        <img
                          src={place.images?.[0] || 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800'}
                          alt={place.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute top-4 left-4 flex gap-2">
                          {place.category?.slice(0, 2).map((cat: string) => (
                            <Badge key={cat} className="bg-white/90 text-gray-900">
                              {cat}
                            </Badge>
                          ))}
                        </div>
                        <button className="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
                          <Heart className="h-4 w-4" />
                        </button>
                        <div className="absolute bottom-4 left-4 text-white">
                          <h3 className="text-xl font-bold">{place.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-white/80">
                            <MapPin className="h-4 w-4" />
                            {typeof place.city === 'object' ? place.city?.name : ''}{typeof place.state === 'object' && place.state?.name ? `, ${place.state.name}` : ''}
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                          {place.description}
                        </p>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{place.rating || '4.5'}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-sm text-gray-500">Entry</span>
                            <p className="font-bold text-blue-600">{place.entryFee || 'Free'}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          {filteredPlaces.length === 0 && !placesLoading && (
            <div className="text-center py-16">
              <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No places found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
