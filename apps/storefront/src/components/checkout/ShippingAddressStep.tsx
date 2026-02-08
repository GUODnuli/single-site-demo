'use client';

import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSetShippingAddress } from '@/hooks/useOrder';

interface AddressFormData {
  fullName: string;
  streetLine1: string;
  streetLine2: string;
  city: string;
  province: string;
  postalCode: string;
  countryCode: string;
  phoneNumber: string;
}

interface ShippingAddressStepProps {
  onNext: () => void;
  onBack: () => void;
  defaultValues?: Partial<AddressFormData>;
}

export function ShippingAddressStep({ onNext, onBack, defaultValues }: ShippingAddressStepProps) {
  const t = useTranslations('checkout');
  const setAddress = useSetShippingAddress();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormData>({
    defaultValues: {
      fullName: defaultValues?.fullName || '',
      streetLine1: defaultValues?.streetLine1 || '',
      streetLine2: defaultValues?.streetLine2 || '',
      city: defaultValues?.city || '',
      province: defaultValues?.province || '',
      postalCode: defaultValues?.postalCode || '',
      countryCode: defaultValues?.countryCode || 'US',
      phoneNumber: defaultValues?.phoneNumber || '',
    },
  });

  const onSubmit = async (data: AddressFormData) => {
    const result = await setAddress.mutateAsync(data);
    if (result && !result.errorCode) {
      onNext();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h2 className="mb-1 text-xl font-semibold">{t('shippingAddress')}</h2>
        <p className="text-sm text-muted-foreground">{t('shippingAddressNote')}</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="fullName">{t('fullName')}</Label>
        <Input
          id="fullName"
          {...register('fullName', { required: true })}
          placeholder={t('fullNamePlaceholder')}
          className={errors.fullName ? 'border-destructive' : ''}
        />
        {errors.fullName && (
          <p className="text-xs text-destructive">{t('required')}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="streetLine1">{t('addressLine1')}</Label>
        <Input
          id="streetLine1"
          {...register('streetLine1', { required: true })}
          placeholder={t('addressLine1Placeholder')}
          className={errors.streetLine1 ? 'border-destructive' : ''}
        />
        {errors.streetLine1 && (
          <p className="text-xs text-destructive">{t('required')}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="streetLine2">{t('addressLine2')}</Label>
        <Input
          id="streetLine2"
          {...register('streetLine2')}
          placeholder={t('addressLine2Placeholder')}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="city">{t('city')}</Label>
          <Input
            id="city"
            {...register('city', { required: true })}
            placeholder={t('cityPlaceholder')}
            className={errors.city ? 'border-destructive' : ''}
          />
          {errors.city && (
            <p className="text-xs text-destructive">{t('required')}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="province">{t('province')}</Label>
          <Input
            id="province"
            {...register('province')}
            placeholder={t('provincePlaceholder')}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="postalCode">{t('postalCode')}</Label>
          <Input
            id="postalCode"
            {...register('postalCode', { required: true })}
            placeholder={t('postalCodePlaceholder')}
            className={errors.postalCode ? 'border-destructive' : ''}
          />
          {errors.postalCode && (
            <p className="text-xs text-destructive">{t('required')}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneNumber">{t('phone')}</Label>
          <Input
            id="phoneNumber"
            type="tel"
            {...register('phoneNumber')}
            placeholder={t('phonePlaceholder')}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="countryCode">{t('country')}</Label>
        <Input
          id="countryCode"
          {...register('countryCode', { required: true })}
          placeholder="US"
          className={errors.countryCode ? 'border-destructive' : ''}
        />
        {errors.countryCode && (
          <p className="text-xs text-destructive">{t('required')}</p>
        )}
      </div>

      <div className="flex gap-3">
        <Button type="button" variant="outline" className="flex-1" onClick={onBack}>
          {t('back')}
        </Button>
        <Button
          type="submit"
          className="flex-1"
          size="lg"
          disabled={setAddress.isPending}
        >
          {setAddress.isPending ? t('saving') : t('continueToDelivery')}
        </Button>
      </div>
    </form>
  );
}
