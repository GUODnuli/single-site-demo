'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';

export function CompanyStory() {
  const t = useTranslations('about');

  return (
    <section className="py-8">
      <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
          <Image
            src="/placeholder.jpg"
            alt="Our factory"
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h2 className="mb-4 text-2xl font-bold">{t('ourStory')}</h2>
          <p className="mb-4 text-muted-foreground leading-relaxed">
            {t('storyContent')}
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Today, we serve clients in over 50 countries, providing premium window treatment
            solutions that combine traditional craftsmanship with modern innovation. Our
            commitment to quality, sustainability, and customer satisfaction remains at the
            heart of everything we do.
          </p>
        </div>
      </div>
    </section>
  );
}
