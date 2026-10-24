export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
  phone?: string;
  favorites: string[];
  createdAt: string;
  updatedAt: string;
}

export interface State {
  _id: string;
  name: string;
  slug: string;
  description: string;
  capital: string;
  image: string;
  gallery: string[];
  popularCities: City[];
  popularPlaces: Place[];
  weather: {
    summer: string;
    winter: string;
    monsoon: string;
  };
  bestTimeToVisit: string;
  localLanguage: string;
  emergencyNumbers: {
    police: string;
    ambulance: string;
    fire: string;
  };
  published: boolean;
  seo: {
    title: string;
    metaDescription: string;
    keywords: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface City {
  _id: string;
  name: string;
  slug: string;
  state: string | State;
  description: string;
  image: string;
  gallery: string[];
  location: {
    latitude: number;
    longitude: number;
  };
  weather: {
    summer: string;
    winter: string;
    monsoon: string;
  };
  bestTimeToVisit: string;
  popularPlaces: Place[];
  hotels: Hotel[];
  restaurants: Restaurant[];
  transportation: {
    nearestAirport: {
      name: string;
      distance: string;
      cabCost: string;
    };
    nearestStation: {
      name: string;
      distance: string;
      taxiFare: string;
    };
    busStand: {
      name: string;
      autoFare: string;
    };
  };
  estimatedBudget: {
    budget: { hotel: string; food: string; travel: string; tickets: string; shopping: string; total: string };
    standard: { hotel: string; food: string; travel: string; tickets: string; shopping: string; total: string };
    luxury: { hotel: string; food: string; travel: string; tickets: string; shopping: string; total: string };
  };
  localFoods: string[];
  travelTips: {
    dos: string[];
    donts: string[];
    safety: string[];
  };
  published: boolean;
  seo: {
    title: string;
    metaDescription: string;
    keywords: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface Place {
  _id: string;
  name: string;
  slug: string;
  description: string;
  state: string | State;
  city: string | City;
  location: {
    latitude: number;
    longitude: number;
  };
  category: string[];
  bestTimeToVisit: string;
  openingTime: string;
  closingTime: string;
  entryFee: string;
  images: string[];
  videos: string[];
  history: string;
  highlights: string[];
  thingsToKnow: string[];
  photography: boolean;
  weather: {
    summer: string;
    winter: string;
    monsoon: string;
  };
  safetyTips: string[];
  nearbySpots: {
    place: Place;
    distance: string;
    travelTime: string;
    entryFee: string;
    category: string;
  }[];
  hotels: Hotel[];
  restaurants: Restaurant[];
  transportation: {
    byFlight: {
      nearestAirport: string;
      distance: string;
      cabCost: string;
    };
    byTrain: {
      nearestStation: string;
      distance: string;
      taxiFare: string;
    };
    byBus: {
      busStand: string;
      autoFare: string;
    };
    privateCab: string;
    bikeRental: string;
  };
  estimatedCost: {
    budget: { hotel: string; food: string; travel: string; tickets: string; shopping: string; total: string };
    standard: { hotel: string; food: string; travel: string; tickets: string; shopping: string; total: string };
    luxury: { hotel: string; food: string; travel: string; tickets: string; shopping: string; total: string };
  };
  bestMonths: {
    month: string;
    temperature: string;
    crowd: string;
    recommendation: string;
  }[];
  localFoods: string[];
  travelTips: {
    dos: string[];
    donts: string[];
    safety: string[];
  };
  localLanguage: string;
  emergencyNumbers: {
    police: string;
    ambulance: string;
    fire: string;
  };
  faqs: { question: string; answer: string }[];
  rating: number;
  reviews: {
    user: User;
    rating: number;
    comment: string;
    photos: string[];
    createdAt: string;
  }[];
  published: boolean;
  seo: {
    title: string;
    metaDescription: string;
    keywords: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface Hotel {
  _id: string;
  name: string;
  slug: string;
  description: string;
  address: string;
  location: {
    latitude: number;
    longitude: number;
  };
  googleMapLink: string;
  phone: string;
  website: string;
  starRating: number;
  pricePerNight: number;
  amenities: string[];
  images: string[];
  distance: string;
  category: string[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Restaurant {
  _id: string;
  name: string;
  slug: string;
  description: string;
  cuisine: string[];
  address: string;
  location: {
    latitude: number;
    longitude: number;
  };
  googleMapLink: string;
  phone: string;
  website: string;
  averageCost: number;
  openingTime: string;
  closingTime: string;
  images: string[];
  vegNonVeg: 'veg' | 'non-veg' | 'both';
  rating: number;
  distance: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Itinerary {
  _id: string;
  place: string | Place;
  title: string;
  slug: string;
  duration: number;
  days: {
    day: number;
    title: string;
    morning: {
      activity: string;
      location: string;
      time: string;
      estimatedCost: string;
    }[];
    breakfast: {
      name: string;
      location: string;
      cost: string;
    };
    lunch: {
      name: string;
      location: string;
      cost: string;
    };
    afternoon: {
      activity: string;
      location: string;
      time: string;
      estimatedCost: string;
    }[];
    dinner: {
      name: string;
      location: string;
      cost: string;
    };
    nightStay: {
      hotel: string;
      cost: string;
    };
    estimatedExpense: string;
  }[];
  totalCost: {
    budget: string;
    standard: string;
    luxury: string;
  };
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TourDeparture {
  _id: string;
  startDate: string;
  seatsTotal: number;
  seatsBooked: number;
  /** Present on public API responses. */
  seatsLeft?: number;
}

export interface TourDay {
  day: number;
  title: string;
  description: string;
  meals: string[];
  stay: string;
}

export interface TourPlace {
  _id: string;
  name: string;
  slug: string;
  images?: string[];
  rating?: number;
  category?: string[];
  state?: { name: string; slug: string };
}

/** A hotel the tour books for its guests, entered on the admin tour form. */
export interface TourHotel {
  name: string;
  image: string;
  location: string;
  googleMapLink: string;
  starRating: number;
  pricePerNight: number;
}

export interface Tour {
  _id: string;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  coverImage: string;
  gallery: string[];
  places: TourPlace[];
  startCity: string;
  endCity: string;
  durationDays: number;
  durationNights: number;
  /** Per person, 2 in a room (twin sharing). */
  price: number;
  /** Per person, 3–4 in a room. Not offered when empty. */
  priceQuad?: number | null;
  originalPrice?: number;
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  groupSize: number;
  tags: string[];
  departures: TourDeparture[];
  /** First upcoming departure with seats left (public API only). */
  nextDeparture?: TourDeparture | null;
  highlights: string[];
  itinerary: TourDay[];
  /** Missing on the tour list endpoint. */
  hotels?: TourHotel[];
  inclusions: string[];
  exclusions: string[];
  thingsToCarry: string[];
  featured: boolean;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';
/** Number of rooms of each size: double = 2 per room, triple = 3, quad = 4. */
export interface RoomPlan {
  double: number;
  triple: number;
  quad: number;
}

export interface Booking {
  _id: string;
  reference: string;
  tour: { _id: string; slug: string; coverImage?: string } | string | null;
  tourTitle: string;
  departure: string;
  departureDate: string;
  name: string;
  email: string;
  phone: string;
  adults: number;
  children: number;
  message: string;
  /** Missing on bookings made before room planning. */
  rooms?: RoomPlan;
  /** Per person, 2 in a room, at booking time. */
  pricePerPerson: number;
  /** Per person, 3–4 in a room, at booking time. */
  priceQuad?: number | null;
  totalPrice: number;
  status: BookingStatus;
  adminNote: string;
  createdAt: string;
}

export interface Blog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  author: User;
  image: string;
  category: string;
  tags: string[];
  published: boolean;
  seo: {
    title: string;
    metaDescription: string;
    keywords: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  pagination?: {
    total: number;
    page: number;
    pages: number;
  };
  message?: string;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  description: string;
  contact: {
    agentName: string;
    agentTitle: string;
    phone: string;
    whatsapp: string;
    email: string;
    address: string;
    workingHours: string;
    mapUrl: string;
  };
  highlights: string[];
  about: {
    heading: string;
    intro: string;
    story: string;
    mission: string;
    vision: string;
    image: string;
  };
  social: {
    facebook: string;
    instagram: string;
    twitter: string;
    youtube: string;
  };
}

/** Lightweight place used for map pins (`GET /places/map`). */
export interface MapPlace {
  _id: string;
  name: string;
  slug: string;
  state: { _id: string; name: string; slug: string } | null;
  location: { latitude: number; longitude: number };
  category: string[];
  rating: number;
  image: string | null;
}
