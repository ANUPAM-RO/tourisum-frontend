'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  MapPin,
  Search,
  Star,
  Heart,
  Clock,
  SlidersHorizontal,
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
import { useRestaurants } from '@/lib/hooks';
import { formatRating } from '@/lib/utils';

export default function RestaurantsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [vegNonVeg, setVegNonVeg] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('rating');

  const { data: restaurantsData, isLoading } = useRestaurants({ limit: 50 });
  const restaurants = restaurantsData?.data || [];

  const cuisines = ['All', 'Indian', 'Mughlai', 'Chinese', 'Tibetan', 'South Indian', 'Goan', 'Seafood', 'Continental', 'North Indian', 'Rajasthani', 'Kerala', 'Sweets'];

  const filteredRestaurants = restaurants
    .filter((r: any) => {
      const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.cuisine?.some((c: string) => c.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCity = selectedCity === 'All' || r.address?.includes(selectedCity);
      const matchesCuisine = selectedCuisine === 'All' || r.cuisine?.some((c: string) => c.toLowerCase().includes(selectedCuisine.toLowerCase()));
      const matchesVeg = vegNonVeg === 'All' || r.vegNonVeg === vegNonVeg.toLowerCase();
      return matchesSearch && matchesCity && matchesCuisine && matchesVeg;
    })
    .sort((a: any, b: any) => {
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'cost-low') return (a.averageCost || 0) - (b.averageCost || 0);
      if (sortBy === 'cost-high') return (b.averageCost || 0) - (a.averageCost || 0);
      return 0;
    });

  return (
    <div className="pt-20">
      {/* Header */}
      <section className="relative h-64 md:h-80 bg-gradient-to-br from-orange-600 to-red-700 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 text-center text-white px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Best Restaurants Across India
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-white/90"
          >
            Discover local flavors and fine dining experiences
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
                placeholder="Search restaurants by name or cuisine..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 rounded-xl"
              />
            </div>
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="md:hidden h-12">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <div className={`${showFilters ? 'flex' : 'hidden'} md:flex flex-col md:flex-row gap-4`}>
              <Select value={selectedCity} onValueChange={(v) => v && setSelectedCity(v)}>
                <SelectTrigger className="w-full md:w-36 h-12">
                  <SelectValue placeholder="City" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Cities</SelectItem>
                  <SelectItem value="Jaipur">Jaipur</SelectItem>
                  <SelectItem value="Jodhpur">Jodhpur</SelectItem>
                  <SelectItem value="Kochi">Kochi</SelectItem>
                  <SelectItem value="Munnar">Munnar</SelectItem>
                  <SelectItem value="Goa">Goa</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedCuisine} onValueChange={(v) => v && setSelectedCuisine(v)}>
                <SelectTrigger className="w-full md:w-40 h-12">
                  <SelectValue placeholder="Cuisine" />
                </SelectTrigger>
                <SelectContent>
                  {cuisines.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={vegNonVeg} onValueChange={(v) => v && setVegNonVeg(v)}>
                <SelectTrigger className="w-full md:w-36 h-12">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="veg">Vegetarian</SelectItem>
                  <SelectItem value="non-veg">Non-Veg</SelectItem>
                  <SelectItem value="both">Both</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={(v) => v && setSortBy(v)}>
                <SelectTrigger className="w-full md:w-40 h-12">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="cost-low">Cost: Low to High</SelectItem>
                  <SelectItem value="cost-high">Cost: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-6">
            <p className="text-gray-600 dark:text-gray-400">
              Showing {filteredRestaurants.length} restaurant{filteredRestaurants.length !== 1 ? 's' : ''}
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-96 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRestaurants.map((restaurant: any, index: number) => (
                <motion.div
                  key={restaurant._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link href={`/restaurants/${restaurant.slug}`}>
                    <Card className="card-hover border-0 overflow-hidden group cursor-pointer h-full bg-white dark:bg-gray-800/50 shadow-sm hover:shadow-xl">
                      <div className="relative h-52 overflow-hidden">
                        <img
                          src={restaurant.images?.[0] || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800'}
                          alt={restaurant.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                        <div className="absolute top-4 left-4">
                          <Badge className={
                            restaurant.vegNonVeg === 'veg'
                              ? 'bg-green-500/90 text-white'
                              : restaurant.vegNonVeg === 'non-veg'
                              ? 'bg-red-500/90 text-white'
                              : 'bg-orange-500/90 text-white'
                          }>
                            {restaurant.vegNonVeg === 'veg' ? 'Pure Veg' : restaurant.vegNonVeg === 'non-veg' ? 'Non-Veg' : 'Veg & Non-Veg'}
                          </Badge>
                        </div>

                        <div className="absolute top-4 right-4">
                          <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-lg">
                            <Heart className="h-4 w-4 text-gray-700" />
                          </button>
                        </div>

                        <div className="absolute bottom-4 left-4 text-white">
                          <h3 className="text-xl font-bold mb-1">{restaurant.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-white/80">
                            <MapPin className="h-4 w-4" />
                            {restaurant.distance || restaurant.address}
                          </div>
                        </div>
                      </div>

                      <CardContent className="p-5">
                        <div className="flex flex-wrap gap-2 mb-3">
                          {Array.from(new Set(restaurant.cuisine)).slice(0, 3).map((c: any) => (
                            <Badge key={c} variant="secondary" className="text-xs">
                              {c}
                            </Badge>
                          ))}
                        </div>

                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                          {restaurant.description}
                        </p>

                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                          <Clock className="h-4 w-4" />
                          <span>{restaurant.openingTime} - {restaurant.closingTime}</span>
                        </div>

                        <div className="flex justify-between items-center pt-3 border-t dark:border-gray-700">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{formatRating(restaurant.rating)}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs text-gray-500">Avg cost</span>
                            <p className="font-bold text-emerald-600">₹{restaurant.averageCost || 0}<span className="text-sm text-gray-500 font-normal">/person</span></p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          {filteredRestaurants.length === 0 && !isLoading && (
            <div className="text-center py-16">
              <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No restaurants found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
