import { MapMarker } from '@/components/map';

export function createPlaceMarkers(places: any[]): MapMarker[] {
  return places
    .filter((p) => p.location?.latitude && p.location?.longitude)
    .map((place) => ({
      id: place._id || place.slug,
      name: place.name,
      lat: place.location.latitude,
      lng: place.location.longitude,
      type: 'place' as const,
      description: place.description?.substring(0, 100) + '...',
      extraInfo: {
        ...(place.category && { Category: Array.isArray(place.category) ? place.category.join(', ') : place.category }),
        ...(place.entryFee && { 'Entry Fee': place.entryFee }),
        ...(place.rating && { Rating: `${place.rating}/5` }),
      },
      link: `/places/${place.slug}`,
    }));
}

export function createHotelMarkers(hotels: any[]): MapMarker[] {
  return hotels
    .filter((h) => h.location?.latitude && h.location?.longitude)
    .map((hotel) => ({
      id: hotel._id || hotel.slug,
      name: hotel.name,
      lat: hotel.location.latitude,
      lng: hotel.location.longitude,
      type: 'hotel' as const,
      description: hotel.address,
      extraInfo: {
        ...(hotel.starRating && { Stars: `${hotel.starRating}★` }),
        ...(hotel.pricePerNight && { 'Price/Night': `₹${hotel.pricePerNight}` }),
        ...(hotel.distance && { Distance: hotel.distance }),
      },
    }));
}

export function createRestaurantMarkers(restaurants: any[]): MapMarker[] {
  return restaurants
    .filter((r) => r.location?.latitude && r.location?.longitude)
    .map((restaurant) => ({
      id: restaurant._id || restaurant.slug,
      name: restaurant.name,
      lat: restaurant.location.latitude,
      lng: restaurant.location.longitude,
      type: 'restaurant' as const,
      description: restaurant.cuisine?.join(', '),
      extraInfo: {
        ...(restaurant.averageCost && { 'Avg Cost': `₹${restaurant.averageCost}/person` }),
        ...(restaurant.rating && { Rating: `${restaurant.rating}/5` }),
        ...(restaurant.distance && { Distance: restaurant.distance }),
      },
    }));
}

export function createNearbySpotMarkers(spots: any[]): MapMarker[] {
  return spots
    .filter((s) => s.place?.location?.latitude && s.place?.location?.longitude)
    .map((spot) => ({
      id: spot.place._id || spot.place.slug,
      name: spot.place.name,
      lat: spot.place.location.latitude,
      lng: spot.place.location.longitude,
      type: 'nearby' as const,
      extraInfo: {
        ...(spot.distance && { Distance: spot.distance }),
        ...(spot.travelTime && { 'Travel Time': spot.travelTime }),
        ...(spot.entryFee && { 'Entry Fee': spot.entryFee }),
        ...(spot.category && { Category: spot.category }),
      },
      link: `/places/${spot.place.slug}`,
    }));
}

export function createCityMarkers(cities: any[]): MapMarker[] {
  return cities
    .filter((c) => c.location?.latitude && c.location?.longitude)
    .map((city) => ({
      id: city._id || city.slug,
      name: city.name,
      lat: city.location.latitude,
      lng: city.location.longitude,
      type: 'city' as const,
      description: city.description?.substring(0, 80) + '...',
      extraInfo: {
        ...(city.popularPlaces && { Places: `${city.popularPlaces.length} spots` }),
      },
      link: `/cities/${city.slug}`,
    }));
}
