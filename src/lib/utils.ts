import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Requests an appropriately sized, compressed image from Unsplash; other URLs pass through unchanged.
export function optimizeImage(url?: string | null, width: number = 800) {
  if (!url) return ''
  if (!url.includes('images.unsplash.com')) return url
  const [base] = url.split('?')
  return `${base}?w=${width}&q=75&auto=format&fit=crop`
}

export function formatRating(rating?: number | string | null, fallback: string = '4.5') {
  const num = typeof rating === 'string' ? parseFloat(rating) : rating
  if (num === undefined || num === null || isNaN(num)) return fallback
  return num.toFixed(1)
}
