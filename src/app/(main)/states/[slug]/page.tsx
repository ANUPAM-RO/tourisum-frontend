'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  MapPin,
  Clock,
  Sun,
  Cloud,
  Droplets,
  Star,
  ArrowRight,
  Calendar,
  Languages,
  Phone,
  Heart,
  Share2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const stateData = {
  name: 'West Bengal',
  slug: 'west-bengal',
  capital: 'Kolkata',
  description: 'West Bengal, located in eastern India, is a state of incredible diversity. From the snow-capped Himalayas in the north to the Sundarbans mangrove forests in the south, it offers a unique blend of natural beauty, rich cultural heritage, and historical significance. The state is famous for its literary tradition, artistic heritage, and the warmth of its people.',
  image: 'https://images.unsplash.com/photo-1558431460-98e7b2e29894?w=1600',
  gallery: [
    'https://images.unsplash.com/photo-1558431460-98e7b2e29894?w=800',
    'https://images.unsplash.com/photo-1593693411515-c20261bcad6e?w=800',
    'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800',
    'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800',
  ],
  weather: {
    summer: '30°C - 40°C (March to June)',
    winter: '10°C - 25°C (November to February)',
    monsoon: '25°C - 35°C (July to October)',
  },
  bestTimeToVisit: 'October to March',
  localLanguage: 'Bengali, Hindi, English',
  emergencyNumbers: {
    police: '100',
    ambulance: '108',
    fire: '101',
  },
};

const popularCities = [
  { name: 'Kolkata', slug: 'kolkata', image: 'https://images.unsplash.com/photo-1558431460-98e7b2e29894?w=800', places: 15 },
  { name: 'Darjeeling', slug: 'darjeeling', image: 'https://images.unsplash.com/photo-1593693411515-c20261bcad6e?w=800', places: 12 },
  { name: 'Siliguri', slug: 'siliguri', image: 'https://images.unsplash.com/photo-1593693411515-c20261bcad6e?w=800', places: 8 },
  { name: 'Durgapur', slug: 'durgapur', image: 'https://images.unsplash.com/photo-1593693411515-c20261bcad6e?w=800', places: 5 },
];

const popularPlaces = [
  { name: 'Victoria Memorial', slug: 'victoria-memorial', location: 'Kolkata', image: 'https://images.unsplash.com/photo-1558431460-98e7b2e29894?w=800', rating: 4.7, category: 'Heritage', entryFee: '₹30' },
  { name: 'Tiger Hill', slug: 'tiger-hill', location: 'Darjeeling', image: 'https://images.unsplash.com/photo-1593693411515-c20261bcad6e?w=800', rating: 4.8, category: 'Hill Station', entryFee: '₹50' },
  { name: 'Sundarbans', slug: 'sundarbans', location: 'South 24 Parganas', image: 'https://images.unsplash.com/photo-1593693411515-c20261bcad6e?w=800', rating: 4.6, category: 'Wildlife', entryFee: '₹100' },
  { name: 'Dakshineswar Temple', slug: 'dakshineswar-temple', location: 'Kolkata', image: 'https://images.unsplash.com/photo-1558431460-98e7b2e29894?w=800', rating: 4.5, category: 'Religious', entryFee: 'Free' },
  { name: 'Bishnupur Temples', slug: 'bishnupur-temples', location: 'Bankura', image: 'https://images.unsplash.com/photo-1558431460-98e7b2e29894?w=800', rating: 4.4, category: 'Heritage', entryFee: '₹20' },
  { name: 'Sandakphu', slug: 'sandakphu', location: 'Darjeeling', image: 'https://images.unsplash.com/photo-1593693411515-c20261bcad6e?w=800', rating: 4.9, category: 'Adventure', entryFee: '₹150' },
];

export default function StatePage({ params }: { params: { slug: string } }) {
  return (
    <div className="pt-20">
      {/* Hero Banner */}
      <section className="relative h-[500px] md:h-[600px]">
        <img
          src={stateData.image}
          alt={stateData.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Badge className="mb-4 bg-white/20 text-white backdrop-blur-sm">
              <MapPin className="h-3 w-3 mr-1" />
              Capital: {stateData.capital}
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{stateData.name}</h1>
            <p className="text-white/90 max-w-2xl text-lg">{stateData.description}</p>
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
              <p className="font-semibold">{stateData.weather.summer}</p>
            </div>
            <div className="text-center">
              <Cloud className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Winter</p>
              <p className="font-semibold">{stateData.weather.winter}</p>
            </div>
            <div className="text-center">
              <Droplets className="h-8 w-8 text-cyan-500 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Monsoon</p>
              <p className="font-semibold">{stateData.weather.monsoon}</p>
            </div>
            <div className="text-center">
              <Calendar className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Best Time</p>
              <p className="font-semibold">{stateData.bestTimeToVisit}</p>
            </div>
          </div>
        </div>
      </section>

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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {popularCities.map((city, index) => (
                  <motion.div
                    key={city.slug}
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
                            <Badge variant="secondary">{city.places} places</Badge>
                            <ArrowRight className="h-4 w-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="places">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {popularPlaces.map((place, index) => (
                  <motion.div
                    key={place.slug}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link href={`/places/${place.slug}`}>
                      <Card className="card-hover border-0 overflow-hidden group cursor-pointer h-full">
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={place.image}
                            alt={place.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          <Badge className="absolute top-4 left-4 bg-white/90 text-gray-900">
                            {place.category}
                          </Badge>
                          <button className="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
                            <Heart className="h-4 w-4" />
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
                            <div className="text-right">
                              <span className="text-sm text-gray-500">Entry</span>
                              <p className="font-bold text-blue-600">{place.entryFee}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
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
                      <div>
                        <p className="text-sm text-gray-500">Local Language</p>
                        <p className="font-medium">{stateData.localLanguage}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Best Time to Visit</p>
                        <p className="font-medium">{stateData.bestTimeToVisit}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Capital</p>
                        <p className="font-medium">{stateData.capital}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Phone className="h-5 w-5 text-red-600" />
                      Emergency Numbers
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <span>Police</span>
                        <span className="font-bold text-red-600">{stateData.emergencyNumbers.police}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <span>Ambulance</span>
                        <span className="font-bold text-blue-600">{stateData.emergencyNumbers.ambulance}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                        <span>Fire</span>
                        <span className="font-bold text-orange-600">{stateData.emergencyNumbers.fire}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-0 mt-8">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Weather Overview</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
                      <Sun className="h-8 w-8 text-orange-500 mb-2" />
                      <h4 className="font-semibold mb-1">Summer</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{stateData.weather.summer}</p>
                      <p className="text-xs text-gray-500 mt-2">March to June</p>
                    </div>
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                      <Cloud className="h-8 w-8 text-blue-500 mb-2" />
                      <h4 className="font-semibold mb-1">Winter</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{stateData.weather.winter}</p>
                      <p className="text-xs text-gray-500 mt-2">November to February</p>
                    </div>
                    <div className="p-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-xl">
                      <Droplets className="h-8 w-8 text-cyan-500 mb-2" />
                      <h4 className="font-semibold mb-1">Monsoon</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{stateData.weather.monsoon}</p>
                      <p className="text-xs text-gray-500 mt-2">July to October</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-12 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Explore on Map</h2>
          <div className="rounded-2xl overflow-hidden h-[400px] bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d59233546.06878787!2d68.10921875!3d22.7195687!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30635ff06b92b791%3A0xd78c4fa1854213a6!2sIndia!5e0!3m2!1sen!2sin!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
