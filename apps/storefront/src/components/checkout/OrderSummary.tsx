'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';

import { Separator } from '@/components/ui/separator';

interface OrderSummaryProps {
  order: any;
}

export function OrderSummary({ order }: OrderSummaryProps) {
  const t = useTranslations('checkout');

  if (!order) return null;

  const currencyCode = order.currencyCode || 'USD';

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(price / 100);
  };

  return (
    <div className="rounded-lg border p-6">
      <h2 className="mb-4 text-lg font-semibold">{t('orderSummary')}</h2>

      {/* Line Items */}
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
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                {line.quantity}
              </span>
            </div>
            <div className="flex flex-1 items-center justify-between">
              <div>
                <p className="text-sm font-medium">{line.productVariant?.product?.name}</p>
                <p className="text-xs text-muted-foreground">{line.productVariant?.name}</p>
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
          <span>
            {order.shippingWithTax > 0
              ? formatPrice(order.shippingWithTax)
              : t('free')}
          </span>
        </div>
        <Separator className="my-2" />
        <div className="flex justify-between text-lg font-bold">
          <span>{t('total')}</span>
          <span>{formatPrice(order.totalWithTax || 0)}</span>
        </div>
      </div>
    </div>
  );
}
