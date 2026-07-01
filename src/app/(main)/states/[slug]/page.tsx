'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  MapPin,
  Sun,
  Cloud,
  Droplets,
  Star,
  ArrowRight,
  Calendar,
  Languages,
  Phone,
  Heart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InteractiveMap, MapMarker } from '@/components/map';
import { createCityMarkers, createPlaceMarkers } from '@/lib/mapHelpers';
import { useStateBySlug, useToggleFavorite } from '@/lib/hooks';
import { formatRating, cn } from '@/lib/utils';

export default function StatePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { data: stateResponse, isLoading } = useStateBySlug(slug);
  const state = stateResponse?.data;
  const { isFavorite, toggle } = useToggleFavorite();

  if (isLoading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading state details...</p>
        </div>
      </div>
    );
  }

  if (!state) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">State not found</h2>
          <Link href="/states">
            <Button>Back to States</Button>
          </Link>
        </div>
      </div>
    );
  }

  const cities = Array.isArray(state.popularCities) ? state.popularCities : [];
  const places = Array.isArray(state.popularPlaces) ? state.popularPlaces : [];

  const mapMarkers: MapMarker[] = [
    ...createCityMarkers(cities),
    ...createPlaceMarkers(places),
  ];

  const mapCenter: [number, number] =
    cities.length > 0 && cities[0].location?.latitude && cities[0].location?.longitude
      ? [cities[0].location.latitude, cities[0].location.longitude]
      : [20.5937, 78.9629];

  return (
    <div className="pt-20">
      {/* Hero Banner */}
      <section className="relative h-[500px] md:h-[600px]">
        <img src={state.image} alt={state.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Badge className="mb-4 bg-white/20 text-white backdrop-blur-sm">
              <MapPin className="h-3 w-3 mr-1" />
              Capital: {state.capital}
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{state.name}</h1>
            <p className="text-white/90 max-w-2xl text-lg">{state.description}</p>
          </motion.div>
        </div>
      </section>

      {/* Quick Info */}
      {state.weather && (
        <section className="bg-white dark:bg-gray-950 border-b dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {state.weather.summer && (
                <div className="text-center">
                  <Sun className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Summer</p>
                  <p className="font-semibold">{state.weather.summer}</p>
                </div>
              )}
              {state.weather.winter && (
                <div className="text-center">
                  <Cloud className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Winter</p>
                  <p className="font-semibold">{state.weather.winter}</p>
                </div>
              )}
              {state.weather.monsoon && (
                <div className="text-center">
                  <Droplets className="h-8 w-8 text-cyan-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Monsoon</p>
                  <p className="font-semibold">{state.weather.monsoon}</p>
                </div>
              )}
              {state.bestTimeToVisit && (
                <div className="text-center">
                  <Calendar className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Best Time</p>
                  <p className="font-semibold">{state.bestTimeToVisit}</p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Tabs Content */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <Tabs defaultValue="cities" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="cities">Popular Cities</TabsTrigger>
              <TabsTrigger value="places">Tourist Places</TabsTrigger>
              <TabsTrigger value="info">Travel Info</TabsTrigger>
            </TabsList>

            <TabsContent value="cities">
              {cities.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {cities.map((city: any, index: number) => (
                    <motion.div
                      key={city._id || city.slug}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link href={`/cities/${city.slug}`}>
                        <Card className="card-hover border-0 overflow-hidden group cursor-pointer">
                          <div className="relative h-40 overflow-hidden">
                            <img
                              src={city.image}
                              alt={city.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-3 left-3 text-white">
                              <h3 className="text-lg font-bold">{city.name}</h3>
                            </div>
                          </div>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-center">
                              <Badge variant="secondary">
                                {Array.isArray(city.popularPlaces) ? city.popularPlaces.length : 0} places
                              </Badge>
                              <ArrowRight className="h-4 w-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">No cities available for this state yet.</div>
              )}
            </TabsContent>

            <TabsContent value="places">
              {places.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {places.map((place: any, index: number) => (
                    <motion.div
                      key={place._id || place.slug}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link href={`/places/${place.slug}`}>
                        <Card className="card-hover border-0 overflow-hidden group cursor-pointer h-full">
                          <div className="relative h-48 overflow-hidden">
                            <img
                              src={place.images?.[0] || place.image}
                              alt={place.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            {place.category && (
                              <Badge className="absolute top-4 left-4 bg-white/90 text-gray-900">
                                {Array.isArray(place.category) ? place.category[0] : place.category}
                              </Badge>
                            )}
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
                                {typeof place.city === 'object' ? place.city?.name : ''}
                              </div>
                            </div>
                          </div>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="font-medium">{formatRating(place.rating)}</span>
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
              ) : (
                <div className="text-center py-12 text-gray-500">No tourist places available for this state yet.</div>
              )}
            </TabsContent>

            <TabsContent value="info">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="border-0">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Languages className="h-5 w-5 text-blue-600" />
                      Local Information
                    </h3>
                    <div className="space-y-4">
                      {state.localLanguage && (
                        <div>
                          <p className="text-sm text-gray-500">Local Language</p>
                          <p className="font-medium">{state.localLanguage}</p>
                        </div>
                      )}
                      {state.bestTimeToVisit && (
                        <div>
                          <p className="text-sm text-gray-500">Best Time to Visit</p>
                          <p className="font-medium">{state.bestTimeToVisit}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-sm text-gray-500">Capital</p>
                        <p className="font-medium">{state.capital}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {state.emergencyNumbers && (
                  <Card className="border-0">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Phone className="h-5 w-5 text-red-600" />
                        Emergency Numbers
                      </h3>
                      <div className="space-y-4">
                        {state.emergencyNumbers.police && (
                          <div className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                            <span>Police</span>
                            <span className="font-bold text-red-600">{state.emergencyNumbers.police}</span>
                          </div>
                        )}
                        {state.emergencyNumbers.ambulance && (
                          <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <span>Ambulance</span>
                            <span className="font-bold text-blue-600">{state.emergencyNumbers.ambulance}</span>
                          </div>
                        )}
                        {state.emergencyNumbers.fire && (
                          <div className="flex justify-between items-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                            <span>Fire</span>
                            <span className="font-bold text-orange-600">{state.emergencyNumbers.fire}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {state.weather && (
                <Card className="border-0 mt-8">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4">Weather Overview</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {state.weather.summer && (
                        <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
                          <Sun className="h-8 w-8 text-orange-500 mb-2" />
                          <h4 className="font-semibold mb-1">Summer</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{state.weather.summer}</p>
                        </div>
                      )}
                      {state.weather.winter && (
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                          <Cloud className="h-8 w-8 text-blue-500 mb-2" />
                          <h4 className="font-semibold mb-1">Winter</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{state.weather.winter}</p>
                        </div>
                      )}
                      {state.weather.monsoon && (
                        <div className="p-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-xl">
                          <Droplets className="h-8 w-8 text-cyan-500 mb-2" />
                          <h4 className="font-semibold mb-1">Monsoon</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{state.weather.monsoon}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Map Section */}
      {mapMarkers.length > 0 && (
        <section className="py-12 bg-white dark:bg-gray-950">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold mb-2">Explore on Map</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {mapMarkers.length} cities and tourist places in {state.name}
            </p>
            <InteractiveMap
              center={mapCenter}
              zoom={8}
              markers={mapMarkers}
              height="500px"
              showLegend={true}
            />
          </div>
        </section>
      )}
    </div>
  );
}
