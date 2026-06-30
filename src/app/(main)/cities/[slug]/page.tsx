'use client';

import React from 'react';
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
  Bed,
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

const cityData = {
  name: 'Darjeeling',
  slug: 'darjeeling',
  state: 'West Bengal',
  description: 'Darjeeling, nestled in the Himalayan foothills, is famous for its tea industry, stunning views of Kangchenjunga (the world\'s third-highest mountain), and the Darjeeling Himalayan Railway (a UNESCO World Heritage Site). Known as the "Queen of the Hills," it offers a perfect blend of natural beauty, colonial charm, and cultural diversity.',
  image: 'https://images.unsplash.com/photo-1593693411515-c20261bcad6e?w=1600',
  gallery: [
    'https://images.unsplash.com/photo-1593693411515-c20261bcad6e?w=800',
    'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800',
    'https://images.unsplash.com/photo-1558431460-98e7b2e29894?w=800',
  ],
  weather: {
    summer: '15°C - 25°C',
    winter: '2°C - 10°C',
    monsoon: '15°C - 20°C',
  },
  bestTimeToVisit: 'March to May, September to November',
  estimatedBudget: {
    budget: { hotel: '₹800', food: '₹500', travel: '₹400', tickets: '₹300', shopping: '₹500', total: '₹2,500' },
    standard: { hotel: '₹2,500', food: '₹1,000', travel: '₹800', tickets: '₹500', shopping: '₹700', total: '₹5,500' },
    luxury: { hotel: '₹8,000', food: '₹2,500', travel: '₹2,000', tickets: '₹1,000', shopping: '₹2,000', total: '₹15,500' },
  },
  localFoods: ['Momos', 'Thukpa', 'Darjeeling Tea', 'Sel Roti', 'Gundruk', 'Wai Wai'],
  travelTips: {
    dos: ['Carry warm clothes', 'Book hotels in advance', 'Try local tea estates', 'Visit early morning for clear views'],
    donts: ['Don\'t litter', 'Avoid plastic', 'Don\'t miss sunset points', 'Avoid traveling during monsoon landslides'],
    safety: ['Keep emergency numbers handy', 'Use registered taxis', 'Stay on marked trails', 'Carry basic medicines'],
  },
};

const popularPlaces = [
  { name: 'Tiger Hill', slug: 'tiger-hill', image: 'https://images.unsplash.com/photo-1593693411515-c20261bcad6e?w=800', rating: 4.8, category: 'Hill Station', entryFee: '₹50' },
  { name: 'Batasia Loop', slug: 'batasia-loop', image: 'https://images.unsplash.com/photo-1593693411515-c20261bcad6e?w=800', rating: 4.6, category: 'Heritage', entryFee: '₹30' },
  { name: 'Peace Pagoda', slug: 'peace-pagoda', image: 'https://images.unsplash.com/photo-1593693411515-c20261bcad6e?w=800', rating: 4.5, category: 'Religious', entryFee: 'Free' },
  { name: 'Happy Valley Tea Estate', slug: 'happy-valley-tea-estate', image: 'https://images.unsplash.com/photo-1593693411515-c20261bcad6e?w=800', rating: 4.7, category: 'Family Trip', entryFee: '₹100' },
];

const hotels = [
  { name: 'Mayfair Darjeeling', starRating: 5, address: 'Church Road', distance: '1 km', pricePerNight: 8000, amenities: ['Free WiFi', 'Breakfast', 'Spa'], image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800' },
  { name: 'Hotel Dekeling', starRating: 4, address: 'H.D. Thapa Road', distance: '0.5 km', pricePerNight: 3500, amenities: ['Free WiFi', 'Breakfast', 'Parking'], image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800' },
  { name: 'Budget Stay', starRating: 3, address: 'Mall Road', distance: '0.3 km', pricePerNight: 800, amenities: ['Free WiFi'], image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800' },
];

const restaurants = [
  { name: 'Kunga Restaurant', cuisine: ['Tibetan', 'Chinese'], vegNonVeg: 'both', distance: '0.5 km', averageCost: 500, rating: 4.5, image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800' },
  { name: 'Glenary\'s', cuisine: ['Bakery', 'Continental'], vegNonVeg: 'both', distance: '0.3 km', averageCost: 800, rating: 4.6, image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800' },
  { name: 'Keventer\'s', cuisine: ['Cafe', 'Snacks'], vegNonVeg: 'both', distance: '0.4 km', averageCost: 400, rating: 4.4, image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800' },
];

const itinerary = [
  {
    day: 1,
    title: 'Arrival & Local Sightseeing',
    activities: [
      { time: 'Morning', activity: 'Arrive at Darjeeling, check-in to hotel', location: 'Hotel' },
      { time: 'Breakfast', activity: 'Enjoy local breakfast at Keventer\'s', location: 'Keventer\'s' },
      { time: 'Afternoon', activity: 'Visit Batasia Loop & War Memorial', location: 'Batasia Loop' },
      { time: 'Evening', activity: 'Explore Mall Road & Chowrasta', location: 'Mall Road' },
      { time: 'Dinner', activity: 'Dinner at Kunga Restaurant', location: 'Kunga' },
    ],
    cost: '₹2,000',
  },
  {
    day: 2,
    title: 'Tiger Hill Sunrise & Tea Estates',
    activities: [
      { time: 'Early Morning', activity: 'Sunrise at Tiger Hill (4 AM departure)', location: 'Tiger Hill' },
      { time: 'Breakfast', activity: 'Breakfast at hotel', location: 'Hotel' },
      { time: 'Morning', activity: 'Visit Happy Valley Tea Estate', location: 'Tea Estate' },
      { time: 'Afternoon', activity: 'Lunch & visit Peace Pagoda', location: 'Peace Pagoda' },
      { time: 'Evening', activity: 'Toy Train ride (UNESCO Heritage)', location: 'Darjeeling Railway' },
    ],
    cost: '₹2,500',
  },
  {
    day: 3,
    title: 'Adventure & Departure',
    activities: [
      { time: 'Morning', activity: 'Visit Ghoom Monastery & Padmachenyo', location: 'Ghoom' },
      { time: 'Breakfast', activity: 'Local breakfast', location: 'Local Cafe' },
      { time: 'Afternoon', activity: 'Shopping for tea & souvenirs', location: 'Local Market' },
      { time: 'Lunch', activity: 'Farewell lunch at Glenary\'s', location: 'Glenary\'s' },
      { time: 'Evening', activity: 'Departure', location: 'Bus Stand/Station' },
    ],
    cost: '₹1,500',
  },
];

export default function CityPage({ params }: { params: { slug: string } }) {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative h-[500px] md:h-[600px]">
        <img src={cityData.image} alt={cityData.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Badge className="mb-4 bg-white/20 text-white backdrop-blur-sm">
              <MapPin className="h-3 w-3 mr-1" />
              {cityData.state}
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{cityData.name}</h1>
            <p className="text-white/90 max-w-2xl text-lg">{cityData.description}</p>
          </motion.div>
        </div>
      </section>

      {/* Quick Info */}
      <section className="bg-white dark:bg-gray-950 border-b dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <Sun className="h-8 w-8 text-orange-500 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Summer</p>
              <p className="font-semibold">{cityData.weather.summer}</p>
            </div>
            <div className="text-center">
              <Cloud className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Winter</p>
              <p className="font-semibold">{cityData.weather.winter}</p>
            </div>
            <div className="text-center">
              <Droplets className="h-8 w-8 text-cyan-500 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Monsoon</p>
              <p className="font-semibold">{cityData.weather.monsoon}</p>
            </div>
            <div className="text-center">
              <Clock className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Best Time</p>
              <p className="font-semibold text-sm">{cityData.bestTimeToVisit}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <Tabs defaultValue="places" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-8">
              <TabsTrigger value="places">Places</TabsTrigger>
              <TabsTrigger value="hotels">Hotels</TabsTrigger>
              <TabsTrigger value="restaurants">Restaurants</TabsTrigger>
              <TabsTrigger value="transport">Transport</TabsTrigger>
              <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
            </TabsList>

            <TabsContent value="places">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {popularPlaces.map((place, index) => (
                  <motion.div
                    key={place.slug}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link href={`/places/${place.slug}`}>
                      <Card className="card-hover border-0 overflow-hidden group cursor-pointer">
                        <div className="relative h-48 overflow-hidden">
                          <img src={place.image} alt={place.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          <Badge className="absolute top-4 left-4 bg-white/90 text-gray-900">{place.category}</Badge>
                          <div className="absolute bottom-4 left-4 text-white">
                            <h3 className="text-lg font-bold">{place.name}</h3>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-medium">{place.rating}</span>
                            </div>
                            <p className="font-bold text-blue-600">{place.entryFee}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="hotels">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {hotels.map((hotel, index) => (
                  <Card key={index} className="card-hover border-0 overflow-hidden">
                    <div className="relative h-48">
                      <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover" />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-bold mb-1">{hotel.name}</h3>
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(hotel.starRating)].map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-sm text-gray-500 mb-2">{hotel.address} • {hotel.distance}</p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {hotel.amenities.map((a) => (
                          <Badge key={a} variant="secondary" className="text-xs">{a}</Badge>
                        ))}
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-lg font-bold text-blue-600">₹{hotel.pricePerNight}<span className="text-sm text-gray-500 font-normal">/night</span></p>
                        <Button size="sm">Book Now</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="restaurants">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {restaurants.map((restaurant, index) => (
                  <Card key={index} className="card-hover border-0 overflow-hidden">
                    <div className="relative h-40">
                      <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-bold mb-1">{restaurant.name}</h3>
                      <p className="text-sm text-gray-500 mb-2">{restaurant.cuisine.join(', ')}</p>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={restaurant.vegNonVeg === 'veg' ? 'default' : 'secondary'}>{restaurant.vegNonVeg}</Badge>
                        <span className="text-sm text-gray-500">{restaurant.distance}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{restaurant.rating}</span>
                        </div>
                        <p className="font-bold text-emerald-600">₹{restaurant.averageCost}/person</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="transport">
              <Card className="border-0">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-6">How to Reach {cityData.name}</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                      <Plane className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold mb-1">By Flight</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Nearest Airport: Bagdogra (70 km)</p>
                        <p className="text-sm text-gray-500">Cab Cost: ₹2,000-2,500</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                      <Train className="h-6 w-6 text-emerald-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold mb-1">By Train</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Nearest Station: New Jalpaiguri (68 km)</p>
                        <p className="text-sm text-gray-500">Taxi Fare: ₹1,500-2,000</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
                      <Bus className="h-6 w-6 text-orange-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold mb-1">By Bus</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Darjeeling Bus Stand</p>
                        <p className="text-sm text-gray-500">Local Auto: ₹50-100</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="itinerary">
              <div className="space-y-6">
                {itinerary.map((day, index) => (
                  <Card key={index} className="border-0">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                          {day.day}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">Day {day.day}</h3>
                          <p className="text-gray-500">{day.title}</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {day.activities.map((activity, idx) => (
                          <div key={idx} className="flex items-start gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <Clock className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <span className="text-sm font-semibold text-blue-600">{activity.time}</span>
                              <p className="text-gray-600 dark:text-gray-400">{activity.activity}</p>
                              <p className="text-sm text-gray-500">{activity.location}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg flex justify-between items-center">
                        <span className="font-semibold">Estimated Cost</span>
                        <span className="text-lg font-bold text-emerald-600">{day.cost}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Budget Section */}
      <section className="py-12 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Wallet className="h-6 w-6 text-emerald-600" />
            Estimated Budget
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(cityData.estimatedBudget).map(([type, budget]) => (
              <Card key={type} className="border-0">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold capitalize mb-4">{type} Traveller</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Hotel</span>
                      <span>{budget.hotel}/night</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Food</span>
                      <span>{budget.food}/day</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Local Travel</span>
                      <span>{budget.travel}/day</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Tickets</span>
                      <span>{budget.tickets}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Shopping</span>
                      <span>{budget.shopping}</span>
                    </div>
                    <div className="border-t pt-2 mt-2 flex justify-between font-bold">
                      <span>Total</span>
                      <span className="text-blue-600">{budget.total}/day</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Local Foods */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <UtensilsCrossed className="h-6 w-6 text-orange-600" />
            Local Foods to Try
          </h2>
          <div className="flex flex-wrap gap-3">
            {cityData.localFoods.map((food) => (
              <Badge key={food} className="px-4 py-2 text-base bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300">
                {food}
              </Badge>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
