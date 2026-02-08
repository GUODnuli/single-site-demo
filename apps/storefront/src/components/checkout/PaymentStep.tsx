'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ShieldCheck, AlertCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useTransitionOrderToState, useAddPayment } from '@/hooks/useOrder';
import { useAnalytics } from '@/hooks/useAnalytics';

interface PaymentStepProps {
  order: any;
  onBack: () => void;
  onComplete: (orderCode: string) => void;
}

export function PaymentStep({ order, onBack, onComplete }: PaymentStepProps) {
  const t = useTranslations('checkout');
  const transitionState = useTransitionOrderToState();
  const addPayment = useAddPayment();
  const analytics = useAnalytics();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const currencyCode = order?.currencyCode || 'USD';

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(price / 100);
  };

  const handlePlaceOrder = async () => {
    setError(null);
    setIsProcessing(true);

    try {
      // Step 1: Transition to ArrangingPayment
      const transitionResult = await transitionState.mutateAsync('ArrangingPayment');
      if (transitionResult?.transitionError) {
        setError(transitionResult.message || t('transitionError'));
        setIsProcessing(false);
        return;
      }

      // Step 2: Add payment using dummy handler
      const paymentResult = await addPayment.mutateAsync({
        method: 'dummy-payment-handler',
        metadata: {},
      });

      if (paymentResult?.errorCode) {
        setError(paymentResult.message || t('paymentError'));
        setIsProcessing(false);
        return;
      }

      // Step 3: Success - track and redirect
      const orderCode = paymentResult?.code || order?.code;
      analytics.purchase(orderCode, (order?.totalWithTax || 0) / 100);
      onComplete(orderCode);
    } catch (err: any) {
      setError(err.message || t('paymentError'));
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-1 text-xl font-semibold">{t('reviewAndPay')}</h2>
        <p className="text-sm text-muted-foreground">{t('reviewNote')}</p>
      </div>

      {/* Demo Payment Notice */}
      <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950">
        <ShieldCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
        <div>
          <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
            {t('demoPaymentTitle')}
          </p>
          <p className="mt-1 text-sm text-blue-600 dark:text-blue-300">
            {t('demoPaymentDescription')}
          </p>
        </div>
      </div>

      {/* Order Review */}
      {order && (
        <div className="space-y-3 rounded-lg border p-4">
          {order.customer && (
            <div>
              <p className="text-sm font-medium">{t('contact')}</p>
              <p className="text-sm text-muted-foreground">
                {order.customer.firstName} {order.customer.lastName} ({order.customer.emailAddress})
              </p>
            </div>
          )}
          {order.shippingAddress && (
            <div>
              <p className="text-sm font-medium">{t('shipTo')}</p>
              <p className="text-sm text-muted-foreground">
                {order.shippingAddress.streetLine1}
                {order.shippingAddress.streetLine2 && `, ${order.shippingAddress.streetLine2}`}
                , {order.shippingAddress.city}
                {order.shippingAddress.province && `, ${order.shippingAddress.province}`}
                {' '}{order.shippingAddress.postalCode}, {order.shippingAddress.country}
              </p>
            </div>
          )}
          {order.shippingLines?.[0] && (
            <div>
              <p className="text-sm font-medium">{t('deliveryMethod')}</p>
              <p className="text-sm text-muted-foreground">
                {order.shippingLines[0].shippingMethod?.name} — {formatPrice(order.shippingLines[0].priceWithTax)}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <AlertCircle className="mt-0.5 h-4 w-4 text-destructive" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={onBack}
          disabled={isProcessing}
        >
          {t('back')}
        </Button>
        <Button
          className="flex-1"
          size="lg"
          onClick={handlePlaceOrder}
          disabled={isProcessing}
        >
          {isProcessing ? t('processing') : t('placeOrder')}
        </Button>
      </div>
    </div>
  );
}
