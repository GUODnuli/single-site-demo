'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

// Placeholder products - will be fetched from Vendure
const newProducts = [
  {
    id: 1,
    name: 'Velvet Blackout Curtain',
    slug: 'velvet-blackout-curtain',
    price: 8999,
    currency: 'USD',
    image: '/images/product-1.jpg',
    isNew: true,
  },
  {
    id: 2,
    name: 'Linen Sheer Panel',
    slug: 'linen-sheer-panel',
    price: 4999,
    currency: 'USD',
    image: '/images/product-2.jpg',
    isNew: true,
  },
  {
    id: 3,
    name: 'Embroidered Voile',
    slug: 'embroidered-voile',
    price: 6999,
    currency: 'USD',
    image: '/images/product-3.jpg',
    isNew: true,
  },
  {
    id: 4,
    name: 'Thermal Insulated Drape',
    slug: 'thermal-insulated-drape',
    price: 7999,
    currency: 'USD',
    image: '/images/product-4.jpg',
    isNew: true,
  },
];

function formatPrice(amount: number, currency: string) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount / 100);
}

export function NewProducts() {
  const t = useTranslations('home');

  return (
    <section className="bg-muted/30 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h2 className="mb-2 text-3xl font-bold tracking-tight md:text-4xl">{t('newArrivals')}</h2>
            <p className="text-muted-foreground">Discover our latest additions</p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/products?sort=newest">{t('viewAll', { ns: 'common' })}</Link>
          </Button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {newProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={`/products/${product.slug}`}>
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
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
