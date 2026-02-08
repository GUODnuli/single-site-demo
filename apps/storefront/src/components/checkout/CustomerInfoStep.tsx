'use client';

import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSetCustomerForOrder } from '@/hooks/useOrder';

const customerSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  emailAddress: z.string().email(),
});

type CustomerFormData = z.infer<typeof customerSchema>;

interface CustomerInfoStepProps {
  onNext: () => void;
  defaultValues?: Partial<CustomerFormData>;
}

export function CustomerInfoStep({ onNext, defaultValues }: CustomerInfoStepProps) {
  const t = useTranslations('checkout');
  const setCustomer = useSetCustomerForOrder();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerFormData>({
    defaultValues: {
      firstName: defaultValues?.firstName || '',
      lastName: defaultValues?.lastName || '',
      emailAddress: defaultValues?.emailAddress || '',
    },
  });

  const onSubmit = async (data: CustomerFormData) => {
    const result = await setCustomer.mutateAsync(data);
    if (result && !result.errorCode) {
      onNext();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h2 className="mb-1 text-xl font-semibold">{t('customerInfo')}</h2>
        <p className="text-sm text-muted-foreground">{t('guestCheckoutNote')}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="firstName">{t('firstName')}</Label>
          <Input
            id="firstName"
            {...register('firstName', { required: true })}
            placeholder={t('firstNamePlaceholder')}
            className={errors.firstName ? 'border-destructive' : ''}
          />
          {errors.firstName && (
            <p className="text-xs text-destructive">{t('required')}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">{t('lastName')}</Label>
          <Input
            id="lastName"
            {...register('lastName', { required: true })}
            placeholder={t('lastNamePlaceholder')}
            className={errors.lastName ? 'border-destructive' : ''}
          />
          {errors.lastName && (
            <p className="text-xs text-destructive">{t('required')}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="emailAddress">{t('email')}</Label>
        <Input
          id="emailAddress"
          type="email"
          {...register('emailAddress', {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          })}
          placeholder={t('emailPlaceholder')}
          className={errors.emailAddress ? 'border-destructive' : ''}
        />
        {errors.emailAddress && (
          <p className="text-xs text-destructive">{t('validEmail')}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={setCustomer.isPending}
      >
        {setCustomer.isPending ? t('saving') : t('continueToShipping')}
      </Button>
    </form>
  );
}
