'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  MapPin,
  Star,
  Heart,
  Share2,
  Phone,
  Globe,
  Clock,
  Mail,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  IndianRupee,
  Navigation,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { InteractiveMap, MapMarker } from '@/components/map';
import { useRestaurantBySlug } from '@/lib/hooks';

export default function RestaurantDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [selectedImage, setSelectedImage] = useState(0);

  const { data: restaurantResponse, isLoading } = useRestaurantBySlug(slug);
  const restaurant = restaurantResponse?.data;

  if (isLoading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading restaurant details...</p>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Restaurant not found</h2>
          <Link href="/restaurants">
            <Button>Back to Restaurants</Button>
          </Link>
        </div>
      </div>
    );
  }

  const mapMarkers: MapMarker[] = [];
  if (restaurant.location?.latitude && restaurant.location?.longitude) {
    mapMarkers.push({
      id: restaurant._id,
      name: restaurant.name,
      lat: restaurant.location.latitude,
      lng: restaurant.location.longitude,
      type: 'restaurant',
      description: restaurant.address,
      extraInfo: {
        ...(restaurant.cuisine && { Cuisine: Array.isArray(restaurant.cuisine) ? restaurant.cuisine.join(', ') : restaurant.cuisine }),
        ...(restaurant.averageCost && { 'Avg Cost': `₹${restaurant.averageCost}/person` }),
        ...(restaurant.rating && { Rating: `${restaurant.rating}/5` }),
      },
    });
  }

  const mapCenter: [number, number] =
    restaurant.location?.latitude && restaurant.location?.longitude
      ? [restaurant.location.latitude, restaurant.location.longitude]
      : [20.5937, 78.9629];

  return (
    <div className="pt-20">
      {/* Hero Gallery */}
      <section className="relative">
        <div className="relative h-[400px] md:h-[500px] overflow-hidden">
          <img
            src={restaurant.images?.[selectedImage] || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200'}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

          {restaurant.images && restaurant.images.length > 1 && (
            <>
              <button
                onClick={() => setSelectedImage((prev) => (prev === 0 ? restaurant.images!.length - 1 : prev - 1))}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 rounded-full hover:bg-white transition-colors shadow-lg"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={() => setSelectedImage((prev) => (prev === restaurant.images!.length - 1 ? 0 : prev + 1))}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 rounded-full hover:bg-white transition-colors shadow-lg"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          <div className="absolute top-4 right-4 flex gap-2">
            <Button size="icon" variant="secondary" className="rounded-full bg-white/90 hover:bg-white">
              <Heart className="h-5 w-5" />
            </Button>
            <Button size="icon" variant="secondary" className="rounded-full bg-white/90 hover:bg-white">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex flex-wrap gap-2 mb-4">
                {restaurant.vegNonVeg && (
                  <Badge className={
                    restaurant.vegNonVeg === 'veg'
                      ? 'bg-green-500 text-white'
                      : restaurant.vegNonVeg === 'non-veg'
                      ? 'bg-red-500 text-white'
                      : 'bg-orange-500 text-white'
                  }>
                    {restaurant.vegNonVeg === 'veg' ? 'Pure Veg' : restaurant.vegNonVeg === 'non-veg' ? 'Non-Veg' : 'Veg & Non-Veg'}
                  </Badge>
                )}
                {restaurant.cuisine?.map((cat: string) => (
                  <Badge key={cat} className="bg-white/20 text-white backdrop-blur-sm">
                    {cat}
                  </Badge>
                ))}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{restaurant.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-white/90">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  {restaurant.address}
                </div>
                {restaurant.rating && (
                  <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{restaurant.rating}</span>
                  </div>
                )}
                {restaurant.averageCost && (
                  <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                    <IndianRupee className="h-4 w-4" />
                    <span className="font-semibold">₹{restaurant.averageCost}</span>
                    <span className="text-sm">per person</span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {restaurant.images && restaurant.images.length > 1 && (
          <div className="bg-white dark:bg-gray-950 border-b dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-4 py-4">
              <div className="flex gap-3 overflow-x-auto pb-2">
                {restaurant.images.map((img: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-24 h-16 rounded-lg overflow-hidden flex-shrink-0 ${
                      selectedImage === index ? 'ring-2 ring-blue-600' : ''
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Main Content */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {restaurant.description && (
                <Card className="border-0">
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-4">About</h2>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{restaurant.description}</p>
                  </CardContent>
                </Card>
              )}

              {(restaurant.openingTime || restaurant.closingTime) && (
                <Card className="border-0">
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                      <Clock className="h-6 w-6 text-blue-600" />
                      Timings
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {restaurant.openingTime && (
                        <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-xl">
                          <p className="text-sm text-gray-500 mb-1">Opens</p>
                          <p className="font-semibold">{restaurant.openingTime}</p>
                        </div>
                      )}
                      {restaurant.closingTime && (
                        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl">
                          <p className="text-sm text-gray-500 mb-1">Closes</p>
                          <p className="font-semibold">{restaurant.closingTime}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card className="border-0">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4">Location</h2>
                  {mapMarkers.length > 0 ? (
                    <InteractiveMap
                      center={mapCenter}
                      zoom={14}
                      markers={mapMarkers}
                      height="400px"
                      showLegend={false}
                    />
                  ) : (
                    <div className="rounded-2xl overflow-hidden h-[400px] bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <p className="text-gray-500">Map location not available</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="border-0 sticky top-24">
                <CardContent className="p-6">
                  {restaurant.averageCost && (
                    <div className="text-center mb-6">
                      <p className="text-sm text-gray-500">Average Cost</p>
                      <p className="text-4xl font-bold text-emerald-600">₹{restaurant.averageCost}</p>
                      <p className="text-sm text-gray-500">per person</p>
                    </div>
                  )}

                  <div className="space-y-4 mb-6">
                    {restaurant.openingTime && (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <Clock className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-500">Opens at</p>
                          <p className="font-medium">{restaurant.openingTime}</p>
                        </div>
                      </div>
                    )}
                    {restaurant.distance && (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <MapPin className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-500">Distance</p>
                          <p className="font-medium">{restaurant.distance}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Button className="w-full h-12 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700">
                      <Calendar className="h-4 w-4 mr-2" />
                      Reserve Table
                    </Button>
                    <Button variant="outline" className="w-full h-12">
                      <Navigation className="h-4 w-4 mr-2" />
                      Get Directions
                    </Button>
                  </div>

                  <div className="mt-6 space-y-3">
                    {restaurant.phone && (
                      <a href={`tel:${restaurant.phone}`} className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                        <Phone className="h-5 w-5 text-blue-600" />
                        <span className="text-sm">{restaurant.phone}</span>
                      </a>
                    )}
                    {restaurant.website && (
                      <a href={restaurant.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                        <Globe className="h-5 w-5 text-blue-600" />
                        <span className="text-sm flex items-center gap-1">
                          Visit Website
                          <ExternalLink className="h-3 w-3" />
                        </span>
                      </a>
                    )}
                  </div>

                  {restaurant.cuisine && restaurant.cuisine.length > 0 && (
                    <div className="mt-6">
                      <h3 className="font-semibold mb-3">Cuisine</h3>
                      <div className="flex flex-wrap gap-2">
                        {restaurant.cuisine.map((c: string) => (
                          <Badge key={c} className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                            {c}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
