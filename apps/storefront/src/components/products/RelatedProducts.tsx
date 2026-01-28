'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface RelatedProduct {
  id: string;
  name: string;
  slug: string;
  featuredAsset?: {
    preview: string;
  };
  priceWithTax: {
    min: number;
    max: number;
  };
  currencyCode: string;
  customFields?: {
    isNew?: boolean;
    style?: string;
  };
}

interface RelatedProductsProps {
  products: RelatedProduct[];
  title?: string;
}

export function RelatedProducts({ products, title }: RelatedProductsProps) {
  const t = useTranslations('products');
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);

  const checkScrollability = React.useCallback(() => {
    const container = scrollContainerRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 10
      );
    }
  }, []);

  React.useEffect(() => {
    checkScrollability();
    window.addEventListener('resize', checkScrollability);
    return () => window.removeEventListener('resize', checkScrollability);
  }, [checkScrollability]);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = container.clientWidth * 0.8;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
      setTimeout(checkScrollability, 300);
    }
  };

  const formatPrice = (price: number, currencyCode: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
    }).format(price / 100);
  };

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold md:text-2xl">
          {title || t('relatedProducts')}
        </h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className="hidden md:flex"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className="hidden md:flex"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        onScroll={checkScrollability}
        className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-4 scrollbar-hide md:mx-0 md:px-0"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.slug}`}
            className="min-w-[200px] flex-shrink-0 md:min-w-[250px]"
            style={{ scrollSnapAlign: 'start' }}
          >
            <Card className="h-full overflow-hidden transition-shadow hover:shadow-lg">
              <div className="relative aspect-square">
                <Image
                  src={product.featuredAsset?.preview || '/placeholder.jpg'}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
                {product.customFields?.isNew && (
                  <Badge className="absolute left-2 top-2 bg-green-600">
                    {t('new')}
                  </Badge>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="mb-1 line-clamp-2 text-sm font-medium">
                  {product.name}
                </h3>
                {product.customFields?.style && (
                  <p className="mb-2 text-xs text-muted-foreground">
                    {product.customFields.style}
                  </p>
                )}
                <div className="text-sm font-bold text-primary">
                  {product.priceWithTax.min === product.priceWithTax.max
                    ? formatPrice(product.priceWithTax.min, product.currencyCode)
                    : `${formatPrice(product.priceWithTax.min, product.currencyCode)} - ${formatPrice(product.priceWithTax.max, product.currencyCode)}`}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
