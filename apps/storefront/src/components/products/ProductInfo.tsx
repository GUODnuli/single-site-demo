'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { Heart, Share2, FileText, Mail, Check, ShoppingCart, Minus, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useAddToCart } from '@/hooks/useOrder';

interface ProductVariant {
  id: string;
  name: string;
  priceWithTax: number;
  currencyCode: string;
  stockLevel: string;
  sku: string;
}

interface ProductInfoProps {
  product: {
    id: string;
    name: string;
    description: string;
    variants: ProductVariant[];
    customFields?: {
      material?: string;
      style?: string;
      applicationScenes?: string[];
      isNew?: boolean;
    };
  };
}

export function ProductInfo({ product }: ProductInfoProps) {
  const t = useTranslations('products');
  const analytics = useAnalytics();
  const [selectedVariant, setSelectedVariant] = React.useState<ProductVariant | null>(
    product.variants[0] || null
  );
  const [isCopied, setIsCopied] = React.useState(false);
  const [quantity, setQuantity] = React.useState(1);
  const addToCart = useAddToCart();

  const formatPrice = (price: number, currencyCode: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(price / 100);
  };

  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url,
        });
        analytics.shareProduct(product.id, 'native');
      } catch {
        // User cancelled or share failed
      }
    } else {
      await navigator.clipboard.writeText(url);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      analytics.shareProduct(product.id, 'clipboard');
    }
  };

  const handleRequestQuote = () => {
    // Track quote request
    import('@/lib/analytics').then(({ trackAnalyticsEvent }) => {
      trackAnalyticsEvent({
        eventName: 'request_quote',
        category: 'engagement',
        label: product.name,
        productId: product.id,
      });
    });

    // Navigate to contact page with product info
    const params = new URLSearchParams({
      product: product.name,
      variant: selectedVariant?.name || '',
      sku: selectedVariant?.sku || '',
    });
    window.location.href = `/contact?${params.toString()}`;
  };

  const handleDownloadSpec = () => {
    // Track download
    analytics.downloadCatalog();
    // In real app, this would download a PDF spec sheet
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Product Name & Badges */}
      <div>
        <div className="mb-2 flex flex-wrap items-center gap-2">
          {product.customFields?.isNew && (
            <Badge variant="default" className="bg-green-600">
              {t('new')}
            </Badge>
          )}
          {product.customFields?.style && (
            <Badge variant="secondary">{product.customFields.style}</Badge>
          )}
        </div>
        <h1 className="text-2xl font-bold md:text-3xl">{product.name}</h1>
        {selectedVariant && (
          <p className="mt-1 text-sm text-muted-foreground">SKU: {selectedVariant.sku}</p>
        )}
      </div>

      {/* Price Display (for display-only site, show as reference) */}
      {selectedVariant && (
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-primary">
            {formatPrice(selectedVariant.priceWithTax, selectedVariant.currencyCode)}
          </span>
          <span className="text-sm text-muted-foreground">{t('referencePrice')}</span>
        </div>
      )}

      <Separator />

      {/* Variant Selection */}
      {product.variants.length > 1 && (
        <div>
          <h3 className="mb-3 text-sm font-medium">{t('selectVariant')}</h3>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((variant) => (
              <Button
                key={variant.id}
                variant={selectedVariant?.id === variant.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedVariant(variant)}
                disabled={variant.stockLevel === 'OUT_OF_STOCK'}
              >
                {variant.name}
                {variant.stockLevel === 'OUT_OF_STOCK' && (
                  <span className="ml-1 text-xs">({t('outOfStock')})</span>
                )}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Product Attributes */}
      <div className="grid gap-4 rounded-lg bg-muted/50 p-4">
        {product.customFields?.material && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{t('material')}</span>
            <span className="text-sm font-medium">{product.customFields.material}</span>
          </div>
        )}
        {product.customFields?.style && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{t('style')}</span>
            <span className="text-sm font-medium">{product.customFields.style}</span>
          </div>
        )}
        {selectedVariant && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{t('availability')}</span>
            <span
              className={`text-sm font-medium ${
                selectedVariant.stockLevel === 'IN_STOCK'
                  ? 'text-green-600'
                  : selectedVariant.stockLevel === 'LOW_STOCK'
                    ? 'text-yellow-600'
                    : 'text-red-600'
              }`}
            >
              {selectedVariant.stockLevel === 'IN_STOCK'
                ? t('inStock')
                : selectedVariant.stockLevel === 'LOW_STOCK'
                  ? t('lowStock')
                  : t('outOfStock')}
            </span>
          </div>
        )}
      </div>

      {/* Application Scenes */}
      {product.customFields?.applicationScenes &&
        product.customFields.applicationScenes.length > 0 && (
          <div>
            <h3 className="mb-2 text-sm font-medium">{t('applicationScenes')}</h3>
            <div className="flex flex-wrap gap-2">
              {product.customFields.applicationScenes.map((scene) => (
                <Badge key={scene} variant="outline">
                  {scene}
                </Badge>
              ))}
            </div>
          </div>
        )}

      <Separator />

      {/* Quantity Selector */}
      {selectedVariant && selectedVariant.stockLevel !== 'OUT_OF_STOCK' && (
        <div>
          <h3 className="mb-2 text-sm font-medium">{t('quantity')}</h3>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-12 text-center text-sm font-medium">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              onClick={() => setQuantity(quantity + 1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col gap-3">
        <Button
          size="lg"
          className="w-full"
          onClick={() => {
            if (!selectedVariant) return;
            addToCart.mutate(
              { productVariantId: selectedVariant.id, quantity },
              {
                onSuccess: (data) => {
                  if (data && !data.errorCode) {
                    analytics.addToCart(product.id, quantity, selectedVariant.priceWithTax);
                    setQuantity(1);
                  }
                },
              }
            );
          }}
          disabled={
            !selectedVariant ||
            selectedVariant.stockLevel === 'OUT_OF_STOCK' ||
            addToCart.isPending
          }
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {addToCart.isPending ? t('adding') : t('addToCart')}
        </Button>

        <Button variant="outline" size="lg" className="w-full" onClick={handleRequestQuote}>
          <Mail className="mr-2 h-4 w-4" />
          {t('requestQuote')}
        </Button>

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={handleDownloadSpec}>
            <FileText className="mr-2 h-4 w-4" />
            {t('downloadSpec')}
          </Button>
          <Button variant="outline" size="icon" onClick={handleShare}>
            {isCopied ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <Share2 className="h-4 w-4" />
            )}
          </Button>
          <Button variant="outline" size="icon">
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Brief Description */}
      {product.description && (
        <div>
          <h3 className="mb-2 text-sm font-medium">{t('description')}</h3>
          <p className="text-sm text-muted-foreground line-clamp-4">{product.description}</p>
        </div>
      )}
    </div>
  );
}
