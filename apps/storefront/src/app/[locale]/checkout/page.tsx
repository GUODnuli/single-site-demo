'use client';

import { useTranslations } from 'next-intl';
import { CheckoutForm } from '@/components/checkout/CheckoutForm';
import { useActiveOrder } from '@/hooks/useOrder';
import { Link } from '@/lib/navigation';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

export default function CheckoutPage() {
  const t = useTranslations('checkout');
  const { data: activeOrder, isLoading } = useActiveOrder();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  if (!activeOrder || activeOrder.totalQuantity === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center gap-6">
          <ShoppingCart className="h-16 w-16 text-muted-foreground" />
          <h1 className="text-2xl font-bold">{t('emptyCart')}</h1>
          <p className="text-muted-foreground">{t('emptyCartDescription')}</p>
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
      <CheckoutForm />
    </div>
  );
}
