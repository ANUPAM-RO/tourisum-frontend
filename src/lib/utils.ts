import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRating(rating?: number | string | null, fallback: string = '4.5') {
  const num = typeof rating === 'string' ? parseFloat(rating) : rating
  if (num === undefined || num === null || isNaN(num)) return fallback
  return num.toFixed(1)
}
