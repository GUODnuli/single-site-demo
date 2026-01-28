import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

import { ProductGallery } from '@/components/products/ProductGallery';
import { ProductInfo } from '@/components/products/ProductInfo';
import { ProductTabs } from '@/components/products/ProductTabs';
import { RelatedProducts } from '@/components/products/RelatedProducts';
import { ProductViewTracker } from '@/components/products/ProductViewTracker';
import { Breadcrumb } from '@/components/ui/breadcrumb';

interface ProductPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

// Mock product data - replace with actual API call
async function getProduct(slug: string) {
  // Simulated product data
  const products: Record<string, any> = {
    'velvet-blackout-curtain': {
      id: '1',
      name: 'Velvet Blackout Curtain',
      slug: 'velvet-blackout-curtain',
      description: 'Luxurious velvet curtains with complete blackout functionality. Perfect for bedrooms and media rooms.',
      price: 8999,
      currency: 'USD',
      images: [
        { id: '1', url: '/images/product-1.jpg', alt: 'Velvet Blackout Curtain' },
        { id: '2', url: '/images/product-1-2.jpg', alt: 'Velvet Blackout Curtain Detail' },
      ],
      variants: [
        { id: 'v1', name: 'Navy Blue - 52"x84"', price: 8999, sku: 'VBC-NB-5284' },
        { id: 'v2', name: 'Charcoal Gray - 52"x84"', price: 8999, sku: 'VBC-CG-5284' },
        { id: 'v3', name: 'Burgundy - 52"x84"', price: 9499, sku: 'VBC-BG-5284' },
      ],
      customFields: {
        material: 'Premium Velvet',
        style: 'Modern Luxury',
        videoUrl: null,
        applicationScenes: ['Bedroom', 'Living Room', 'Media Room'],
        isNew: true,
        isFeatured: true,
      },
      specifications: {
        'Material': '100% Polyester Velvet',
        'Lining': 'Triple-weave blackout lining',
        'Header Type': 'Rod pocket / Back tab',
        'Care': 'Dry clean recommended',
        'Light Blocking': '99%+',
      },
    },
  };

  return products[slug] || null;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return { title: 'Product Not Found' };
  }

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images[0]?.url ? [product.images[0].url] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const product = await getProduct(slug);
  const t = await getTranslations('products');

  if (!product) {
    notFound();
  }

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: t('title'), href: '/products' },
    { label: product.name, href: `/products/${slug}` },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Analytics: Track product view */}
      <ProductViewTracker productId={product.id} locale={locale} />

      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} className="mb-6" />

      {/* Product Main Section */}
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Gallery */}
        <ProductGallery images={product.images} productName={product.name} />

        {/* Product Info */}
        <ProductInfo product={product} />
      </div>

      {/* Product Tabs (Details, Specifications, etc.) */}
      <ProductTabs
        description={product.description}
        specifications={product.specifications}
        applicationScenes={product.customFields.applicationScenes}
      />

      {/* Related Products */}
      <RelatedProducts currentProductId={product.id} />
    </div>
  );
}
