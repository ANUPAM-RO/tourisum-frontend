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

export interface TravelPackage {
  _id: string;
  title: string;
  slug: string;
  description: string;
  places: Place[];
  duration: number;
  price: {
    budget: number;
    standard: number;
    luxury: number;
  };
  inclusions: string[];
  exclusions: string[];
  itinerary: string;
  images: string[];
  rating: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
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
