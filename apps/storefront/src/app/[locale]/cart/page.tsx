'use client';

import { useTranslations } from 'next-intl';
import { ShoppingCart, ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CartItem } from '@/components/cart/CartItem';
import { useActiveOrder } from '@/hooks/useOrder';
import { Link } from '@/lib/navigation';

export default function CartPage() {
  const t = useTranslations('cart');
  const { data: activeOrder, isLoading } = useActiveOrder();

  const lines = activeOrder?.lines || [];
  const currencyCode = activeOrder?.currencyCode || 'USD';

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

  if (lines.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center gap-6">
          <ShoppingCart className="h-16 w-16 text-muted-foreground" />
          <h1 className="text-2xl font-bold">{t('emptyTitle')}</h1>
          <p className="text-muted-foreground">{t('emptyDescription')}</p>
          <Button asChild>
            <Link href="/products">{t('continueShopping')}</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold md:text-3xl">{t('title')}</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border p-4">
            {lines.map((line: any, index: number) => (
              <div key={line.id}>
                <CartItem line={line} currencyCode={currencyCode} />
                {index < lines.length - 1 && <Separator />}
              </div>
            ))}
          </div>

          <div className="mt-4">
            <Button variant="outline" asChild>
              <Link href="/products">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('continueShopping')}
              </Link>
            </Button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="rounded-lg border p-6">
            <h2 className="mb-4 text-lg font-semibold">{t('orderSummary')}</h2>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('subtotal')}</span>
                <span>{formatPrice(activeOrder?.subTotalWithTax || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('shipping')}</span>
                <span className="text-sm text-muted-foreground">{t('calculatedAtCheckout')}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>{t('total')}</span>
                <span>{formatPrice(activeOrder?.totalWithTax || 0)}</span>
              </div>
            </div>

            <Button asChild className="mt-6 w-full" size="lg">
              <Link href="/checkout">{t('proceedToCheckout')}</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
