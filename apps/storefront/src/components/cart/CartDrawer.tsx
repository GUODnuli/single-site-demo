'use client';

import { useTranslations } from 'next-intl';
import { ShoppingCart } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { CartItem } from './CartItem';
import { CartBadge } from './CartBadge';
import { useActiveOrder } from '@/hooks/useOrder';
import { Link } from '@/lib/navigation';
import { useState } from 'react';

export function CartDrawer() {
  const t = useTranslations('cart');
  const { data: activeOrder, isLoading } = useActiveOrder();
  const [open, setOpen] = useState(false);

  const lines = activeOrder?.lines || [];
  const totalQuantity = activeOrder?.totalQuantity || 0;
  const currencyCode = activeOrder?.currencyCode || 'USD';

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(price / 100);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setOpen(true)}
      >
        <ShoppingCart className="h-5 w-5" />
        <CartBadge />
        <span className="sr-only">{t('title')}</span>
      </Button>

      <SheetContent side="right" className="flex w-full flex-col sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{t('title')}</SheetTitle>
          <SheetDescription>
            {totalQuantity > 0
              ? t('itemCount', { count: totalQuantity })
              : t('empty')}
          </SheetDescription>
        </SheetHeader>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4">
            <ShoppingCart className="h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">{t('empty')}</p>
            <Button asChild onClick={() => setOpen(false)}>
              <Link href="/products">{t('continueShopping')}</Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto py-4">
              {lines.map((line: any) => (
                <div key={line.id}>
                  <CartItem line={line} currencyCode={currencyCode} />
                  <Separator />
                </div>
              ))}
            </div>

            {/* Cart Footer */}
            <div className="space-y-4 border-t pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t('subtotal')}</span>
                <span className="text-sm font-medium">
                  {formatPrice(activeOrder?.subTotalWithTax || 0)}
                </span>
              </div>
              {activeOrder?.shippingWithTax > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t('shipping')}</span>
                  <span className="text-sm font-medium">
                    {formatPrice(activeOrder.shippingWithTax)}
                  </span>
                </div>
              )}
              <Separator />
              <div className="flex items-center justify-between">
                <span className="font-medium">{t('total')}</span>
                <span className="font-bold">
                  {formatPrice(activeOrder?.totalWithTax || 0)}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <Button asChild className="w-full" onClick={() => setOpen(false)}>
                  <Link href="/checkout">{t('checkout')}</Link>
                </Button>
                <Button
                  variant="outline"
                  asChild
                  className="w-full"
                  onClick={() => setOpen(false)}
                >
                  <Link href="/cart">{t('viewCart')}</Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
