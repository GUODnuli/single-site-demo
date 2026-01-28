import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { ContactForm } from '@/components/contact/ContactForm';
import { ContactInfo } from '@/components/contact/ContactInfo';
import { ContactMap } from '@/components/contact/ContactMap';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('contact');

  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

// Company contact information - In production, fetch from CMS
const contactInfo = {
  address: '123 Business Park, Suite 456, New York, NY 10001, USA',
  phone: '+1 (555) 123-4567',
  email: 'info@curtainshowcase.com',
  hours: 'Monday - Friday: 9:00 AM - 6:00 PM EST',
  mapCoordinates: {
    lat: 40.7128,
    lng: -74.006,
  },
  socialLinks: {
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    linkedin: 'https://linkedin.com',
    twitter: 'https://twitter.com',
  },
};

interface ContactPageProps {
  searchParams: Promise<{
    product?: string;
    variant?: string;
    sku?: string;
  }>;
}

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const t = await getTranslations('contact');
  const params = await searchParams;

  // Pre-fill message if coming from product page
  const prefilledMessage =
    params.product
      ? `I'm interested in: ${params.product}${params.variant ? ` (${params.variant})` : ''}${params.sku ? ` - SKU: ${params.sku}` : ''}\n\nPlease provide more information about this product.`
      : '';

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-12 text-center">
        <h1 className="mb-2 text-3xl font-bold md:text-4xl">{t('title')}</h1>
        <p className="text-muted-foreground">{t('subtitle')}</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Contact Form */}
        <div>
          <ContactForm prefilledMessage={prefilledMessage} />
        </div>

        {/* Contact Info & Map */}
        <div className="space-y-6">
          <ContactInfo info={contactInfo} />
          <ContactMap
            lat={contactInfo.mapCoordinates.lat}
            lng={contactInfo.mapCoordinates.lng}
            address={contactInfo.address}
          />
        </div>
      </div>
    </div>
  );
}
