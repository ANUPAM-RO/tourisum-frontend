'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import {
  Search,
  MapPin,
  Mountain,
  Waves,
  Building2,
  Trees,
  Church,
  Tent,
  Heart,
  Users,
  Star,
  ArrowRight,
  Clock,
  ChevronDown,
  Mail,
  Send,
  Compass,
  Wallet,
  Shield,
  Camera,
  Calendar,
  MessageCircle,
  TrendingUp,
  Sparkles,
  Globe,
  Eye,
  Zap,
  Coffee,
  Play,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useStates, usePlaces, useCategories, useToggleFavorite } from '@/lib/hooks';
import { formatRating, cn } from '@/lib/utils';

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
};

const fadeInLeft = {
  initial: { opacity: 0, x: -60 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
};

const fadeInRight = {
  initial: { opacity: 0, x: 60 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
};

const staggerContainer = {
  animate: {
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const categoryConfig = [
  { name: 'Hill Station', icon: Mountain, color: 'from-blue-500 to-cyan-500', bg: 'bg-blue-50 dark:bg-blue-950/30', description: 'Cool mountain retreats' },
  { name: 'Beach', icon: Waves, color: 'from-cyan-500 to-blue-500', bg: 'bg-cyan-50 dark:bg-cyan-950/30', description: 'Sun-kissed shorelines' },
  { name: 'Heritage', icon: Building2, color: 'from-amber-500 to-orange-500', bg: 'bg-amber-50 dark:bg-amber-950/30', description: 'Historical monuments' },
  { name: 'Wildlife', icon: Trees, color: 'from-green-500 to-emerald-500', bg: 'bg-green-50 dark:bg-green-950/30', description: 'Nature & safaris' },
  { name: 'Religious', icon: Church, color: 'from-purple-500 to-pink-500', bg: 'bg-purple-50 dark:bg-purple-950/30', description: 'Spiritual journeys' },
  { name: 'Adventure', icon: Tent, color: 'from-red-500 to-orange-500', bg: 'bg-red-50 dark:bg-red-950/30', description: 'Thrilling experiences' },
  { name: 'Honeymoon', icon: Heart, color: 'from-pink-500 to-rose-500', bg: 'bg-pink-50 dark:bg-pink-950/30', description: 'Romantic getaways' },
  { name: 'Family Trip', icon: Users, color: 'from-indigo-500 to-blue-500', bg: 'bg-indigo-50 dark:bg-indigo-950/30', description: 'Fun for everyone' },
];

const trendingDestinations = [
  { name: 'Taj Mahal', location: 'Agra, Uttar Pradesh', image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800', rating: 4.9, reviews: 12500, category: 'Heritage', price: '₹50', duration: '1-2 Days', bestTime: 'Oct-Mar' },
  { name: 'Dal Lake', location: 'Srinagar, J&K', image: 'https://images.unsplash.com/photo-1597074836924-8e13c0e81655?w=800', rating: 4.8, reviews: 8900, category: 'Hill Station', price: 'Free', duration: '2-3 Days', bestTime: 'Apr-Jun' },
  { name: 'Goa Beaches', location: 'Goa', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800', rating: 4.7, reviews: 15200, category: 'Beach', price: 'Free', duration: '3-5 Days', bestTime: 'Nov-Feb' },
  { name: 'Munnar', location: 'Kerala', image: 'https://images.unsplash.com/photo-1593693411515-c20261bcad6e?w=800', rating: 4.8, reviews: 9800, category: 'Hill Station', price: 'Free', duration: '2-4 Days', bestTime: 'Sep-Mar' },
  { name: 'Jaipur Forts', location: 'Rajasthan', image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800', rating: 4.9, reviews: 11200, category: 'Heritage', price: '₹200', duration: '2-3 Days', bestTime: 'Oct-Mar' },
  { name: 'Varanasi Ghats', location: 'Uttar Pradesh', image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800', rating: 4.6, reviews: 7800, category: 'Religious', price: 'Free', duration: '1-2 Days', bestTime: 'Oct-Mar' },
  { name: 'Sundarbans', location: 'West Bengal', image: 'https://images.unsplash.com/photo-1593693411515-c20261bcad6e?w=800', rating: 4.7, reviews: 5600, category: 'Wildlife', price: '₹100', duration: '2-3 Days', bestTime: 'Dec-Feb' },
  { name: 'Rishikesh', location: 'Uttarakhand', image: 'https://images.unsplash.com/photo-1593693411515-c20261bcad6e?w=800', rating: 4.7, reviews: 8200, category: 'Adventure', price: 'Free', duration: '2-4 Days', bestTime: 'Mar-Jun' },
  { name: 'Hampi', location: 'Karnataka', image: 'https://images.unsplash.com/photo-1593693411515-c20261bcad6e?w=800', rating: 4.8, reviews: 6400, category: 'Heritage', price: '₹40', duration: '2-3 Days', bestTime: 'Oct-Feb' },
];

const popularStates = [
  { name: 'West Bengal', capital: 'Kolkata', image: 'https://images.unsplash.com/photo-1558431460-98e7b2e29894?w=800', places: 45, rating: 4.6, description: 'Land of joy, culture & the Royal Bengal Tiger' },
  { name: 'Rajasthan', capital: 'Jaipur', image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800', places: 82, rating: 4.8, description: 'Land of kings, forts & vibrant culture' },
  { name: 'Kerala', capital: 'Thiruvananthapuram', image: 'https://images.unsplash.com/photo-1593693411515-c20261bcad6e?w=800', places: 56, rating: 4.7, description: 'God\'s Own Country with backwaters & tea gardens' },
  { name: 'Goa', capital: 'Panaji', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800', places: 38, rating: 4.7, description: 'India\'s beach paradise with Portuguese heritage' },
  { name: 'Himachal Pradesh', capital: 'Shimla', image: 'https://images.unsplash.com/photo-1593693411515-c20261bcad6e?w=800', places: 64, rating: 4.8, description: 'Devbhoomi - Land of Gods & Himalayan peaks' },
  { name: 'Tamil Nadu', capital: 'Chennai', image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800', places: 72, rating: 4.6, description: 'Land of ancient temples & rich traditions' },
];

const travelGuides = [
  { title: 'Complete Guide to Taj Mahal', category: 'Heritage', image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800', readTime: '8 min read', author: 'Rahul Sharma', date: 'Jan 15, 2024' },
  { title: 'Best Beaches in Goa', category: 'Beach', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800', readTime: '6 min read', author: 'Priya Patel', date: 'Jan 12, 2024' },
  { title: 'Darjeeling Travel Guide', category: 'Hill Station', image: 'https://images.unsplash.com/photo-1593693411515-c20261bcad6e?w=800', readTime: '10 min read', author: 'Amit Kumar', date: 'Jan 10, 2024' },
];

const testimonials = [
  { name: 'Rahul Sharma', role: 'Travel Enthusiast', avatar: 'RS', text: 'Amazing platform! Found the best hidden gems in Rajasthan. The itineraries were spot on and saved us hours of planning.', rating: 5, location: 'Delhi' },
  { name: 'Priya Patel', role: 'Photographer', avatar: 'PP', text: 'Love the detailed information about each place. Made my photography trip so much easier! The best time to visit info was accurate.', rating: 5, location: 'Mumbai' },
  { name: 'Amit Kumar', role: 'Family Traveler', avatar: 'AK', text: 'Perfect for family trips. The budget estimations helped us plan our Kerala vacation perfectly. Highly recommend for families!', rating: 5, location: 'Bangalore' },
  { name: 'Sneha Singh', role: 'Solo Traveler', avatar: 'SS', text: 'As a solo female traveler, the safety tips and emergency contacts were invaluable. Felt secure throughout my Himalayan trip.', rating: 4, location: 'Pune' },
];

const stats = [
  { icon: MapPin, value: '500+', label: 'Destinations' },
  { icon: Users, value: '50K+', label: 'Happy Travelers' },
  { icon: Star, value: '4.8', label: 'Average Rating' },
  { icon: Globe, value: '28', label: 'States Covered' },
];

const heroSlides = [
  { image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1600', title: 'Discover Incredible India', subtitle: 'Explore 500+ destinations across 28 states', tag: 'Heritage' },
  { image: 'https://images.unsplash.com/photo-1597074836924-8e13c0e81655?w=1600', title: 'Mystic Himalayas Await', subtitle: 'Find peace in the mountains of North India', tag: 'Adventure' },
  { image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1600', title: 'Sun-kissed Beaches', subtitle: 'Relax on India\'s pristine coastal paradise', tag: 'Beach' },
  { image: 'https://images.unsplash.com/photo-1593693411515-c20261bcad6e?w=1600', title: 'God\'s Own Country', subtitle: 'Experience the beauty of Kerala backwaters', tag: 'Nature' },
];

function AnimatedCounter({ value, suffix = '' }: { value: string; suffix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const numericValue = parseFloat(value.replace(/[^0-9.]/g, ''));
  const hasPlus = value.includes('+');
  const hasK = value.includes('K');

  return (
    <span ref={ref}>
      {isInView ? (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {hasK ? `${(numericValue / 1000).toFixed(0)}K` : numericValue}{hasPlus ? '+' : ''}{suffix}
        </motion.span>
      ) : (
        value
      )}
    </span>
  );
}

function ParallaxImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      <img src={src} alt={alt} className="w-full h-full object-cover" />
    </motion.div>
  );
}

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [email, setEmail] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeCategory, setActiveCategory] = useState('All');
  const [isScrolled, setIsScrolled] = useState(false);

  // Fetch data from backend
  const { data: statesData } = useStates({ limit: 10 });
  const { data: placesData, isLoading: placesLoading, isFetching: placesFetching } = usePlaces({
    limit: 9,
    category: activeCategory !== 'All' ? activeCategory : undefined,
  });
  const { data: categoriesData } = useCategories();
  const { isFavorite, toggle } = useToggleFavorite();

  const states = statesData?.data || [];
  const places = placesData?.data || [];

  const categories = categoryConfig.map((config) => {
    const apiCategory = categoriesData?.data?.find((c) => c.name === config.name);
    return {
      ...config,
      count: apiCategory?.count || 0,
    };
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery || selectedState) {
      const params = new URLSearchParams();
      if (searchQuery) params.set('q', searchQuery);
      if (selectedState) params.set('state', selectedState);
      window.location.href = `/search?${params.toString()}`;
    }
  };

  return (
    <div className="overflow-hidden">
      {/* ==================== HERO SECTION ==================== */}
      <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
        {/* Background Slides */}
        {heroSlides.map((slide, index) => (
          <motion.div
            key={index}
            className="absolute inset-0"
            animate={{ opacity: index === currentSlide ? 1 : 0 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80" />
          </motion.div>
        ))}

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8"
            >
              <Sparkles className="h-4 w-4 text-yellow-400" />
              <span className="text-sm font-medium">Explore 500+ Destinations Across India</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight tracking-tight">
              <motion.span
                key={currentSlide}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.8 }}
                className="block"
              >
                {heroSlides[currentSlide].title}
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-lg md:text-xl text-white/80 mb-12 max-w-2xl mx-auto"
            >
              {heroSlides[currentSlide].subtitle}
            </motion.p>
          </motion.div>

          {/* Search Box */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-2 border border-white/20 shadow-2xl">
              <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Where do you want to go?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-14 bg-transparent border-0 text-white placeholder:text-white/50 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-2xl"
                  />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                  <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="h-14 pl-12 pr-10 bg-transparent border-0 text-white rounded-2xl focus:outline-none focus:ring-0 appearance-none cursor-pointer min-w-[180px]"
                  >
                    <option value="" className="text-gray-900 bg-white">All States</option>
                    <option value="west-bengal" className="text-gray-900 bg-white">West Bengal</option>
                    <option value="rajasthan" className="text-gray-900 bg-white">Rajasthan</option>
                    <option value="kerala" className="text-gray-900 bg-white">Kerala</option>
                    <option value="goa" className="text-gray-900 bg-white">Goa</option>
                    <option value="himachal-pradesh" className="text-gray-900 bg-white">Himachal Pradesh</option>
                    <option value="tamil-nadu" className="text-gray-900 bg-white">Tamil Nadu</option>
                  </select>
                </div>
                <Button type="submit" size="lg" className="h-14 px-8 rounded-2xl bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-semibold shadow-lg">
                  <Search className="h-5 w-5 mr-2" />
                  Explore
                </Button>
              </form>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-wrap justify-center gap-8 md:gap-12 mt-12"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="h-6 w-6 text-white/60 mx-auto mb-2" />
                <p className="text-2xl md:text-3xl font-bold">
                  <AnimatedCounter value={stat.value} />
                </p>
                <p className="text-sm text-white/60">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-32 md:bottom-40 left-1/2 -translate-x-1/2 flex gap-3 z-10">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`transition-all duration-500 rounded-full ${
                index === currentSlide
                  ? 'w-12 h-3 bg-white'
                  : 'w-3 h-3 bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 z-10"
        >
          <ChevronDown className="h-8 w-8" />
        </motion.div>
      </section>

      {/* ==================== CATEGORIES SECTION ==================== */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50/50 dark:from-gray-950 dark:to-gray-900/50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <Badge className="mb-4 px-4 py-1.5 bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400 border-blue-200 dark:border-blue-800">
              <Compass className="h-3 w-3 mr-1" />
              Explore by Category
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              Popular <span className="text-gradient">Categories</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
              Discover India's diverse destinations categorized by your travel preferences
            </p>
          </motion.div>

          <motion.div
            key={activeCategory}
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {categories.map((category, index) => (
              <motion.div key={category.name} variants={fadeInUp}>
                <Link href={`/search?category=${encodeURIComponent(category.name)}`}>
                  <Card className="card-hover border-0 overflow-hidden group cursor-pointer bg-white dark:bg-gray-800/50 shadow-sm hover:shadow-xl">
                    <CardContent className="p-6 text-center relative">
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                        <category.icon className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="font-semibold text-lg mb-1">{category.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{category.count} places</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">{category.description}</p>
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowRight className="h-4 w-4 text-blue-600" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ==================== TRENDING DESTINATIONS ==================== */}
      <section className="py-24 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInUp}
            className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6"
          >
            <div>
              <Badge className="mb-4 px-4 py-1.5 bg-orange-50 text-orange-700 dark:bg-orange-950/50 dark:text-orange-400 border-orange-200 dark:border-orange-800">
                <TrendingUp className="h-3 w-3 mr-1" />
                Trending Now
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                Trending <span className="text-gradient">Destinations</span>
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">Most visited places this season</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {['All', 'Heritage', 'Hill Station', 'Beach', 'Wildlife', 'Adventure'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeCategory === cat
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {placesFetching && !places.length ? [...Array(6)].map((_, index) => (
              <div key={index} className="h-96 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />
            )) : places.length > 0 ? places.slice(0, 6).map((place: any, index: number) => (
              <motion.div key={place._id || place.slug} variants={fadeInUp}>
                <Link href={`/places/${place.slug}`}>
                  <Card className="card-hover border-0 overflow-hidden group cursor-pointer bg-white dark:bg-gray-800/50 shadow-sm hover:shadow-xl">
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={place.images?.[0] || place.image}
                        alt={place.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                      {/* Top badges */}
                      <div className="absolute top-4 left-4 flex gap-2">
                        {place.category?.slice(0, 2).map((cat: string) => (
                          <Badge key={cat} className="bg-white/90 backdrop-blur-sm text-gray-900 font-medium">
                            {cat}
                          </Badge>
                        ))}
                        {place.entryFee?.toLowerCase().includes('free') && (
                          <Badge className="bg-emerald-500/90 backdrop-blur-sm text-white font-medium">
                            Free Entry
                          </Badge>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="absolute top-4 right-4 flex gap-2">
                        <button
                          type="button"
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(place._id); }}
                          className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-lg"
                          aria-label={isFavorite(place._id) ? 'Remove from favorites' : 'Add to favorites'}
                        >
                          <Heart className={cn('h-4 w-4', isFavorite(place._id) ? 'fill-red-500 text-red-500' : 'text-gray-700')} />
                        </button>
                      </div>

                      {/* Bottom info */}
                      <div className="absolute bottom-4 left-4 text-white">
                        <h3 className="text-xl font-bold mb-1">{place.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-white/80">
                          <MapPin className="h-4 w-4" />
                          {typeof place.city === 'object' ? place.city?.name : ''}{typeof place.state === 'object' && place.state?.name ? `, ${place.state.name}` : ''}
                        </div>
                      </div>

                      {/* Rating badge */}
                      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-semibold text-gray-900">{formatRating(place.rating)}</span>
                      </div>

                      {/* Video badge */}
                      {place.videos && place.videos.length > 0 && (
                        <div className="absolute top-4 right-4 bg-red-500/90 backdrop-blur-sm rounded-full p-2">
                          <Play className="h-4 w-4 text-white fill-white" />
                        </div>
                      )}
                    </div>

                    <CardContent className="p-5">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {place.bestTimeToVisit || 'Year-round'}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t dark:border-gray-700">
                        <div>
                          <span className="text-xs text-gray-500">Entry from</span>
                          <p className="font-bold text-blue-600 text-lg">{place.entryFee || 'Free'}</p>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Eye className="h-4 w-4" />
                          {place.reviews?.length || 0} reviews
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            )) : (
              <div className="col-span-full text-center py-12 text-gray-500">
                No destinations found for this category
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link href="/places">
              <Button size="lg" className="rounded-full px-8 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 shadow-lg shadow-blue-600/25">
                View All Destinations
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ==================== POPULAR STATES ==================== */}
      <section className="py-24 bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-900/50 dark:to-gray-950">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <Badge className="mb-4 px-4 py-1.5 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800">
              <Globe className="h-3 w-3 mr-1" />
              States of India
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              Popular <span className="text-gradient">States</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
              Each state has its own unique culture, cuisine, and attractions waiting to be explored
            </p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {states.length > 0 ? states.map((state: any, index: number) => (
              <motion.div key={state._id || state.slug} variants={fadeInUp}>
                <Link href={`/states/${state.slug}`}>
                  <Card className="card-hover border-0 overflow-hidden group cursor-pointer bg-white dark:bg-gray-800/50 shadow-sm hover:shadow-xl">
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={state.image}
                        alt={state.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                      <div className="absolute top-4 left-4">
                        <Badge className="bg-white/90 backdrop-blur-sm text-gray-900">
                          <MapPin className="h-3 w-3 mr-1" />
                          {state.capital}
                        </Badge>
                      </div>

                      <div className="absolute bottom-4 left-4 text-white">
                        <h3 className="text-2xl font-bold mb-1">{state.name}</h3>
                        <p className="text-sm text-white/80 line-clamp-1">{state.description}</p>
                      </div>
                    </div>
                    <CardContent className="p-5">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                          <MapPin className="h-4 w-4" />
                          {state.popularPlaces?.length || 0} tourist places
                        </div>
                        <ArrowRight className="h-5 w-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            )) : [...Array(3)].map((_, index) => (
              <div key={index} className="h-80 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link href="/states">
              <Button size="lg" variant="outline" className="rounded-full px-8">
                Explore All States
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ==================== FEATURES SECTION ==================== */}
      <section className="py-24 bg-white dark:bg-gray-950 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 relative">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <Badge className="mb-4 px-4 py-1.5 bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400 border-purple-200 dark:border-purple-800">
              <Zap className="h-3 w-3 mr-1" />
              Why Choose Us
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              Plan Your Trip <span className="text-gradient">Effortlessly</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
              Everything you need to plan the perfect Indian vacation
            </p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[
              { icon: MapPin, title: 'Detailed Guides', desc: 'Comprehensive info about every destination including history, timings, and entry fees', color: 'from-blue-500 to-cyan-500' },
              { icon: Calendar, title: 'Day-wise Itinerary', desc: 'AI-generated travel plans with morning, afternoon, and evening activities', color: 'from-emerald-500 to-green-500' },
              { icon: Wallet, title: 'Cost Estimation', desc: 'Budget, standard, and luxury options with detailed breakdown of expenses', color: 'from-orange-500 to-red-500' },
              { icon: Star, title: 'Reviews & Ratings', desc: 'Real experiences from real travelers to help you make informed decisions', color: 'from-purple-500 to-pink-500' },
              { icon: Shield, title: 'Safety Tips', desc: 'Emergency contacts, safety guidelines, and local information for every place', color: 'from-indigo-500 to-blue-500' },
              { icon: Camera, title: 'Photo Gallery', desc: 'Stunning images and videos to help you visualize your destination before visiting', color: 'from-teal-500 to-emerald-500' },
            ].map((feature, index) => (
              <motion.div key={feature.title} variants={fadeInUp}>
                <Card className="card-hover border-0 p-8 bg-white dark:bg-gray-800/50 shadow-sm hover:shadow-xl group">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.desc}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ==================== TRAVEL GUIDES / BLOGS ==================== */}
      <section className="py-24 bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-900/50 dark:to-gray-950">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInUp}
            className="flex justify-between items-end mb-12"
          >
            <div>
              <Badge className="mb-4 px-4 py-1.5 bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400 border-amber-200 dark:border-amber-800">
                <Coffee className="h-3 w-3 mr-1" />
                Travel Guides
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                Latest <span className="text-gradient">Travel Guides</span>
              </h2>
            </div>
            <Link href="/blogs" className="hidden md:flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {travelGuides.map((guide, index) => (
              <motion.div key={guide.title} variants={fadeInUp}>
                <Card className="card-hover border-0 overflow-hidden group cursor-pointer bg-white dark:bg-gray-800/50 shadow-sm hover:shadow-xl">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={guide.image}
                      alt={guide.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <Badge className="absolute top-4 left-4 bg-white/90 text-gray-900">
                      {guide.category}
                    </Badge>
                  </div>
                  <CardContent className="p-5">
                    <h3 className="text-lg font-bold mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {guide.title}
                    </h3>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-semibold">
                          {guide.author.charAt(0)}
                        </div>
                        <span>{guide.author}</span>
                      </div>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {guide.readTime}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ==================== COST ESTIMATION PREVIEW ==================== */}
      <section className="py-24 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: '-100px' }}
              variants={fadeInLeft}
            >
              <Badge className="mb-4 px-4 py-1.5 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800">
                <Wallet className="h-3 w-3 mr-1" />
                Budget Planning
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                Smart <span className="text-gradient">Cost Estimation</span>
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 leading-relaxed">
                Plan your trip budget with our detailed cost estimation tool. Get breakdowns for budget, standard, and luxury travel styles.
              </p>

              <div className="space-y-4">
                {[
                  { label: 'Budget Traveller', price: '₹2,500/day', items: 'Hotel ₹800 • Food ₹500 • Travel ₹400 • Tickets ₹300 • Shopping ₹500', color: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800' },
                  { label: 'Standard Traveller', price: '₹4,500/day', items: 'Hotel ₹2,000 • Food ₹1,000 • Travel ₹800 • Tickets ₹500 • Shopping ₹700', color: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800' },
                  { label: 'Luxury Traveller', price: '₹12,000/day', items: 'Hotel ₹8,000 • Food ₹2,500 • Travel ₹2,000 • Tickets ₹1,000 • Shopping ₹2,000', color: 'bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800' },
                ].map((plan, index) => (
                  <div key={index} className={`p-4 rounded-xl border ${plan.color}`}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold">{plan.label}</span>
                      <span className="font-bold text-lg">{plan.price}</span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{plan.items}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: '-100px' }}
              variants={fadeInRight}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800"
                  alt="Taj Mahal"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                        <Wallet className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold">Taj Mahal Trip</p>
                        <p className="text-sm text-gray-500">2 Days • Agra, UP</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-xs text-gray-500">Budget</p>
                        <p className="font-bold text-emerald-600">₹5,000</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Standard</p>
                        <p className="font-bold text-blue-600">₹9,000</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Luxury</p>
                        <p className="font-bold text-purple-600">₹24,000</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Floating elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-6 -right-6 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-xl"
              >
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold">4.9</span>
                  <span className="text-sm text-gray-500">(12.5K reviews)</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==================== TESTIMONIALS ==================== */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-emerald-600" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <Badge className="mb-4 px-4 py-1.5 bg-white/20 text-white border-white/30">
              <MessageCircle className="h-3 w-3 mr-1" />
              Testimonials
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              What Travelers Say
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto text-lg">
              Real experiences from real travelers who explored India with us
            </p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div key={testimonial.name} variants={fadeInUp}>
                <Card className="border-0 bg-white/10 backdrop-blur-md p-6 hover:bg-white/20 transition-colors">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-white/30'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-white/90 mb-6 italic leading-relaxed">"{testimonial.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-semibold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{testimonial.name}</p>
                      <p className="text-sm text-white/60">{testimonial.role} • {testimonial.location}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ==================== NEWSLETTER ==================== */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInUp}
          >
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center shadow-lg">
              <Mail className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              Stay Updated with <span className="text-gradient">Travel Tips</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-10 text-lg max-w-2xl mx-auto">
              Subscribe to our newsletter for the latest destinations, travel guides, and exclusive offers delivered to your inbox
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 flex-1 rounded-2xl text-base"
              />
              <Button size="lg" className="h-14 px-8 rounded-2xl bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 shadow-lg shadow-blue-600/25">
                <Send className="h-5 w-5 mr-2" />
                Subscribe
              </Button>
            </form>
            <p className="text-sm text-gray-500 mt-4">No spam, unsubscribe at any time. We respect your privacy.</p>
          </motion.div>
        </div>
      </section>

      {/* ==================== CTA SECTION ==================== */}
      <section className="py-24 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInUp}
            className="relative rounded-3xl overflow-hidden"
          >
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1600"
                alt="India Tourism"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-emerald-600/90" />
            </div>
            <div className="relative z-10 py-20 px-8 md:px-16 text-center text-white">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                Ready to Explore Incredible India?
              </h2>
              <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
                Start planning your dream vacation today. Discover hidden gems, plan itineraries, and create unforgettable memories.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/places">
                  <Button size="lg" className="h-14 px-8 rounded-2xl bg-white text-blue-600 hover:bg-white/90 font-semibold shadow-xl">
                    <Compass className="h-5 w-5 mr-2" />
                    Start Exploring
                  </Button>
                </Link>
                <Link href="/search">
                  <Button size="lg" className="h-14 px-8 rounded-2xl bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 border border-white/30 font-semibold shadow-xl">
                    <Search className="h-5 w-5 mr-2" />
                    Search Destinations
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
