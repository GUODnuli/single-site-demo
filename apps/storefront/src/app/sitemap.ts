import { MetadataRoute } from 'next';

import { locales, defaultLocale, type Locale } from '@/i18n/config';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://curtainshowcase.com';

// Static routes that exist for all locales
const staticRoutes = ['', '/products', '/cases', '/about', '/contact'];

// In production, these would be fetched from the API
const productSlugs = [
  'premium-blackout-drapes',
  'sheer-voile-panels',
  'motorized-track-system',
  'velvet-curtains',
  'linen-curtains',
];

const caseSlugs = [
  'modern-living-room',
  'luxury-hotel-suite',
  'corporate-office',
];

function getLocalizedUrl(path: string, locale: Locale): string {
  if (locale === defaultLocale) {
    return `${BASE_URL}${path}`;
  }
  return `${BASE_URL}/${locale}${path}`;
}

function generateAlternates(path: string): Record<string, string> {
  const alternates: Record<string, string> = {};

  locales.forEach((locale) => {
    alternates[locale] = getLocalizedUrl(path, locale);
  });

  // x-default points to default locale
  alternates['x-default'] = getLocalizedUrl(path, defaultLocale);

  return alternates;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Add static routes with all locales
  staticRoutes.forEach((route) => {
    locales.forEach((locale) => {
      sitemapEntries.push({
        url: getLocalizedUrl(route, locale),
        lastModified: new Date(),
        changeFrequency: route === '' ? 'daily' : 'weekly',
        priority: route === '' ? 1 : 0.8,
        alternates: {
          languages: generateAlternates(route),
        },
      });
    });
  });

  // Add product pages
  productSlugs.forEach((slug) => {
    const path = `/products/${slug}`;
    locales.forEach((locale) => {
      sitemapEntries.push({
        url: getLocalizedUrl(path, locale),
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
        alternates: {
          languages: generateAlternates(path),
        },
      });
    });
  });

  // Add case study pages
  caseSlugs.forEach((slug) => {
    const path = `/cases/${slug}`;
    locales.forEach((locale) => {
      sitemapEntries.push({
        url: getLocalizedUrl(path, locale),
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
        alternates: {
          languages: generateAlternates(path),
        },
      });
    });
  });

  return sitemapEntries;
}
