'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  MapPin,
  Clock,
  Star,
  Heart,
  Share2,
  Camera,
  Ticket,
  Sun,
  Cloud,
  Droplets,
  Plane,
  Train,
  Bus,
  Car,
  Bike,
  UtensilsCrossed,
  Bed,
  AlertTriangle,
  Languages,
  Phone,
  CreditCard,
  Hospital,
  ChevronLeft,
  ChevronRight,
  Download,
  MessageSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { usePlaceBySlug } from '@/lib/hooks';

export default function PlacePage({ params }: { params: { slug: string } }) {
  const [selectedImage, setSelectedImage] = useState(0);

  const { data: placeData, isLoading } = usePlaceBySlug(params.slug);
  const place = placeData?.data;

  if (isLoading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading place details...</p>
        </div>
      </div>
    );
  }

  if (!place) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Place not found</h2>
          <Link href="/places">
            <Button>Back to Places</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20">
      {/* Hero Banner */}
      <section className="relative h-[500px] md:h-[600px]">
        <img
          src={place.images?.[selectedImage] || 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200'}
          alt={place.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Navigation arrows */}
        {place.images && place.images.length > 1 && (
          <>
            <button
              onClick={() => setSelectedImage((prev) => (prev === 0 ? place.images.length - 1 : prev - 1))}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 rounded-full hover:bg-white transition-colors shadow-lg"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={() => setSelectedImage((prev) => (prev === place.images.length - 1 ? 0 : prev + 1))}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 rounded-full hover:bg-white transition-colors shadow-lg"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}

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
              {place.category?.map((cat: string) => (
                <Badge key={cat} className="bg-white/20 text-white backdrop-blur-sm">
                  {cat}
                </Badge>
              ))}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{place.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-white/90">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                {typeof place.city === 'object' ? place.city?.name : ''}{typeof place.state === 'object' && place.state?.name ? `, ${place.state.name}` : ''}
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{place.rating || '4.5'}</span>
              </div>
              {place.openingTime && place.closingTime && (
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  {place.openingTime} - {place.closingTime}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Image Gallery Thumbnails */}
      {place.images && place.images.length > 1 && (
        <section className="bg-white dark:bg-gray-950 border-b dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex gap-3 overflow-x-auto pb-2">
              {place.images.map((img: string, index: number) => (
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
        </section>
      )}

      {/* Quick Info Bar */}
      <section className="bg-white dark:bg-gray-950 border-b dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <Ticket className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Entry Fee</p>
                <p className="font-semibold text-sm">{place.entryFee || 'Free'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                <Clock className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Timings</p>
                <p className="font-semibold text-sm">{place.openingTime || 'N/A'} - {place.closingTime || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
                <Sun className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Best Time</p>
                <p className="font-semibold text-sm">{place.bestTimeToVisit || 'Year-round'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                <Camera className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Photography</p>
                <p className="font-semibold text-sm">{place.photography !== false ? 'Allowed' : 'Not Allowed'}</p>
              </div>
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
                  <h2 className="text-2xl font-bold mb-4">About {place.name}</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">{place.description}</p>
                  {place.history && (
                    <>
                      <h3 className="text-xl font-semibold mb-3">History</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-6">{place.history}</p>
                    </>
                  )}
                  {place.highlights && place.highlights.length > 0 && (
                    <>
                      <h3 className="text-xl font-semibold mb-3">Highlights</h3>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {place.highlights.map((highlight: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <Star className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-600 dark:text-gray-400">{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Things to Know */}
              {place.thingsToKnow && place.thingsToKnow.length > 0 && (
                <Card className="border-0">
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                      <AlertTriangle className="h-6 w-6 text-orange-500" />
                      Things to Know
                    </h2>
                    <ul className="space-y-3">
                      {place.thingsToKnow.map((tip: string, index: number) => (
                        <li key={index} className="flex items-start gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                          <span className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm flex-shrink-0">
                            {index + 1}
                          </span>
                          <span className="text-gray-600 dark:text-gray-400">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Weather */}
              {place.weather && (
                <Card className="border-0">
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-4">Weather</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {place.weather.summer && (
                        <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl text-center">
                          <Sun className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                          <h4 className="font-semibold mb-1">Summer</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{place.weather.summer}</p>
                        </div>
                      )}
                      {place.weather.winter && (
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-center">
                          <Cloud className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                          <h4 className="font-semibold mb-1">Winter</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{place.weather.winter}</p>
                        </div>
                      )}
                      {place.weather.monsoon && (
                        <div className="p-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-xl text-center">
                          <Droplets className="h-8 w-8 text-cyan-500 mx-auto mb-2" />
                          <h4 className="font-semibold mb-1">Monsoon</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{place.weather.monsoon}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Transportation */}
              {place.transportation && (
                <Card className="border-0">
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-6">How to Reach</h2>
                    <div className="space-y-4">
                      {place.transportation.byFlight?.nearestAirport && (
                        <div className="flex items-start gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                          <Plane className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                          <div>
                            <h4 className="font-semibold mb-1">By Flight</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Nearest Airport: {place.transportation.byFlight.nearestAirport} ({place.transportation.byFlight.distance})</p>
                            <p className="text-sm text-gray-500">Cab Cost: {place.transportation.byFlight.cabCost}</p>
                          </div>
                        </div>
                      )}
                      {place.transportation.byTrain?.nearestStation && (
                        <div className="flex items-start gap-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                          <Train className="h-6 w-6 text-emerald-600 flex-shrink-0 mt-1" />
                          <div>
                            <h4 className="font-semibold mb-1">By Train</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Nearest Station: {place.transportation.byTrain.nearestStation} ({place.transportation.byTrain.distance})</p>
                            <p className="text-sm text-gray-500">Taxi/Auto: {place.transportation.byTrain.taxiFare}</p>
                          </div>
                        </div>
                      )}
                      {place.transportation.byBus?.busStand && (
                        <div className="flex items-start gap-4 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
                          <Bus className="h-6 w-6 text-orange-600 flex-shrink-0 mt-1" />
                          <div>
                            <h4 className="font-semibold mb-1">By Bus</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Bus Stand: {place.transportation.byBus.busStand}</p>
                            <p className="text-sm text-gray-500">Auto/Taxi: {place.transportation.byBus.autoFare}</p>
                          </div>
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-4">
                        {place.transportation.privateCab && (
                          <div className="flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                            <Car className="h-5 w-5 text-purple-600" />
                            <div>
                              <h4 className="font-semibold text-sm">Private Cab</h4>
                              <p className="text-xs text-gray-500">{place.transportation.privateCab}</p>
                            </div>
                          </div>
                        )}
                        {place.transportation.bikeRental && (
                          <div className="flex items-center gap-3 p-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-xl">
                            <Bike className="h-5 w-5 text-cyan-600" />
                            <div>
                              <h4 className="font-semibold text-sm">Bike Rental</h4>
                              <p className="text-xs text-gray-500">{place.transportation.bikeRental}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* FAQs */}
              {place.faqs && place.faqs.length > 0 && (
                <Card className="border-0">
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
                    <Accordion>
                      {place.faqs.map((faq: { question: string; answer: string }, index: number) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                          <AccordionTrigger>{faq.question}</AccordionTrigger>
                          <AccordionContent>{faq.answer}</AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              )}

              {/* Reviews */}
              {place.reviews && place.reviews.length > 0 && (
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
                      {place.reviews.map((review: any, index: number) => (
                        <div key={index} className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                          <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                            {review.user?.name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-semibold">{review.user?.name || 'Anonymous'}</h4>
                                <p className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
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
              )}
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Cost Estimation */}
              {place.estimatedCost && (
                <Card className="border-0 bg-gradient-to-br from-blue-600 to-emerald-600 text-white">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4">Estimated Cost</h3>
                    <div className="space-y-3">
                      {place.estimatedCost.budget?.total && (
                        <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
                          <span className="text-sm">Budget Traveller</span>
                          <span className="font-bold">{place.estimatedCost.budget.total}/day</span>
                        </div>
                      )}
                      {place.estimatedCost.standard?.total && (
                        <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
                          <span className="text-sm">Standard Traveller</span>
                          <span className="font-bold">{place.estimatedCost.standard.total}/day</span>
                        </div>
                      )}
                      {place.estimatedCost.luxury?.total && (
                        <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
                          <span className="text-sm">Luxury Traveller</span>
                          <span className="font-bold">{place.estimatedCost.luxury.total}/day</span>
                        </div>
                      )}
                    </div>
                    <Button className="w-full mt-4 bg-white text-blue-600 hover:bg-white/90">
                      <Download className="h-4 w-4 mr-2" />
                      Download Itinerary
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Safety & Emergency */}
              {place.emergencyNumbers && (
                <Card className="border-0">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4">Safety & Emergency</h3>
                    <div className="space-y-3">
                      {place.emergencyNumbers.police && (
                        <div className="flex items-center gap-3">
                          <Phone className="h-5 w-5 text-red-600" />
                          <div>
                            <p className="text-sm text-gray-500">Police</p>
                            <p className="font-semibold">{place.emergencyNumbers.police}</p>
                          </div>
                        </div>
                      )}
                      {place.emergencyNumbers.ambulance && (
                        <div className="flex items-center gap-3">
                          <Hospital className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="text-sm text-gray-500">Ambulance</p>
                            <p className="font-semibold">{place.emergencyNumbers.ambulance}</p>
                          </div>
                        </div>
                      )}
                      {place.localLanguage && (
                        <div className="flex items-center gap-3">
                          <Languages className="h-5 w-5 text-purple-600" />
                          <div>
                            <p className="text-sm text-gray-500">Local Language</p>
                            <p className="font-semibold">{place.localLanguage}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Local Foods */}
              {place.localFoods && place.localFoods.length > 0 && (
                <Card className="border-0">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <UtensilsCrossed className="h-5 w-5 text-orange-600" />
                      Local Foods
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {place.localFoods.map((food: string) => (
                        <Badge key={food} className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                          {food}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      {place.location?.latitude && place.location?.longitude && (
        <section className="py-12 bg-white dark:bg-gray-950">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">Location</h2>
            <div className="rounded-2xl overflow-hidden h-[400px] bg-gray-100 dark:bg-gray-800">
              <iframe
                src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3543.768086487689!2d${place.location.longitude - 0.005}!3d${place.location.latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjfCsDEwJzMwLjQiTiA3OMKwMDInMzEuNiJF!5e0!3m2!1sen!2sin!4v1234567890`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
