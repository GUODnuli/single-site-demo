import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';

import { HeroCarousel } from '@/components/home/HeroCarousel';
import { CategoryNav } from '@/components/home/CategoryNav';
import { NewProducts } from '@/components/home/NewProducts';
import { Certifications } from '@/components/home/Certifications';
import { CTASection } from '@/components/home/CTASection';

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <HeroCarousel />
      <CategoryNav />
      <NewProducts />
      <Certifications />
      <CTASection />
    </>
  );
}
