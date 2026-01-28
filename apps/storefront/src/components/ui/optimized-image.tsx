'use client';

import * as React from 'react';
import Image, { ImageProps } from 'next/image';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends Omit<ImageProps, 'onLoad'> {
  fallback?: string;
  aspectRatio?: 'square' | 'video' | 'portrait' | 'wide';
}

const aspectRatioClasses = {
  square: 'aspect-square',
  video: 'aspect-video',
  portrait: 'aspect-[3/4]',
  wide: 'aspect-[16/9]',
};

/**
 * Optimized Image component with:
 * - Blur placeholder while loading
 * - Fallback image on error
 * - Lazy loading by default
 * - Aspect ratio support
 */
export function OptimizedImage({
  src,
  alt,
  className,
  fallback = '/placeholder.jpg',
  aspectRatio,
  fill,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  const imageSrc = error ? fallback : src;

  return (
    <div
      className={cn(
        'relative overflow-hidden bg-muted',
        aspectRatio && aspectRatioClasses[aspectRatio],
        className
      )}
    >
      <Image
        src={imageSrc}
        alt={alt}
        fill={fill ?? true}
        className={cn(
          'object-cover transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100'
        )}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setError(true);
          setIsLoading(false);
        }}
        loading="lazy"
        sizes={props.sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
        {...props}
      />
      {isLoading && (
        <div className="absolute inset-0 animate-pulse bg-muted" />
      )}
    </div>
  );
}
