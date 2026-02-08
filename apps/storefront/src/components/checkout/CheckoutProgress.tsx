'use client';

import { useTranslations } from 'next-intl';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CheckoutProgressProps {
  currentStep: number;
}

export function CheckoutProgress({ currentStep }: CheckoutProgressProps) {
  const t = useTranslations('checkout');

  const steps = [
    { number: 1, label: t('steps.information') },
    { number: 2, label: t('steps.shipping') },
    { number: 3, label: t('steps.delivery') },
    { number: 4, label: t('steps.payment') },
  ];

  return (
    <nav aria-label="Checkout progress" className="mb-8">
      <ol className="flex items-center justify-between">
        {steps.map((step, index) => (
          <li key={step.number} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors',
                  currentStep > step.number
                    ? 'border-primary bg-primary text-primary-foreground'
                    : currentStep === step.number
                      ? 'border-primary bg-background text-primary'
                      : 'border-muted-foreground/30 bg-background text-muted-foreground'
                )}
              >
                {currentStep > step.number ? (
                  <Check className="h-4 w-4" />
                ) : (
                  step.number
                )}
              </div>
              <span
                className={cn(
                  'mt-1 text-xs',
                  currentStep >= step.number
                    ? 'font-medium text-foreground'
                    : 'text-muted-foreground'
                )}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  'mx-2 h-0.5 w-8 sm:w-16 md:w-24',
                  currentStep > step.number ? 'bg-primary' : 'bg-muted-foreground/30'
                )}
              />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
