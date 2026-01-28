'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ProductListProps {
  category?: string;
  material?: string;
  style?: string;
  sort?: string;
  page?: number;
}

// Mock products data - replace with actual API call
const mockProducts = [
  {
    id: '1',
    name: 'Velvet Blackout Curtain',
    slug: 'velvet-blackout-curtain',
    price: 8999,
    currency: 'USD',
    image: '/images/product-1.jpg',
    isNew: true,
    isFeatured: true,
  },
  {
    id: '2',
    name: 'Linen Sheer Panel',
    slug: 'linen-sheer-panel',
    price: 4999,
    currency: 'USD',
    image: '/images/product-2.jpg',
    isNew: true,
    isFeatured: false,
  },
  {
    id: '3',
    name: 'Embroidered Voile',
    slug: 'embroidered-voile',
    price: 6999,
    currency: 'USD',
    image: '/images/product-3.jpg',
    isNew: false,
    isFeatured: true,
  },
  {
    id: '4',
    name: 'Thermal Insulated Drape',
    slug: 'thermal-insulated-drape',
    price: 7999,
    currency: 'USD',
    image: '/images/product-4.jpg',
    isNew: true,
    isFeatured: false,
  },
  {
    id: '5',
    name: 'Jacquard Pattern Curtain',
    slug: 'jacquard-pattern-curtain',
    price: 9999,
    currency: 'USD',
    image: '/images/product-5.jpg',
    isNew: false,
    isFeatured: true,
  },
  {
    id: '6',
    name: 'Cotton Blend Curtain',
    slug: 'cotton-blend-curtain',
    price: 5499,
    currency: 'USD',
    image: '/images/product-6.jpg',
    isNew: false,
    isFeatured: false,
  },
];

function formatPrice(amount: number, currency: string) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount / 100);
}

export function ProductList({ category, material, style, sort, page = 1 }: ProductListProps) {
  const t = useTranslations('products');

  // In real app, fetch products based on filters
  const products = mockProducts;
  const totalProducts = products.length;

  return (
    <div>
      {/* Sort & Results Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {products.length} of {totalProducts} products
        </p>

        <Select defaultValue={sort || 'newest'}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t('sortBy')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">{t('newest')}</SelectItem>
            <SelectItem value="price-asc">{t('priceAsc')}</SelectItem>
            <SelectItem value="price-desc">{t('priceDesc')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Product Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Link key={product.id} href={`/products/${product.slug}`}>
            <Card className="group overflow-hidden transition-shadow hover:shadow-lg">
              {/* Image */}
              <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  <span>Product Image</span>
                </div>
                {product.isNew && (
                  <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                    New
                  </span>
                )}
                {product.isFeatured && !product.isNew && (
                  <span className="absolute left-3 top-3 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                    Featured
                  </span>
                )}
                <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/5" />
              </div>

              {/* Content */}
              <CardContent className="p-4">
                <h3 className="mb-1 font-medium transition-colors group-hover:text-primary">
                  {product.name}
                </h3>
                <p className="text-lg font-semibold">
                  {formatPrice(product.price, product.currency)}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-8 flex justify-center gap-2">
        <Button variant="outline" disabled={page <= 1}>
          Previous
        </Button>
        <Button variant="outline" className="bg-primary text-primary-foreground">
          1
        </Button>
        <Button variant="outline">2</Button>
        <Button variant="outline">3</Button>
        <Button variant="outline">Next</Button>
      </div>
    </div>
  );
}
