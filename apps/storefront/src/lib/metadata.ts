import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { locales, defaultLocale, type Locale } from '@/i18n/config';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://curtainshowcase.com';

interface GenerateMetadataParams {
  locale: Locale;
  pathname?: string;
  titleKey?: string;
  descriptionKey?: string;
  namespace?: string;
  image?: string;
  noIndex?: boolean;
}

/**
 * Generate localized metadata with hreflang alternate links
 */
export async function generateLocalizedMetadata({
  locale,
  pathname = '',
  titleKey = 'title',
  descriptionKey = 'subtitle',
  namespace = 'common',
  image,
  noIndex = false,
}: GenerateMetadataParams): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace });

  // Build canonical URL
  const canonicalPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const canonicalUrl =
    locale === defaultLocale
      ? `${BASE_URL}${canonicalPath}`
      : `${BASE_URL}/${locale}${canonicalPath}`;

  // Build alternate URLs for all locales (hreflang)
  const languages: Record<string, string> = {};
  locales.forEach((loc) => {
    const locPath = loc === defaultLocale ? canonicalPath : `/${loc}${canonicalPath}`;
    languages[loc] = `${BASE_URL}${locPath}`;
  });

  // Add x-default pointing to default locale
  languages['x-default'] = `${BASE_URL}${canonicalPath}`;

  // Get translated strings (with fallbacks)
  let title: string;
  let description: string;

  try {
    title = t(titleKey);
  } catch {
    title = 'Curtain Showcase';
  }

  try {
    description = t(descriptionKey);
  } catch {
    description = 'Premium curtains and window treatments';
  }

  // Map locale to OpenGraph locale format
  const ogLocaleMap: Record<Locale, string> = {
    en: 'en_US',
    es: 'es_ES',
    de: 'de_DE',
    fr: 'fr_FR',
    zh: 'zh_CN',
  };

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'Curtain Showcase',
      locale: ogLocaleMap[locale],
      alternateLocale: locales.filter((l) => l !== locale).map((l) => ogLocaleMap[l]),
      type: 'website',
      ...(image && {
        images: [
          {
            url: image.startsWith('http') ? image : `${BASE_URL}${image}`,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(image && {
        images: [image.startsWith('http') ? image : `${BASE_URL}${image}`],
      }),
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

/**
 * Generate product-specific metadata
 */
export async function generateProductMetadata({
  locale,
  product,
}: {
  locale: Locale;
  product: {
    name: string;
    description: string;
    slug: string;
    featuredAsset?: { preview: string };
  };
}): Promise<Metadata> {
  return generateLocalizedMetadata({
    locale,
    pathname: `/products/${product.slug}`,
    titleKey: product.name,
    descriptionKey: product.description,
    namespace: 'products',
    image: product.featuredAsset?.preview,
  });
}

/**
 * Generate case study metadata
 */
export async function generateCaseMetadata({
  locale,
  caseStudy,
}: {
  locale: Locale;
  caseStudy: {
    title: string;
    description: string;
    slug: string;
    featuredImage?: string;
  };
}): Promise<Metadata> {
  return generateLocalizedMetadata({
    locale,
    pathname: `/cases/${caseStudy.slug}`,
    titleKey: caseStudy.title,
    descriptionKey: caseStudy.description,
    namespace: 'cases',
    image: caseStudy.featuredImage,
  });
}
