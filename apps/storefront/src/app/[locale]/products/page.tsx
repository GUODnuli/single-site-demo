import { Suspense } from 'react';
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

import { ProductList } from '@/components/products/ProductList';
import { ProductFilter } from '@/components/products/ProductFilter';
import { ProductListSkeleton } from '@/components/products/ProductListSkeleton';

interface ProductsPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    category?: string;
    material?: string;
    style?: string;
    sort?: string;
    page?: string;
  }>;
}

export async function generateMetadata({ params }: ProductsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'products' });

  return {
    title: t('title'),
    description: 'Browse our complete collection of premium curtains and window treatments.',
  };
}

export default async function ProductsPage({ params, searchParams }: ProductsPageProps) {
  const { locale } = await params;
  const filters = await searchParams;
  setRequestLocale(locale);

  const t = await getTranslations('products');

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{t('title')}</h1>
        <p className="mt-2 text-muted-foreground">
          Discover our premium collection of curtains and window treatments
        </p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Sidebar Filters */}
        <aside className="w-full shrink-0 lg:w-64">
          <ProductFilter
            currentCategory={filters.category}
            currentMaterial={filters.material}
            currentStyle={filters.style}
          />
        </aside>

        {/* Product Grid */}
        <main className="flex-1">
          <Suspense fallback={<ProductListSkeleton />}>
            <ProductList
              category={filters.category}
              material={filters.material}
              style={filters.style}
              sort={filters.sort}
              page={filters.page ? parseInt(filters.page) : 1}
            />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
