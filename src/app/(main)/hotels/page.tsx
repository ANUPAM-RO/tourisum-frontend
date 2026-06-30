'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  MapPin,
  Search,
  Star,
  Heart,
  SlidersHorizontal,
  Wifi,
  Car,
  Coffee,
  Waves,
  Dumbbell,
  UtensilsCrossed,
  Plane,
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
import { useHotels } from '@/lib/hooks';

const amenityIcons: Record<string, React.ReactNode> = {
  'Free WiFi': <Wifi className="h-3 w-3" />,
  'Parking': <Car className="h-3 w-3" />,
  'Breakfast': <Coffee className="h-3 w-3" />,
  'Swimming Pool': <Waves className="h-3 w-3" />,
  'Gym': <Dumbbell className="h-3 w-3" />,
  'Spa': <Waves className="h-3 w-3" />,
  'Restaurant': <UtensilsCrossed className="h-3 w-3" />,
  'Airport Shuttle': <Plane className="h-3 w-3" />,
};

export default function HotelsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [sortBy, setSortBy] = useState('rating');
  const [showFilters, setShowFilters] = useState(false);

  const { data: hotelsData, isLoading } = useHotels({ limit: 50 });
  const hotels = hotelsData?.data || [];

  const filteredHotels = hotels
    .filter((hotel: any) => {
      const matchesSearch = hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hotel.address?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCity = selectedCity === 'All' || hotel.address?.includes(selectedCity);
      const matchesPrice = hotel.pricePerNight >= priceRange[0] && hotel.pricePerNight <= priceRange[1];
      return matchesSearch && matchesCity && matchesPrice;
    })
    .sort((a: any, b: any) => {
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'price-low') return (a.pricePerNight || 0) - (b.pricePerNight || 0);
      if (sortBy === 'price-high') return (b.pricePerNight || 0) - (a.pricePerNight || 0);
      if (sortBy === 'stars') return (b.starRating || 0) - (a.starRating || 0);
      return 0;
    });

  return (
    <div className="pt-20">
      {/* Header */}
      <section className="relative h-64 md:h-80 bg-gradient-to-br from-blue-700 to-indigo-800 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 text-center text-white px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Find Your Perfect Stay
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-white/90"
          >
            Discover hotels across India for every budget
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
                placeholder="Search hotels by name or location..."
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
                <SelectTrigger className="w-full md:w-40 h-12">
                  <SelectValue placeholder="City" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Cities</SelectItem>
                  <SelectItem value="Jaipur">Jaipur</SelectItem>
                  <SelectItem value="Jodhpur">Jodhpur</SelectItem>
                  <SelectItem value="Kochi">Kochi</SelectItem>
                  <SelectItem value="Munnar">Munnar</SelectItem>
                  <SelectItem value="Panaji">Panaji</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={(v) => v && setSortBy(v)}>
                <SelectTrigger className="w-full md:w-40 h-12">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="stars">Most Stars</SelectItem>
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
              Showing {filteredHotels.length} hotel{filteredHotels.length !== 1 ? 's' : ''}
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
              {filteredHotels.map((hotel: any, index: number) => (
                <motion.div
                  key={hotel._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link href={`/hotels/${hotel.slug}`}>
                    <Card className="card-hover border-0 overflow-hidden group cursor-pointer h-full bg-white dark:bg-gray-800/50 shadow-sm hover:shadow-xl">
                      <div className="relative h-56 overflow-hidden">
                        <img
                          src={hotel.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'}
                          alt={hotel.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                        <div className="absolute top-4 left-4 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                          {[...Array(hotel.starRating || 0)].map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>

                        <div className="absolute top-4 right-4">
                          <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-lg">
                            <Heart className="h-4 w-4 text-gray-700" />
                          </button>
                        </div>

                        <div className="absolute bottom-4 left-4 text-white">
                          <h3 className="text-xl font-bold mb-1">{hotel.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-white/80">
                            <MapPin className="h-4 w-4" />
                            {hotel.distance || hotel.address}
                          </div>
                        </div>
                      </div>

                      <CardContent className="p-5">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                          {hotel.description}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {hotel.amenities?.slice(0, 4).map((amenity: string) => (
                            <Badge key={amenity} variant="secondary" className="text-xs flex items-center gap-1">
                              {amenityIcons[amenity]}
                              {amenity}
                            </Badge>
                          ))}
                          {hotel.amenities?.length > 4 && (
                            <Badge variant="secondary" className="text-xs">
                              +{hotel.amenities.length - 4} more
                            </Badge>
                          )}
                        </div>

                        <div className="flex justify-between items-center pt-3 border-t dark:border-gray-700">
                          <div>
                            <span className="text-xs text-gray-500">From</span>
                            <p className="text-xl font-bold text-blue-600">₹{(hotel.pricePerNight || 0).toLocaleString()}<span className="text-sm text-gray-500 font-normal">/night</span></p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{hotel.rating || '4.5'}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          {filteredHotels.length === 0 && !isLoading && (
            <div className="text-center py-16">
              <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No hotels found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
