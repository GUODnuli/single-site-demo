'use client';

import * as React from 'react';
import Image from 'next/image';
import { useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, Play, X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ProductImage {
  id: string;
  preview: string;
  source: string;
}

interface ProductGalleryProps {
  images: ProductImage[];
  videoUrl?: string;
  productName: string;
}

export function ProductGallery({ images, videoUrl, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [showVideo, setShowVideo] = useState(false);

  const currentImage = images[selectedIndex];
  const hasMultipleImages = images.length > 1;

  const goToPrevious = useCallback(() => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const goToNext = useCallback(() => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isZoomed) return;

      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setZoomPosition({ x, y });
    },
    [isZoomed]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === 'Escape') {
        setIsZoomed(false);
        setShowVideo(false);
      }
    },
    [goToPrevious, goToNext]
  );

  return (
    <div className="flex flex-col gap-4" onKeyDown={handleKeyDown} tabIndex={0}>
      {/* Main Image */}
      <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
        {showVideo && videoUrl ? (
          <div className="relative h-full w-full">
            <video
              src={videoUrl}
              controls
              autoPlay
              className="h-full w-full object-contain"
            >
              Your browser does not support the video tag.
            </video>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 bg-background/80 backdrop-blur-sm"
              onClick={() => setShowVideo(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <>
            <div
              className={cn(
                'relative h-full w-full cursor-zoom-in transition-transform',
                isZoomed && 'cursor-zoom-out'
              )}
              onClick={() => setIsZoomed(!isZoomed)}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setIsZoomed(false)}
            >
              <Image
                src={currentImage?.source || '/placeholder.jpg'}
                alt={`${productName} - Image ${selectedIndex + 1}`}
                fill
                className={cn(
                  'object-contain transition-transform duration-200',
                  isZoomed && 'scale-150'
                )}
                style={
                  isZoomed
                    ? {
                        transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                      }
                    : undefined
                }
                priority={selectedIndex === 0}
              />
            </div>

            {/* Navigation Arrows */}
            {hasMultipleImages && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPrevious();
                  }}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToNext();
                  }}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}

            {/* Zoom Indicator */}
            <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-md bg-background/80 px-2 py-1 text-xs backdrop-blur-sm">
              <ZoomIn className="h-3 w-3" />
              <span>Click to zoom</span>
            </div>

            {/* Video Button */}
            {videoUrl && (
              <Button
                variant="secondary"
                size="sm"
                className="absolute left-2 top-2"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowVideo(true);
                }}
              >
                <Play className="mr-1 h-4 w-4" />
                Watch Video
              </Button>
            )}
          </>
        )}
      </div>

      {/* Thumbnail Strip */}
      {hasMultipleImages && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelectedIndex(index)}
              className={cn(
                'relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border-2 transition-all',
                selectedIndex === index
                  ? 'border-primary ring-2 ring-primary/20'
                  : 'border-transparent hover:border-muted-foreground/30'
              )}
            >
              <Image
                src={image.preview}
                alt={`${productName} thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
          {videoUrl && (
            <button
              onClick={() => setShowVideo(true)}
              className={cn(
                'relative flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-md border-2 bg-muted transition-all',
                showVideo
                  ? 'border-primary ring-2 ring-primary/20'
                  : 'border-transparent hover:border-muted-foreground/30'
              )}
            >
              <Play className="h-6 w-6" />
            </button>
          )}
        </div>
      )}

      {/* Image Counter */}
      {hasMultipleImages && !showVideo && (
        <div className="text-center text-sm text-muted-foreground">
          {selectedIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
}
