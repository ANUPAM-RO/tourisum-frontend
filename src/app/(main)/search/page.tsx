'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Search,
  MapPin,
  Star,
  Heart,
  Filter,
  SlidersHorizontal,
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
import { Slider } from '@/components/ui/slider';

const allPlaces = [
  { name: 'Taj Mahal', slug: 'taj-mahal', location: 'Agra, UP', state: 'Uttar Pradesh', city: 'Agra', image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800', rating: 4.9, category: ['Heritage'], entryFee: '₹50', budget: 2500 },
  { name: 'Victoria Memorial', slug: 'victoria-memorial', location: 'Kolkata, WB', state: 'West Bengal', city: 'Kolkata', image: 'https://images.unsplash.com/photo-1558431460-98e7b2e29894?w=800', rating: 4.7, category: ['Heritage'], entryFee: '₹30', budget: 2000 },
  { name: 'Dal Lake', slug: 'dal-lake', location: 'Srinagar, JK', state: 'Jammu & Kashmir', city: 'Srinagar', image: 'https://images.unsplash.com/photo-1597074836924-8e13c0e81655?w=800', rating: 4.8, category: ['Hill Station', 'Honeymoon'], entryFee: 'Free', budget: 5000 },
  { name: 'Goa Beaches', slug: 'goa-beaches', location: 'Goa', state: 'Goa', city: 'Panaji', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800', rating: 4.6, category: ['Beach', 'Honeymoon'], entryFee: 'Free', budget: 4000 },
  { name: 'Munnar', slug: 'munnar', location: 'Kerala', state: 'Kerala', city: 'Munnar', image: 'https://images.unsplash.com/photo-1593693411515-c20261bcad6e?w=800', rating: 4.7, category: ['Hill Station', 'Family Trip'], entryFee: 'Free', budget: 3500 },
  { name: 'Jaipur Forts', slug: 'jaipur-forts', location: 'Jaipur, RJ', state: 'Rajasthan', city: 'Jaipur', image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800', rating: 4.8, category: ['Heritage', 'Family Trip'], entryFee: '₹200', budget: 3000 },
  { name: 'Sundarbans', slug: 'sundarbans', location: 'West Bengal', state: 'West Bengal', city: 'Canning', image: 'https://images.unsplash.com/photo-1593693411515-c20261bcad6e?w=800', rating: 4.6, category: ['Wildlife', 'Adventure'], entryFee: '₹100', budget: 4500 },
  { name: 'Rishikesh', slug: 'rishikesh', location: 'Uttarakhand', state: 'Uttarakhand', city: 'Rishikesh', image: 'https://images.unsplash.com/photo-1593693411515-c20261bcad6e?w=800', rating: 4.6, category: ['Religious', 'Adventure'], entryFee: 'Free', budget: 3000 },
];

const categories = ['All', 'Hill Station', 'Beach', 'Heritage', 'Wildlife', 'Religious', 'Adventure', 'Honeymoon', 'Family Trip'];
const states = ['All', 'West Bengal', 'Rajasthan', 'Kerala', 'Goa', 'Uttar Pradesh', 'Karnataka', 'Tamil Nadu', 'Himachal Pradesh', 'Uttarakhand'];
const durations = ['All', '1-2 Days', '3-4 Days', '5-7 Days', '7+ Days'];

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="pt-20 min-h-screen flex items-center justify-center">Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}

function SearchContent() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [selectedState, setSelectedState] = useState(searchParams.get('state') || 'All');
  const [selectedDuration, setSelectedDuration] = useState('All');
  const [budgetRange, setBudgetRange] = useState([0, 10000]);
  const [minRating, setMinRating] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const filteredPlaces = allPlaces.filter((place) => {
    const matchesSearch = place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.state.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || place.category.includes(selectedCategory);
    const matchesState = selectedState === 'All' || place.state === selectedState;
    const matchesBudget = place.budget >= budgetRange[0] && place.budget <= budgetRange[1];
    const matchesRating = place.rating >= minRating;
    return matchesSearch && matchesCategory && matchesState && matchesBudget && matchesRating;
  });

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
            Search Destinations
          </motion.h1>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by destination, state, city, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 bg-white rounded-xl text-lg"
              />
            </div>
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={selectedCategory} onValueChange={(v) => v && setSelectedCategory(v)}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedState} onValueChange={(v) => v && setSelectedState(v)}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="State" />
              </SelectTrigger>
              <SelectContent>
                {states.map((state) => (
                  <SelectItem key={state} value={state}>{state}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedDuration} onValueChange={(v) => v && setSelectedDuration(v)}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Duration" />
              </SelectTrigger>
              <SelectContent>
                {durations.map((duration) => (
                  <SelectItem key={duration} value={duration}>{duration}</SelectItem>
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
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-500 mb-2">Budget Range: ₹{budgetRange[0]} - ₹{budgetRange[1]}</p>
            <input
              type="range"
              min="0"
              max="10000"
              step="500"
              value={budgetRange[1]}
              onChange={(e) => setBudgetRange([budgetRange[0], parseInt(e.target.value)])}
              className="w-full"
            />
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-6">
            <p className="text-gray-600 dark:text-gray-400">
              Found {filteredPlaces.length} destination{filteredPlaces.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlaces.map((place, index) => (
              <motion.div
                key={place.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={`/places/${place.slug}`}>
                  <Card className="card-hover border-0 overflow-hidden group cursor-pointer h-full">
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={place.image}
                        alt={place.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                        {place.category.slice(0, 2).map((cat) => (
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
                          {place.location}
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{place.rating}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm text-gray-500">Est. Budget</span>
                          <p className="font-bold text-blue-600">₹{place.budget}/day</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>

          {filteredPlaces.length === 0 && (
            <div className="text-center py-16">
              <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No destinations found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
