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
  Clock,
  Mail,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  UtensilsCrossed,
  IndianRupee,
  Navigation,
  Calendar,
  Users,
  MessageSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

const restaurantData = {
  _id: '1',
  name: 'Peshawri',
  slug: 'peshawri',
  description: 'Experience the authentic flavors of North-West Frontier cuisine at Peshawri, located within the iconic ITC Mughal hotel in Agra. This award-winning restaurant is famous for its kebabs, dal Bukhara, and rustic ambiance that transports you to the tribal regions of Pakistan and Afghanistan. The restaurant uses traditional clay ovens (tandoors) and cooks over charcoal fires to deliver authentic flavors.',
  cuisine: ['Mughlai', 'North Indian', 'North-West Frontier'],
  address: 'ITC Mughal, Taj Ganj, Agra, Uttar Pradesh 282001',
  location: { latitude: 27.1740, longitude: 78.0410 },
  googleMapLink: 'https://maps.google.com',
  phone: '+91 562 402 1212',
  website: 'https://www.itchotels.com',
  email: 'peshawri.agra@itchotels.in',
  averageCost: 1500,
  openingTime: '12:30 PM',
  closingTime: '2:45 PM, 7:00 PM - 11:45 PM',
  images: [
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200',
    'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200',
    'https://images.unsplash.com/photo-1559339352-11d035aa65f4?w=1200',
    'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=1200',
  ],
  vegNonVeg: 'non-veg',
  rating: 4.6,
  reviewCount: 890,
  distance: '1 km from Taj Mahal',
  category: ['Fine Dining', 'Mughlai'],
  published: true,
  features: ['Air Conditioned', 'Reservations', 'Private Dining', 'Valet Parking', 'Wheelchair Accessible'],
  popularDishes: [
    { name: 'Dal Bukhara', description: 'Slow-cooked black lentils, simmered for 24 hours', price: 650, image: 'https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=400' },
    { name: 'Seekh Kebab', description: 'Minced lamb kebabs cooked in clay oven', price: 750, image: 'https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=400' },
    { name: 'Raan-e-Peshawar', description: 'Whole leg of lamb marinated and roasted', price: 1800, image: 'https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=400' },
    { name: 'Tandoori Chicken', description: 'Classic tandoori chicken with special spices', price: 550, image: 'https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=400' },
  ],
  menu: {
    starters: [
      { name: 'Seekh Kebab', price: 750 },
      { name: 'Chicken Tikka', price: 650 },
      { name: 'Paneer Tikka', price: 550 },
      { name: 'Fish Tikka', price: 700 },
    ],
    mains: [
      { name: 'Dal Bukhara', price: 650 },
      { name: 'Raan-e-Peshawar', price: 1800 },
      { name: 'Butter Chicken', price: 600 },
      { name: 'Rogan Josh', price: 750 },
    ],
    breads: [
      { name: 'Tandoori Roti', price: 60 },
      { name: 'Naan', price: 80 },
      { name: 'Garlic Naan', price: 100 },
      { name: 'Tandoori Paratha', price: 120 },
    ],
  },
  timings: {
    lunch: '12:30 PM - 2:45 PM',
    dinner: '7:00 PM - 11:45 PM',
    closedOn: 'None',
  },
  reviews: [
    { user: 'Rahul Sharma', rating: 5, comment: 'Best dal I have ever had! The ambiance is rustic and authentic.', date: '2 weeks ago', avatar: 'RS' },
    { user: 'Priya Patel', rating: 5, comment: 'The seekh kebabs are to die for. Must visit when in Agra!', date: '1 month ago', avatar: 'PP' },
    { user: 'Amit Kumar', rating: 4, comment: 'Great food but slightly expensive. Worth it for the experience.', date: '2 months ago', avatar: 'AK' },
  ],
};

export default function RestaurantDetailPage({ params }: { params: { slug: string } }) {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="pt-20">
      {/* Hero Gallery */}
      <section className="relative">
        <div className="relative h-[400px] md:h-[500px] overflow-hidden">
          <img
            src={restaurantData.images[selectedImage]}
            alt={restaurantData.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

          {/* Navigation arrows */}
          <button
            onClick={() => setSelectedImage((prev) => (prev === 0 ? restaurantData.images.length - 1 : prev - 1))}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 rounded-full hover:bg-white transition-colors shadow-lg"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={() => setSelectedImage((prev) => (prev === restaurantData.images.length - 1 ? 0 : prev + 1))}
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
                <Badge className={
                  restaurantData.vegNonVeg === 'veg'
                    ? 'bg-green-500 text-white'
                    : restaurantData.vegNonVeg === 'non-veg'
                    ? 'bg-red-500 text-white'
                    : 'bg-orange-500 text-white'
                }>
                  {restaurantData.vegNonVeg === 'veg' ? 'Pure Veg' : restaurantData.vegNonVeg === 'non-veg' ? 'Non-Veg' : 'Veg & Non-Veg'}
                </Badge>
                {restaurantData.category.map((cat) => (
                  <Badge key={cat} className="bg-white/20 text-white backdrop-blur-sm">
                    {cat}
                  </Badge>
                ))}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{restaurantData.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-white/90">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  {restaurantData.distance}
                </div>
                <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{restaurantData.rating}</span>
                  <span className="text-sm">({restaurantData.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                  <IndianRupee className="h-4 w-4" />
                  <span className="font-semibold">₹{restaurantData.averageCost}</span>
                  <span className="text-sm">per person</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Thumbnails */}
        <div className="bg-white dark:bg-gray-950 border-b dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex gap-3 overflow-x-auto pb-2">
              {restaurantData.images.map((img, index) => (
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
                  <h2 className="text-2xl font-bold mb-4">About</h2>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{restaurantData.description}</p>
                </CardContent>
              </Card>

              {/* Timings */}
              <Card className="border-0">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Clock className="h-6 w-6 text-blue-600" />
                    Timings
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-xl">
                      <p className="text-sm text-gray-500 mb-1">Lunch</p>
                      <p className="font-semibold">{restaurantData.timings.lunch}</p>
                    </div>
                    <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl">
                      <p className="text-sm text-gray-500 mb-1">Dinner</p>
                      <p className="font-semibold">{restaurantData.timings.dinner}</p>
                    </div>
                    <div className="p-4 bg-orange-50 dark:bg-orange-950/30 rounded-xl">
                      <p className="text-sm text-gray-500 mb-1">Closed On</p>
                      <p className="font-semibold">{restaurantData.timings.closedOn}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Popular Dishes */}
              <Card className="border-0">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <UtensilsCrossed className="h-6 w-6 text-orange-600" />
                    Popular Dishes
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {restaurantData.popularDishes.map((dish, index) => (
                      <div key={index} className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                          <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{dish.name}</h4>
                          <p className="text-sm text-gray-500 line-clamp-2">{dish.description}</p>
                          <p className="font-bold text-emerald-600 mt-1">₹{dish.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Menu */}
              <Card className="border-0">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-6">Menu Highlights</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3 text-blue-600">Starters</h3>
                      <div className="space-y-2">
                        {restaurantData.menu.starters.map((item, index) => (
                          <div key={index} className="flex justify-between items-center py-2 border-b dark:border-gray-700">
                            <span className="text-sm">{item.name}</span>
                            <span className="font-medium text-sm">₹{item.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-3 text-emerald-600">Main Course</h3>
                      <div className="space-y-2">
                        {restaurantData.menu.mains.map((item, index) => (
                          <div key={index} className="flex justify-between items-center py-2 border-b dark:border-gray-700">
                            <span className="text-sm">{item.name}</span>
                            <span className="font-medium text-sm">₹{item.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-3 text-orange-600">Breads</h3>
                      <div className="space-y-2">
                        {restaurantData.menu.breads.map((item, index) => (
                          <div key={index} className="flex justify-between items-center py-2 border-b dark:border-gray-700">
                            <span className="text-sm">{item.name}</span>
                            <span className="font-medium text-sm">₹{item.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Reviews */}
              <Card className="border-0">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Reviews</h2>
                    <Button>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Write Review
                    </Button>
                  </div>
                  <div className="space-y-6">
                    {restaurantData.reviews.map((review, index) => (
                      <div key={index} className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                          {review.avatar}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-semibold">{review.user}</h4>
                              <p className="text-sm text-gray-500">{review.date}</p>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-medium">{review.rating}</span>
                            </div>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400">{review.comment}</p>
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
                      src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3543.768086487689!2d${restaurantData.location.longitude - 0.005}!3d${restaurantData.location.latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjfCsDEwJzMwLjQiTiA3OMKwMDInMzEuNiJF!5e0!3m2!1sen!2sin!4v1234567890`}
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
              {/* Info Card */}
              <Card className="border-0 sticky top-24">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <p className="text-sm text-gray-500">Average Cost</p>
                    <p className="text-4xl font-bold text-emerald-600">₹{restaurantData.averageCost}</p>
                    <p className="text-sm text-gray-500">per person</p>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <Clock className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-500">Open Now</p>
                        <p className="font-medium">{restaurantData.openingTime}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <MapPin className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-500">Distance</p>
                        <p className="font-medium">{restaurantData.distance}</p>
                      </div>
                    </div>
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
                    <a href={`tel:${restaurantData.phone}`} className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                      <Phone className="h-5 w-5 text-blue-600" />
                      <span className="text-sm">{restaurantData.phone}</span>
                    </a>
                    {restaurantData.website && (
                      <a href={restaurantData.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                        <Globe className="h-5 w-5 text-blue-600" />
                        <span className="text-sm flex items-center gap-1">
                          Visit Website
                          <ExternalLink className="h-3 w-3" />
                        </span>
                      </a>
                    )}
                    {restaurantData.email && (
                      <a href={`mailto:${restaurantData.email}`} className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                        <Mail className="h-5 w-5 text-blue-600" />
                        <span className="text-sm">{restaurantData.email}</span>
                      </a>
                    )}
                  </div>

                  {/* Features */}
                  <div className="mt-6">
                    <h3 className="font-semibold mb-3">Features</h3>
                    <div className="flex flex-wrap gap-2">
                      {restaurantData.features.map((feature) => (
                        <Badge key={feature} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Cuisine */}
                  <div className="mt-6">
                    <h3 className="font-semibold mb-3">Cuisine</h3>
                    <div className="flex flex-wrap gap-2">
                      {restaurantData.cuisine.map((c) => (
                        <Badge key={c} className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                          {c}
                        </Badge>
                      ))}
                    </div>
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
