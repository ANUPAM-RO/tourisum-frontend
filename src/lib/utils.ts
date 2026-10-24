import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Requests an appropriately sized, compressed image from Unsplash; other URLs pass through unchanged.
// Wikimedia only serves thumbnails at these standard widths.
const WIKIMEDIA_WIDTHS = [120, 250, 330, 500, 960, 1280, 1920]

export function optimizeImage(url?: string | null, width: number = 800) {
  if (!url) return ''
  if (url.includes('wikimedia.org/') && url.includes('/thumb/')) {
    const size = WIKIMEDIA_WIDTHS.find((w) => w >= width) ?? 1920
    return url.replace(/\/\d+px-([^/]+)$/, `/${size}px-$1`)
  }
  if (!url.includes('images.unsplash.com')) return url
  const [base] = url.split('?')
  return `${base}?w=${width}&q=75&auto=format&fit=crop`
}

export function formatRating(rating?: number | string | null, fallback: string = '4.5') {
  const num = typeof rating === 'string' ? parseFloat(rating) : rating
  if (num === undefined || num === null || isNaN(num)) return fallback
  return num.toFixed(1)
}
