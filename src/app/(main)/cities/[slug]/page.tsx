'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  MapPin,
  Star,
  Heart,
  ArrowRight,
  Plane,
  Train,
  Bus,
  UtensilsCrossed,
  Wallet,
  Clock,
  Sun,
  Cloud,
  Droplets,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InteractiveMap, MapMarker } from '@/components/map';
import {
  createPlaceMarkers,
  createHotelMarkers,
  createRestaurantMarkers,
} from '@/lib/mapHelpers';
import { useCityBySlug } from '@/lib/hooks';

export default function CityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { data: cityResponse, isLoading } = useCityBySlug(slug);
  const city = cityResponse?.data;

  if (isLoading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading city details...</p>
        </div>
      </div>
    );
  }

  if (!city) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">City not found</h2>
          <Link href="/states">
            <Button>Back to States</Button>
          </Link>
        </div>
      </div>
    );
  }

  const places = Array.isArray(city.popularPlaces) ? city.popularPlaces : [];
  const hotels = Array.isArray(city.hotels) ? city.hotels : [];
  const restaurants = Array.isArray(city.restaurants) ? city.restaurants : [];

  const mapMarkers: MapMarker[] = [
    ...createPlaceMarkers(places),
    ...createHotelMarkers(hotels),
    ...createRestaurantMarkers(restaurants),
  ];

  const mapCenter: [number, number] =
    city.location?.latitude && city.location?.longitude
      ? [city.location.latitude, city.location.longitude]
      : [20.5937, 78.9629];

  const stateName = typeof city.state === 'object' ? city.state?.name : '';

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative h-[500px] md:h-[600px]">
        <img src={city.image} alt={city.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Badge className="mb-4 bg-white/20 text-white backdrop-blur-sm">
              <MapPin className="h-3 w-3 mr-1" />
              {stateName}
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{city.name}</h1>
            <p className="text-white/90 max-w-2xl text-lg">{city.description}</p>
          </motion.div>
        </div>
      </section>

      {/* Quick Info */}
      {city.weather && (
        <section className="bg-white dark:bg-gray-950 border-b dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {city.weather.summer && (
                <div className="text-center">
                  <Sun className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Summer</p>
                  <p className="font-semibold">{city.weather.summer}</p>
                </div>
              )}
              {city.weather.winter && (
                <div className="text-center">
                  <Cloud className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Winter</p>
                  <p className="font-semibold">{city.weather.winter}</p>
                </div>
              )}
              {city.weather.monsoon && (
                <div className="text-center">
                  <Droplets className="h-8 w-8 text-cyan-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Monsoon</p>
                  <p className="font-semibold">{city.weather.monsoon}</p>
                </div>
              )}
              {city.bestTimeToVisit && (
                <div className="text-center">
                  <Clock className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Best Time</p>
                  <p className="font-semibold text-sm">{city.bestTimeToVisit}</p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <Tabs defaultValue="places" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-8">
              <TabsTrigger value="places">Places</TabsTrigger>
              <TabsTrigger value="hotels">Hotels</TabsTrigger>
              <TabsTrigger value="restaurants">Restaurants</TabsTrigger>
              <TabsTrigger value="transport">Transport</TabsTrigger>
              <TabsTrigger value="budget">Budget</TabsTrigger>
            </TabsList>

            <TabsContent value="places">
              {places.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {places.map((place: any, index: number) => (
                    <motion.div
                      key={place._id || place.slug}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link href={`/places/${place.slug}`}>
                        <Card className="card-hover border-0 overflow-hidden group cursor-pointer">
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
                            <div className="absolute bottom-4 left-4 text-white">
                              <h3 className="text-lg font-bold">{place.name}</h3>
                            </div>
                          </div>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="font-medium">{place.rating || '4.5'}</span>
                              </div>
                              <p className="font-bold text-blue-600">{place.entryFee || 'Free'}</p>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">No tourist places available for this city yet.</div>
              )}
            </TabsContent>

            <TabsContent value="hotels">
              {hotels.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {hotels.map((hotel: any, index: number) => (
                    <Card key={hotel._id || index} className="card-hover border-0 overflow-hidden">
                      <div className="relative h-48">
                        <img
                          src={hotel.images?.[0] || hotel.image}
                          alt={hotel.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-bold mb-1">{hotel.name}</h3>
                        <div className="flex items-center gap-1 mb-2">
                          {[...Array(hotel.starRating || 0)].map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <p className="text-sm text-gray-500 mb-2">{hotel.address}{hotel.distance ? ` • ${hotel.distance}` : ''}</p>
                        {hotel.amenities && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {hotel.amenities.slice(0, 3).map((a: string) => (
                              <Badge key={a} variant="secondary" className="text-xs">{a}</Badge>
                            ))}
                          </div>
                        )}
                        <div className="flex justify-between items-center">
                          <p className="text-lg font-bold text-blue-600">
                            ₹{hotel.pricePerNight || 'N/A'}
                            <span className="text-sm text-gray-500 font-normal">/night</span>
                          </p>
                          <Button size="sm">Book Now</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">No hotels available for this city yet.</div>
              )}
            </TabsContent>

            <TabsContent value="restaurants">
              {restaurants.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {restaurants.map((restaurant: any, index: number) => (
                    <Card key={restaurant._id || index} className="card-hover border-0 overflow-hidden">
                      <div className="relative h-40">
                        <img
                          src={restaurant.images?.[0] || restaurant.image}
                          alt={restaurant.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-bold mb-1">{restaurant.name}</h3>
                        <p className="text-sm text-gray-500 mb-2">{restaurant.cuisine?.join(', ')}</p>
                        <div className="flex items-center gap-2 mb-2">
                          {restaurant.vegNonVeg && (
                            <Badge variant={restaurant.vegNonVeg === 'veg' ? 'default' : 'secondary'}>
                              {restaurant.vegNonVeg}
                            </Badge>
                          )}
                          {restaurant.distance && (
                            <span className="text-sm text-gray-500">{restaurant.distance}</span>
                          )}
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{restaurant.rating || '4.0'}</span>
                          </div>
                          <p className="font-bold text-emerald-600">
                            ₹{restaurant.averageCost || 'N/A'}/person
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">No restaurants available for this city yet.</div>
              )}
            </TabsContent>

            <TabsContent value="transport">
              {city.transportation ? (
                <Card className="border-0">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-6">How to Reach {city.name}</h3>
                    <div className="space-y-4">
                      {city.transportation.nearestAirport?.name && (
                        <div className="flex items-start gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                          <Plane className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                          <div>
                            <h4 className="font-semibold mb-1">By Flight</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Nearest Airport: {city.transportation.nearestAirport.name} ({city.transportation.nearestAirport.distance})
                            </p>
                            <p className="text-sm text-gray-500">Cab Cost: {city.transportation.nearestAirport.cabCost}</p>
                          </div>
                        </div>
                      )}
                      {city.transportation.nearestStation?.name && (
                        <div className="flex items-start gap-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                          <Train className="h-6 w-6 text-emerald-600 flex-shrink-0 mt-1" />
                          <div>
                            <h4 className="font-semibold mb-1">By Train</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Nearest Station: {city.transportation.nearestStation.name} ({city.transportation.nearestStation.distance})
                            </p>
                            <p className="text-sm text-gray-500">Taxi Fare: {city.transportation.nearestStation.taxiFare}</p>
                          </div>
                        </div>
                      )}
                      {city.transportation.busStand?.name && (
                        <div className="flex items-start gap-4 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
                          <Bus className="h-6 w-6 text-orange-600 flex-shrink-0 mt-1" />
                          <div>
                            <h4 className="font-semibold mb-1">By Bus</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{city.transportation.busStand.name}</p>
                            <p className="text-sm text-gray-500">Local Auto: {city.transportation.busStand.autoFare}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="text-center py-12 text-gray-500">Transportation info not available yet.</div>
              )}
            </TabsContent>

            <TabsContent value="budget">
              {city.estimatedBudget ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {Object.entries(city.estimatedBudget).map(([type, budget]: [string, any]) => (
                    <Card key={type} className="border-0">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-bold capitalize mb-4">{type} Traveller</h3>
                        <div className="space-y-2">
                          {budget.hotel && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Hotel</span>
                              <span>{budget.hotel}/night</span>
                            </div>
                          )}
                          {budget.food && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Food</span>
                              <span>{budget.food}/day</span>
                            </div>
                          )}
                          {budget.travel && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Local Travel</span>
                              <span>{budget.travel}/day</span>
                            </div>
                          )}
                          {budget.tickets && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Tickets</span>
                              <span>{budget.tickets}</span>
                            </div>
                          )}
                          {budget.shopping && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Shopping</span>
                              <span>{budget.shopping}</span>
                            </div>
                          )}
                          {budget.total && (
                            <div className="border-t pt-2 mt-2 flex justify-between font-bold">
                              <span>Total</span>
                              <span className="text-blue-600">{budget.total}/day</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">Budget estimation not available yet.</div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Local Foods */}
      {city.localFoods && city.localFoods.length > 0 && (
        <section className="py-12 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <UtensilsCrossed className="h-6 w-6 text-orange-600" />
              Local Foods to Try
            </h2>
            <div className="flex flex-wrap gap-3">
              {city.localFoods.map((food: string) => (
                <Badge key={food} className="px-4 py-2 text-base bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300">
                  {food}
                </Badge>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Map Section */}
      {mapMarkers.length > 0 && (
        <section className="py-12 bg-white dark:bg-gray-950">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold mb-2">Explore {city.name} on Map</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {mapMarkers.length} locations including places, hotels & restaurants
            </p>
            <InteractiveMap
              center={mapCenter}
              zoom={13}
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
