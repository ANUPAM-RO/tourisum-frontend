'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Search, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useStates } from '@/lib/hooks';

export default function StatesPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: statesData, isLoading } = useStates({ limit: 50 });
  const states = statesData?.data || [];

  const filteredStates = states.filter((state: any) =>
    state.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    state.capital?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="pt-20">
      {/* Header */}
      <section className="relative h-64 md:h-80 bg-gradient-to-br from-blue-600 to-emerald-600 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 text-center text-white px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Explore Indian States
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-white/90 mb-8"
          >
            Discover the diversity of India through its unique states
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-md mx-auto"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search states..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 bg-white text-gray-900 rounded-xl"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* States Grid */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredStates.map((state: any, index: number) => (
                <motion.div
                  key={state._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link href={`/states/${state.slug}`}>
                    <Card className="card-hover border-0 overflow-hidden group cursor-pointer h-full bg-white dark:bg-gray-800/50 shadow-sm hover:shadow-xl">
                      <div className="relative h-40 overflow-hidden">
                        <img
                          src={state.image || 'https://images.unsplash.com/photo-1558431460-98e7b2e29894?w=800'}
                          alt={state.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-3 left-3 text-white">
                          <h3 className="text-lg font-bold">{state.name}</h3>
                          <div className="flex items-center gap-1 text-sm text-white/80">
                            <MapPin className="h-3 w-3" />
                            {state.capital}
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                          {state.description}
                        </p>
                        <div className="flex justify-between items-center">
                          <Badge variant="secondary">{state.popularPlaces?.length || 0} places</Badge>
                          <ArrowRight className="h-4 w-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          {filteredStates.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <p className="text-gray-500">No states found matching your search</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
