'use client';

import Image from 'next/image';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { useAdjustOrderLine, useRemoveOrderLine } from '@/hooks/useOrder';

interface CartItemProps {
  line: {
    id: string;
    quantity: number;
    linePriceWithTax: number;
    unitPriceWithTax: number;
    productVariant: {
      id: string;
      name: string;
      sku: string;
      product: {
        id: string;
        name: string;
        slug: string;
        featuredAsset?: {
          id: string;
          preview: string;
        } | null;
      };
    };
  };
  currencyCode: string;
}

export function CartItem({ line, currencyCode }: CartItemProps) {
  const t = useTranslations('cart');
  const adjustLine = useAdjustOrderLine();
  const removeLine = useRemoveOrderLine();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(price / 100);
  };

  const imageUrl = line.productVariant.product.featuredAsset?.preview;

  return (
    <div className="flex gap-3 py-3">
      {/* Product Image */}
      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border bg-muted">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={line.productVariant.product.name}
            fill
            className="object-cover"
            sizes="80px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
            No image
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <h4 className="text-sm font-medium leading-tight">
            {line.productVariant.product.name}
          </h4>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {line.productVariant.name}
          </p>
        </div>

        <div className="flex items-center justify-between">
          {/* Quantity Controls */}
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() =>
                adjustLine.mutate({
                  orderLineId: line.id,
                  quantity: line.quantity - 1,
                })
              }
              disabled={line.quantity <= 1 || adjustLine.isPending}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-8 text-center text-sm">{line.quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() =>
                adjustLine.mutate({
                  orderLineId: line.id,
                  quantity: line.quantity + 1,
                })
              }
              disabled={adjustLine.isPending}
            >
              <Plus className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-destructive hover:text-destructive"
              onClick={() => removeLine.mutate(line.id)}
              disabled={removeLine.isPending}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>

          {/* Price */}
          <span className="text-sm font-medium">
            {formatPrice(line.linePriceWithTax)}
          </span>
        </div>
      </div>
    </div>
  );
}
