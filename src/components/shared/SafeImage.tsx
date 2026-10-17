'use client';

import { useState } from 'react';
import { ImageOff } from 'lucide-react';
import { cn, optimizeImage } from '@/lib/utils';

interface SafeImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string | null;
  /** Requested width for Unsplash images (ignored for other hosts). */
  width?: number;
  /** Load eagerly with high priority — use only for above-the-fold hero images. */
  priority?: boolean;
  /** Render nothing (instead of the placeholder tile) when the image is missing/broken — for backgrounds. */
  hideFallback?: boolean;
}

/**
 * <img> with lazy loading, async decoding, Unsplash resizing and a graceful
 * placeholder when the URL is missing or broken (many seeded URLs 404).
 */
export default function SafeImage({ src, width = 800, priority, hideFallback, alt = '', className, ...props }: SafeImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const url = optimizeImage(src, width);

  if (!url || failedSrc === url) {
    if (hideFallback) return null;
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn(
          'flex items-center justify-center bg-gradient-to-br from-orange-100 via-rose-50 to-amber-100 text-orange-300 dark:from-stone-800 dark:via-stone-800 dark:to-stone-700 dark:text-stone-500',
          className
        )}
      >
        <ImageOff className="h-8 w-8" />
      </div>
    );
  }

  return (
    <img
      src={url}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
      onError={() => setFailedSrc(url)}
      className={className}
      {...props}
    />
  );
}
