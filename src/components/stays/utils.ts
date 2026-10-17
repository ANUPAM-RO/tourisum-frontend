import type { LucideIcon } from 'lucide-react';
import {
  BellRing,
  Car,
  Coffee,
  Dumbbell,
  Flower2,
  Plane,
  Shirt,
  Sparkles,
  UtensilsCrossed,
  Waves,
  Wifi,
} from 'lucide-react';

export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

const amenityIcons: Record<string, LucideIcon> = {
  'free wifi': Wifi,
  wifi: Wifi,
  parking: Car,
  breakfast: Coffee,
  'swimming pool': Waves,
  pool: Waves,
  gym: Dumbbell,
  spa: Flower2,
  restaurant: UtensilsCrossed,
  'airport shuttle': Plane,
  'room service': BellRing,
  laundry: Shirt,
};

/** Icon for an amenity label, with a neutral fallback for anything unmapped. */
export function amenityIcon(amenity: string): LucideIcon {
  return amenityIcons[amenity.trim().toLowerCase()] ?? Sparkles;
}

export function formatINR(value?: number | null) {
  return `₹${Math.round(value || 0).toLocaleString('en-IN')}`;
}

/** ₹ – ₹₹₹₹ price band from an average cost for one. */
export function priceLevel(cost?: number | null) {
  if (!cost) return 0;
  if (cost < 400) return 1;
  if (cost < 900) return 2;
  if (cost < 1800) return 3;
  return 4;
}

export function uniqueCuisines(cuisine?: string[] | null) {
  return Array.from(new Set((cuisine ?? []).filter(Boolean)));
}

export const dietLabel: Record<string, string> = {
  veg: 'Pure Veg',
  'non-veg': 'Non-Veg',
  both: 'Veg & Non-Veg',
};

/** Google Maps link — prefers the stored link, then coordinates, then the address. */
export function directionsUrl(item: {
  googleMapLink?: string;
  location?: { latitude?: number; longitude?: number };
  address?: string;
  name?: string;
}) {
  if (item.googleMapLink) return item.googleMapLink;
  if (item.location?.latitude && item.location?.longitude) {
    return `https://www.google.com/maps/dir/?api=1&destination=${item.location.latitude},${item.location.longitude}`;
  }
  const q = [item.name, item.address].filter(Boolean).join(', ');
  return q ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}` : '';
}
