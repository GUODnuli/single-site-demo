'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Truck } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useEligibleShippingMethods, useSetShippingMethod } from '@/hooks/useOrder';

interface ShippingMethodStepProps {
  onNext: () => void;
  onBack: () => void;
  currencyCode?: string;
}

export function ShippingMethodStep({ onNext, onBack, currencyCode = 'USD' }: ShippingMethodStepProps) {
  const t = useTranslations('checkout');
  const { data: methods, isLoading } = useEligibleShippingMethods();
  const setShippingMethod = useSetShippingMethod();
  const [selectedMethodId, setSelectedMethodId] = useState<string | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(price / 100);
  };

  const handleContinue = async () => {
    if (!selectedMethodId) return;
    const result = await setShippingMethod.mutateAsync(selectedMethodId);
    if (result && !result.errorCode) {
      onNext();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-1 text-xl font-semibold">{t('deliveryMethod')}</h2>
        <p className="text-sm text-muted-foreground">{t('deliveryMethodNote')}</p>
      </div>

      <div className="space-y-3">
        {methods?.map((method: any) => (
          <button
            key={method.id}
            type="button"
            onClick={() => setSelectedMethodId(method.id)}
            className={cn(
              'flex w-full items-center gap-4 rounded-lg border p-4 text-left transition-colors',
              selectedMethodId === method.id
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
            )}
          >
            <div
              className={cn(
                'flex h-5 w-5 items-center justify-center rounded-full border-2',
                selectedMethodId === method.id
                  ? 'border-primary'
                  : 'border-muted-foreground/30'
              )}
            >
              {selectedMethodId === method.id && (
                <div className="h-2.5 w-2.5 rounded-full bg-primary" />
              )}
            </div>
            <Truck className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="font-medium">{method.name}</p>
              {method.description && (
                <p className="text-sm text-muted-foreground">{method.description}</p>
              )}
            </div>
            <span className="font-medium">
              {method.priceWithTax > 0 ? formatPrice(method.priceWithTax) : t('free')}
            </span>
          </button>
        ))}

        {(!methods || methods.length === 0) && (
          <p className="text-center text-muted-foreground">{t('noShippingMethods')}</p>
        )}
      </div>

      <div className="flex gap-3">
        <Button type="button" variant="outline" className="flex-1" onClick={onBack}>
          {t('back')}
        </Button>
        <Button
          className="flex-1"
          size="lg"
          onClick={handleContinue}
          disabled={!selectedMethodId || setShippingMethod.isPending}
        >
          {setShippingMethod.isPending ? t('saving') : t('continueToPayment')}
        </Button>
      </div>
    </div>
  );
}
