'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

// Placeholder slides - will be fetched from CMS
const slides = [
  {
    id: 1,
    title: 'Elegant Curtains for Modern Living',
    subtitle: 'Transform your space with our premium collection',
    image: '/images/hero-1.jpg',
    link: '/products',
  },
  {
    id: 2,
    title: 'Blackout Solutions',
    subtitle: 'Perfect sleep with our light-blocking designs',
    image: '/images/hero-2.jpg',
    link: '/products?category=blackout',
  },
  {
    id: 3,
    title: 'Commercial Excellence',
    subtitle: 'Professional solutions for hotels and offices',
    image: '/images/hero-3.jpg',
    link: '/cases',
  },
];

export function HeroCarousel() {
  const t = useTranslations('home');
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section className="relative overflow-hidden">
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {slides.map((slide, index) => (
            <div key={slide.id} className="relative min-w-0 flex-[0_0_100%]">
              {/* Background Image */}
              <div className="relative h-[50vh] min-h-[400px] md:h-[60vh] lg:h-[70vh]">
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/20" />
                <div className="absolute inset-0 bg-neutral-900">
                  {/* Placeholder for actual images */}
                  <div className="flex h-full items-center justify-center text-white/20">
                    <span className="text-lg">Image {slide.id}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="absolute inset-0 flex items-center">
                  <div className="container mx-auto px-4">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={selectedIndex === index ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="max-w-2xl text-white"
                    >
                      <h1 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl xl:text-6xl">
                        {slide.title}
                      </h1>
                      <p className="mb-8 text-lg text-white/80 md:text-xl">{slide.subtitle}</p>
                      <Button asChild size="lg" className="text-base">
                        <Link href={slide.link}>{t('ctaButton')}</Link>
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={scrollPrev}
        className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/40"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/40"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={cn(
              'h-2 w-2 rounded-full transition-all',
              selectedIndex === index ? 'w-8 bg-white' : 'bg-white/50 hover:bg-white/75'
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
