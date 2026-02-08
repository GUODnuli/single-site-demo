'use client';

import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { CheckCircle2, Package, ArrowRight } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Link } from '@/lib/navigation';
import { useOrderByCode } from '@/hooks/useOrder';

export default function OrderConfirmationPage() {
  const t = useTranslations('checkout');
  const searchParams = useSearchParams();
  const orderCode = searchParams.get('code') || '';
  const { data: order, isLoading } = useOrderByCode(orderCode);

  const currencyCode = order?.currencyCode || 'USD';

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(price / 100);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center gap-4">
          <p className="text-muted-foreground">{t('orderNotFound')}</p>
          <Button asChild>
            <Link href="/">{t('backToHome')}</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      {/* Success Header */}
      <div className="mb-8 text-center">
        <div className="mb-4 flex justify-center">
          <CheckCircle2 className="h-16 w-16 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold md:text-3xl">{t('orderConfirmed')}</h1>
        <p className="mt-2 text-muted-foreground">
          {t('orderConfirmedDescription')}
        </p>
        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2">
          <Package className="h-4 w-4" />
          <span className="text-sm font-medium">
            {t('orderNumber')}: <strong>{order.code}</strong>
          </span>
        </div>
      </div>

      {/* Order Details */}
      <div className="rounded-lg border p-6">
        {/* Customer Info */}
        {order.customer && (
          <div className="mb-4">
            <p className="text-sm font-medium">{t('contact')}</p>
            <p className="text-sm text-muted-foreground">
              {order.customer.firstName} {order.customer.lastName}
            </p>
            <p className="text-sm text-muted-foreground">{order.customer.emailAddress}</p>
          </div>
        )}

        {/* Shipping Address */}
        {order.shippingAddress && (
          <div className="mb-4">
            <p className="text-sm font-medium">{t('shipTo')}</p>
            <p className="text-sm text-muted-foreground">
              {order.shippingAddress.fullName}
            </p>
            <p className="text-sm text-muted-foreground">
              {order.shippingAddress.streetLine1}
              {order.shippingAddress.streetLine2 && `, ${order.shippingAddress.streetLine2}`}
            </p>
            <p className="text-sm text-muted-foreground">
              {order.shippingAddress.city}
              {order.shippingAddress.province && `, ${order.shippingAddress.province}`}
              {' '}{order.shippingAddress.postalCode}
            </p>
          </div>
        )}

        <Separator className="my-4" />

        {/* Order Items */}
        <div className="space-y-3">
          {order.lines?.map((line: any) => (
            <div key={line.id} className="flex gap-3">
              <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded border bg-muted">
                {line.productVariant?.product?.featuredAsset?.preview ? (
                  <Image
                    src={line.productVariant.product.featuredAsset.preview}
                    alt={line.productVariant.product.name}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[10px] text-muted-foreground">
                    No img
                  </div>
                )}
              </div>
              <div className="flex flex-1 items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{line.productVariant?.product?.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {line.productVariant?.name} x {line.quantity}
                  </p>
                </div>
                <span className="text-sm font-medium">
                  {formatPrice(line.linePriceWithTax)}
                </span>
              </div>
            </div>
          ))}
        </div>

        <Separator className="my-4" />

        {/* Totals */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t('subtotal')}</span>
            <span>{formatPrice(order.subTotalWithTax || 0)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t('shipping')}</span>
            <span>{formatPrice(order.shippingWithTax || 0)}</span>
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between text-lg font-bold">
            <span>{t('total')}</span>
            <span>{formatPrice(order.totalWithTax || 0)}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-col items-center gap-4">
        <Button asChild size="lg">
          <Link href="/products">
            {t('continueShopping')}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
