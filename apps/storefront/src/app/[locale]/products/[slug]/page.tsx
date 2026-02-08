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
import { serverGraphqlClient } from '@/lib/graphql-client';
import { GET_PRODUCT } from '@/lib/queries/products.graphql';

interface ProductPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

async function getProduct(slug: string) {
  try {
    const data: any = await serverGraphqlClient.request(GET_PRODUCT, { slug });
    return data.product || null;
  } catch {
    return null;
  }
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
      images: product.featuredAsset?.preview ? [product.featuredAsset.preview] : [],
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

  // Map Vendure assets to gallery format
  const images = product.assets?.length > 0
    ? product.assets.map((asset: any) => ({
        id: asset.id,
        preview: asset.preview,
        source: asset.source,
      }))
    : product.featuredAsset
      ? [{ id: product.featuredAsset.id, preview: product.featuredAsset.preview, source: product.featuredAsset.source || product.featuredAsset.preview }]
      : [];

  // Map variants to the expected format
  const mappedProduct = {
    id: product.id,
    name: product.name,
    description: product.description,
    variants: product.variants.map((v: any) => ({
      id: v.id,
      name: v.name,
      priceWithTax: v.priceWithTax,
      currencyCode: v.currencyCode,
      stockLevel: v.stockLevel || 'IN_STOCK',
      sku: v.sku,
    })),
    customFields: {
      material: product.customFields?.material,
      style: product.customFields?.style,
      applicationScenes: product.customFields?.applicationScenes,
      isNew: product.customFields?.isNew,
      isFeatured: product.customFields?.isFeatured,
    },
  };

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
        <ProductGallery
          images={images}
          videoUrl={product.customFields?.videoUrl}
          productName={product.name}
        />

        {/* Product Info */}
        <ProductInfo product={mappedProduct} />
      </div>

      {/* Product Tabs (Details, Specifications, etc.) */}
      <ProductTabs
        description={product.description}
        specifications={{}}
        applicationScenes={product.customFields?.applicationScenes || []}
      />

      {/* Related Products */}
      <RelatedProducts currentProductId={product.id} />
    </div>
  );
}
