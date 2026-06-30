'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, MapPin, Star, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';

const favoritePlaces = [
  { name: 'Taj Mahal', slug: 'taj-mahal', location: 'Agra, UP', image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800', rating: 4.9, category: ['Heritage'], entryFee: '₹50' },
  { name: 'Dal Lake', slug: 'dal-lake', location: 'Srinagar, JK', image: 'https://images.unsplash.com/photo-1597074836924-8e13c0e81655?w=800', rating: 4.8, category: ['Hill Station'], entryFee: 'Free' },
  { name: 'Goa Beaches', slug: 'goa-beaches', location: 'Goa', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800', rating: 4.6, category: ['Beach'], entryFee: 'Free' },
];

export default function FavoritesPage() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Please login to view favorites</h2>
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
          <p className="text-white/90">{favoritePlaces.length} saved destinations</p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoritePlaces.map((place, index) => (
              <motion.div
                key={place.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="card-hover border-0 overflow-hidden group">
                  <div className="relative h-52 overflow-hidden">
                    <img src={place.image} alt={place.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-4 left-4 flex gap-2">
                      {place.category.map((cat) => (
                        <Badge key={cat} className="bg-white/90 text-gray-900">{cat}</Badge>
                      ))}
                    </div>
                    <button className="absolute top-4 right-4 p-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors text-white">
                      <Trash2 className="h-4 w-4" />
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
                      <Link href={`/places/${place.slug}`}>
                        <Button size="sm">View Details</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {favoritePlaces.length === 0 && (
            <div className="text-center py-16">
              <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No favorites yet</h3>
              <p className="text-gray-500 mb-4">Start exploring and save your favorite destinations</p>
              <Link href="/places">
                <Button>Explore Places</Button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
