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
  Wifi,
  Car,
  Coffee,
  Waves,
  Dumbbell,
  UtensilsCrossed,
  Plane,
  BedDouble,
  Clock,
  Mail,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { InteractiveMap, MapMarker } from '@/components/map';
import { useHotelBySlug } from '@/lib/hooks';

const amenityIcons: Record<string, React.ReactNode> = {
  'Free WiFi': <Wifi className="h-5 w-5" />,
  'Parking': <Car className="h-5 w-5" />,
  'Breakfast': <Coffee className="h-5 w-5" />,
  'Swimming Pool': <Waves className="h-5 w-5" />,
  'Gym': <Dumbbell className="h-5 w-5" />,
  'Spa': <Waves className="h-5 w-5" />,
  'Restaurant': <UtensilsCrossed className="h-5 w-5" />,
  'Airport Shuttle': <Plane className="h-5 w-5" />,
};

export default function HotelDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [selectedImage, setSelectedImage] = useState(0);

  const { data: hotelResponse, isLoading } = useHotelBySlug(slug);
  const hotel = hotelResponse?.data;

  if (isLoading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading hotel details...</p>
        </div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Hotel not found</h2>
          <Link href="/hotels">
            <Button>Back to Hotels</Button>
          </Link>
        </div>
      </div>
    );
  }

  const mapMarkers: MapMarker[] = [];
  if (hotel.location?.latitude && hotel.location?.longitude) {
    mapMarkers.push({
      id: hotel._id,
      name: hotel.name,
      lat: hotel.location.latitude,
      lng: hotel.location.longitude,
      type: 'hotel',
      description: hotel.address,
      extraInfo: {
        ...(hotel.starRating && { Stars: `${hotel.starRating}★` }),
        ...(hotel.pricePerNight && { 'Price/Night': `₹${hotel.pricePerNight}` }),
      },
    });
  }

  const mapCenter: [number, number] =
    hotel.location?.latitude && hotel.location?.longitude
      ? [hotel.location.latitude, hotel.location.longitude]
      : [20.5937, 78.9629];

  return (
    <div className="pt-20">
      {/* Hero Gallery */}
      <section className="relative">
        <div className="relative h-[500px] md:h-[600px] overflow-hidden">
          <img
            src={hotel.images?.[selectedImage] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200'}
            alt={hotel.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {hotel.images && hotel.images.length > 1 && (
            <>
              <button
                onClick={() => setSelectedImage((prev) => (prev === 0 ? hotel.images!.length - 1 : prev - 1))}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 rounded-full hover:bg-white transition-colors shadow-lg"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={() => setSelectedImage((prev) => (prev === hotel.images!.length - 1 ? 0 : prev + 1))}
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
                {hotel.category?.map((cat: string) => (
                  <Badge key={cat} className="bg-white/20 text-white backdrop-blur-sm">
                    {cat}
                  </Badge>
                ))}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{hotel.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-white/90">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  {hotel.address}
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(hotel.starRating || 0)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {hotel.images && hotel.images.length > 1 && (
          <div className="bg-white dark:bg-gray-950 border-b dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-4 py-4">
              <div className="flex gap-3 overflow-x-auto pb-2">
                {hotel.images.map((img: string, index: number) => (
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
              <Card className="border-0">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4">About This Hotel</h2>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{hotel.description}</p>
                </CardContent>
              </Card>

              {hotel.amenities && hotel.amenities.length > 0 && (
                <Card className="border-0">
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-6">Amenities</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {hotel.amenities.map((amenity: string) => (
                        <div key={amenity} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                          <div className="text-blue-600">
                            {amenityIcons[amenity]}
                          </div>
                          <span className="text-sm font-medium">{amenity}</span>
                        </div>
                      ))}
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
                  <div className="text-center mb-6">
                    <p className="text-sm text-gray-500">Starting from</p>
                    <p className="text-4xl font-bold text-blue-600">₹{(hotel.pricePerNight || 0).toLocaleString()}</p>
                    <p className="text-sm text-gray-500">per night</p>
                  </div>

                  <Button className="w-full h-14 text-lg bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 shadow-lg">
                    Book Now
                  </Button>

                  <div className="mt-6 space-y-3">
                    {hotel.phone && (
                      <a href={`tel:${hotel.phone}`} className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                        <Phone className="h-5 w-5 text-blue-600" />
                        <span className="text-sm">{hotel.phone}</span>
                      </a>
                    )}
                    {hotel.website && (
                      <a href={hotel.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                        <Globe className="h-5 w-5 text-blue-600" />
                        <span className="text-sm flex items-center gap-1">
                          Visit Website
                          <ExternalLink className="h-3 w-3" />
                        </span>
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
