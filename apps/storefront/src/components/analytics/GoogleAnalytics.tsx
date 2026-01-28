'use client';

import Script from 'next/script';

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

/**
 * Google Analytics 4 component
 * Add this to your root layout
 */
export function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_path: window.location.pathname,
            anonymize_ip: true,
            cookie_flags: 'SameSite=None;Secure'
          });
        `}
      </Script>
    </>
  );
}

/**
 * Track page views
 */
export function trackPageView(url: string) {
  if (typeof window !== 'undefined' && GA_MEASUREMENT_ID && 'gtag' in window) {
    const gtag = window.gtag as (...args: unknown[]) => void;
    gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
}

/**
 * Track custom events
 */
export function trackEvent({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) {
  if (typeof window !== 'undefined' && GA_MEASUREMENT_ID && 'gtag' in window) {
    const gtag = window.gtag as (...args: unknown[]) => void;
    gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
}

/**
 * Track product views (for e-commerce)
 */
export function trackProductView(product: {
  id: string;
  name: string;
  category?: string;
  price?: number;
  currency?: string;
}) {
  trackEvent({
    action: 'view_item',
    category: 'ecommerce',
    label: product.name,
    value: product.price,
  });
}

/**
 * Track contact form submissions
 */
export function trackContactSubmit(formType: string) {
  trackEvent({
    action: 'submit',
    category: 'contact_form',
    label: formType,
  });
}

/**
 * Track outbound links
 */
export function trackOutboundLink(url: string) {
  trackEvent({
    action: 'click',
    category: 'outbound',
    label: url,
  });
}
