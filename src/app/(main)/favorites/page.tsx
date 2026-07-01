'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, MapPin, Star, Trash2, Clock, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { useFavorites, useToggleFavorite } from '@/lib/hooks';
import { formatRating } from '@/lib/utils';

export default function FavoritesPage() {
  const { isAuthenticated } = useAuth();
  const { data, isLoading } = useFavorites(isAuthenticated);
  const { toggle } = useToggleFavorite();

  const favoritePlaces: any[] = data?.data || [];

  if (!isAuthenticated) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Please login to view favorites</h2>
          <p className="text-gray-500 mb-6">Save your favorite destinations and access them anytime</p>
          <Link href="/auth/login">
            <Button>Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-50 dark:bg-gray-900">
      <section className="bg-gradient-to-br from-pink-600 to-red-600 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-white">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-4xl font-bold mb-2">
            My Favorites
          </motion.h1>
          <p className="text-white/90">{favoritePlaces.length} saved destination{favoritePlaces.length !== 1 ? 's' : ''}</p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="h-80 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              {favoritePlaces.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favoritePlaces.map((place, index) => (
                    <motion.div
                      key={place._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="card-hover border-0 overflow-hidden group bg-white dark:bg-gray-800/50 shadow-sm hover:shadow-xl">
                        <div className="relative h-64 overflow-hidden">
                          <img src={place.images?.[0] || place.image} alt={place.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                            {(place.category || []).slice(0, 2).map((cat: string) => (
                              <Badge key={cat} className="bg-white/90 text-gray-900">{cat}</Badge>
                            ))}
                            {place.entryFee?.toLowerCase().includes('free') && (
                              <Badge className="bg-emerald-500/90 text-white">Free Entry</Badge>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => toggle(place._id)}
                            className="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                            aria-label="Remove from favorites"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
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
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No favorites yet</h3>
                  <p className="text-gray-500 mb-4">Start exploring and save your favorite destinations</p>
                  <Link href="/places">
                    <Button>Explore Places</Button>
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
