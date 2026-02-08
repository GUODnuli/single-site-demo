'use client';

import { useState } from 'react';
import { useRouter } from '@/lib/navigation';

import { CheckoutProgress } from './CheckoutProgress';
import { OrderSummary } from './OrderSummary';
import { CustomerInfoStep } from './CustomerInfoStep';
import { ShippingAddressStep } from './ShippingAddressStep';
import { ShippingMethodStep } from './ShippingMethodStep';
import { PaymentStep } from './PaymentStep';
import { useActiveOrder } from '@/hooks/useOrder';
import { useAnalytics } from '@/hooks/useAnalytics';

export function CheckoutForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const { data: activeOrder, isLoading } = useActiveOrder();
  const router = useRouter();
  const analytics = useAnalytics();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!activeOrder || activeOrder.totalQuantity === 0) {
    return null;
  }

  // Track begin_checkout on first render
  if (currentStep === 1) {
    analytics.beginCheckout((activeOrder.totalWithTax || 0) / 100);
  }

  const handleComplete = (orderCode: string) => {
    router.push(`/checkout/confirmation?code=${orderCode}`);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <CheckoutProgress currentStep={currentStep} />

        {currentStep === 1 && (
          <CustomerInfoStep
            onNext={() => setCurrentStep(2)}
            defaultValues={
              activeOrder.customer
                ? {
                    firstName: activeOrder.customer.firstName,
                    lastName: activeOrder.customer.lastName,
                    emailAddress: activeOrder.customer.emailAddress,
                  }
                : undefined
            }
          />
        )}

        {currentStep === 2 && (
          <ShippingAddressStep
            onNext={() => setCurrentStep(3)}
            onBack={() => setCurrentStep(1)}
            defaultValues={
              activeOrder.shippingAddress
                ? {
                    fullName: activeOrder.shippingAddress.fullName,
                    streetLine1: activeOrder.shippingAddress.streetLine1,
                    streetLine2: activeOrder.shippingAddress.streetLine2,
                    city: activeOrder.shippingAddress.city,
                    province: activeOrder.shippingAddress.province,
                    postalCode: activeOrder.shippingAddress.postalCode,
                    countryCode: activeOrder.shippingAddress.country,
                    phoneNumber: activeOrder.shippingAddress.phoneNumber,
                  }
                : undefined
            }
          />
        )}

        {currentStep === 3 && (
          <ShippingMethodStep
            onNext={() => setCurrentStep(4)}
            onBack={() => setCurrentStep(2)}
            currencyCode={activeOrder.currencyCode}
          />
        )}

        {currentStep === 4 && (
          <PaymentStep
            order={activeOrder}
            onBack={() => setCurrentStep(3)}
            onComplete={handleComplete}
          />
        )}
      </div>

      <div className="lg:col-span-1">
        <div className="sticky top-24">
          <OrderSummary order={activeOrder} />
        </div>
      </div>
    </div>
  );
}
