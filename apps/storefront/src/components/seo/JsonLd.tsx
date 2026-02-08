// Organization schema
export function OrganizationJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Curtain Showcase',
    description: 'Premium curtains and window treatments manufacturer',
    url: 'https://curtainshowcase.com',
    logo: 'https://curtainshowcase.com/logo.png',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-555-123-4567',
      contactType: 'customer service',
      availableLanguage: ['English', 'Spanish', 'German', 'French', 'Chinese'],
    },
    sameAs: [
      'https://facebook.com/curtainshowcase',
      'https://instagram.com/curtainshowcase',
      'https://linkedin.com/company/curtainshowcase',
      'https://twitter.com/curtainshowcase',
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: '123 Business Park, Suite 456',
      addressLocality: 'New York',
      addressRegion: 'NY',
      postalCode: '10001',
      addressCountry: 'US',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data),
      }}
    />
  );
}

// Product schema
interface ProductJsonLdProps {
  name: string;
  description: string;
  image: string;
  sku: string;
  price: number;
  currency: string;
  availability: 'InStock' | 'OutOfStock' | 'LimitedAvailability';
  url: string;
}

export function ProductJsonLd({
  name,
  description,
  image,
  sku,
  price,
  currency,
  availability,
  url,
}: ProductJsonLdProps) {
  const availabilityMap = {
    InStock: 'https://schema.org/InStock',
    OutOfStock: 'https://schema.org/OutOfStock',
    LimitedAvailability: 'https://schema.org/LimitedAvailability',
  };

  const data = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image,
    sku,
    url,
    brand: {
      '@type': 'Brand',
      name: 'Curtain Showcase',
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: currency,
      price: (price / 100).toFixed(2),
      availability: availabilityMap[availability],
      url,
      seller: {
        '@type': 'Organization',
        name: 'Curtain Showcase',
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data),
      }}
    />
  );
}

// Breadcrumb schema
interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbJsonLdProps {
  items: BreadcrumbItem[];
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data),
      }}
    />
  );
}

// FAQ schema
interface FAQItem {
  question: string;
  answer: string;
}

interface FAQJsonLdProps {
  items: FAQItem[];
}

export function FAQJsonLd({ items }: FAQJsonLdProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data),
      }}
    />
  );
}

// Local Business schema
export function LocalBusinessJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    name: 'Curtain Showcase',
    description: 'Premium curtains and window treatments manufacturer',
    url: 'https://curtainshowcase.com',
    telephone: '+1-555-123-4567',
    email: 'info@curtainshowcase.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '123 Business Park, Suite 456',
      addressLocality: 'New York',
      addressRegion: 'NY',
      postalCode: '10001',
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 40.7128,
      longitude: -74.006,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
    ],
    priceRange: '$$',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data),
      }}
    />
  );
}
