'use client';

import React, { useState } from 'react';
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

const hotelData = {
  _id: '1',
  name: 'Taj Hotel & Convention Centre',
  slug: 'taj-hotel-convention-centre',
  description: 'Experience luxury at its finest at the Taj Hotel & Convention Centre, Agra. Located just 500 meters from the iconic Taj Mahal, this 5-star property offers breathtaking views, world-class amenities, and impeccable service. Each room is elegantly designed with modern amenities and traditional Indian touches.',
  address: 'Taj Ganj, Agra, Uttar Pradesh 282001',
  location: { latitude: 27.1751, longitude: 78.0421 },
  googleMapLink: 'https://maps.google.com',
  phone: '+91 562 222 2222',
  website: 'https://www.tajhotels.com',
  email: 'reservations@tajagra.com',
  starRating: 5,
  pricePerNight: 8000,
  amenities: ['Free WiFi', 'Parking', 'Breakfast', 'Swimming Pool', 'Spa', 'Restaurant', 'Gym', 'Airport Shuttle', 'Room Service', 'Laundry'],
  images: [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200',
    'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200',
    'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200',
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200',
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200',
  ],
  distance: '0.5 km from Taj Mahal',
  category: ['Luxury', 'Heritage'],
  published: true,
  rating: 4.8,
  reviews: 1250,
  checkIn: '2:00 PM',
  checkOut: '12:00 PM',
  rooms: [
    { type: 'Deluxe Room', price: 8000, size: '35 sqm', beds: '1 King Bed', maxGuests: 2 },
    { type: 'Premium Room', price: 12000, size: '45 sqm', beds: '1 King Bed', maxGuests: 2 },
    { type: 'Suite', price: 18000, size: '65 sqm', beds: '1 King Bed + Sofa', maxGuests: 4 },
    { type: 'Presidential Suite', price: 35000, size: '120 sqm', beds: '2 King Beds', maxGuests: 6 },
  ],
  nearbyAttractions: [
    { name: 'Taj Mahal', distance: '0.5 km', time: '5 min walk' },
    { name: 'Agra Fort', distance: '2.5 km', time: '10 min drive' },
    { name: 'Mehtab Bagh', distance: '1 km', time: '5 min drive' },
    { name: 'Itmad-ud-Daulah', distance: '3 km', time: '12 min drive' },
  ],
};

export default function HotelDetailPage({ params }: { params: { slug: string } }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState(0);

  return (
    <div className="pt-20">
      {/* Hero Gallery */}
      <section className="relative">
        <div className="relative h-[500px] md:h-[600px] overflow-hidden">
          <img
            src={hotelData.images[selectedImage]}
            alt={hotelData.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Navigation arrows */}
          <button
            onClick={() => setSelectedImage((prev) => (prev === 0 ? hotelData.images.length - 1 : prev - 1))}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 rounded-full hover:bg-white transition-colors shadow-lg"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={() => setSelectedImage((prev) => (prev === hotelData.images.length - 1 ? 0 : prev + 1))}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 rounded-full hover:bg-white transition-colors shadow-lg"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Action buttons */}
          <div className="absolute top-4 right-4 flex gap-2">
            <Button size="icon" variant="secondary" className="rounded-full bg-white/90 hover:bg-white">
              <Heart className="h-5 w-5" />
            </Button>
            <Button size="icon" variant="secondary" className="rounded-full bg-white/90 hover:bg-white">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>

          {/* Bottom info */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex flex-wrap gap-2 mb-4">
                {hotelData.category.map((cat) => (
                  <Badge key={cat} className="bg-white/20 text-white backdrop-blur-sm">
                    {cat}
                  </Badge>
                ))}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{hotelData.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-white/90">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  {hotelData.address}
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(hotelData.starRating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{hotelData.rating}</span>
                  <span className="text-sm">({hotelData.reviews} reviews)</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Thumbnails */}
        <div className="bg-white dark:bg-gray-950 border-b dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex gap-3 overflow-x-auto pb-2">
              {hotelData.images.map((img, index) => (
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
      </section>

      {/* Main Content */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* About */}
              <Card className="border-0">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4">About This Hotel</h2>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{hotelData.description}</p>
                </CardContent>
              </Card>

              {/* Amenities */}
              <Card className="border-0">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-6">Amenities</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {hotelData.amenities.map((amenity) => (
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

              {/* Rooms */}
              <Card className="border-0">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-6">Room Types</h2>
                  <div className="space-y-4">
                    {hotelData.rooms.map((room, index) => (
                      <div
                        key={index}
                        onClick={() => setSelectedRoom(index)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          selectedRoom === index
                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/30'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-bold">{room.type}</h3>
                            <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <BedDouble className="h-4 w-4" />
                                {room.beds}
                              </span>
                              <span>{room.size}</span>
                              <span>Up to {room.maxGuests} guests</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-blue-600">₹{room.price.toLocaleString()}</p>
                            <p className="text-sm text-gray-500">per night</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Nearby Attractions */}
              <Card className="border-0">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-6">Nearby Attractions</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {hotelData.nearbyAttractions.map((attraction, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <MapPin className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{attraction.name}</h4>
                          <div className="flex items-center gap-3 text-sm text-gray-500">
                            <span>{attraction.distance}</span>
                            <span>•</span>
                            <span>{attraction.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Map */}
              <Card className="border-0">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4">Location</h2>
                  <div className="rounded-2xl overflow-hidden h-[400px] bg-gray-100 dark:bg-gray-800">
                    <iframe
                      src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3543.768086487689!2d${hotelData.location.longitude - 0.005}!3d${hotelData.location.latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjfCsDEwJzMwLjQiTiA3OMKwMDInMzEuNiJF!5e0!3m2!1sen!2sin!4v1234567890`}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Booking Card */}
              <Card className="border-0 sticky top-24">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <p className="text-sm text-gray-500">Starting from</p>
                    <p className="text-4xl font-bold text-blue-600">₹{hotelData.pricePerNight.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">per night</p>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <Clock className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-500">Check-in</p>
                        <p className="font-medium">{hotelData.checkIn}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <Clock className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-500">Check-out</p>
                        <p className="font-medium">{hotelData.checkOut}</p>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full h-14 text-lg bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 shadow-lg">
                    Book Now
                  </Button>

                  <div className="mt-6 space-y-3">
                    <a href={`tel:${hotelData.phone}`} className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                      <Phone className="h-5 w-5 text-blue-600" />
                      <span className="text-sm">{hotelData.phone}</span>
                    </a>
                    {hotelData.website && (
                      <a href={hotelData.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                        <Globe className="h-5 w-5 text-blue-600" />
                        <span className="text-sm flex items-center gap-1">
                          Visit Website
                          <ExternalLink className="h-3 w-3" />
                        </span>
                      </a>
                    )}
                    {hotelData.email && (
                      <a href={`mailto:${hotelData.email}`} className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                        <Mail className="h-5 w-5 text-blue-600" />
                        <span className="text-sm">{hotelData.email}</span>
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
