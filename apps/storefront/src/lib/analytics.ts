import { graphqlClient } from './graphql-client';
import { trackEvent as trackGAEvent } from '@/components/analytics/GoogleAnalytics';

const VENDURE_API_URL = process.env.NEXT_PUBLIC_SHOP_API_URL || 'http://localhost:3000/shop-api';

// Session ID management
function getSessionId(): string {
  if (typeof window === 'undefined') return '';

  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
}

// GraphQL mutations
const TRACK_PRODUCT_VIEW = `
  mutation TrackProductView($input: TrackProductViewInput!) {
    trackProductView(input: $input) {
      success
    }
  }
`;

const TRACK_PAGE_VIEW = `
  mutation TrackPageView($input: TrackPageViewInput!) {
    trackPageView(input: $input) {
      success
    }
  }
`;

const TRACK_EVENT = `
  mutation TrackEvent($input: TrackEventInput!) {
    trackEvent(input: $input) {
      success
    }
  }
`;

interface TrackProductViewParams {
  productId: string;
  productVariantId?: string;
  locale?: string;
}

interface TrackPageViewParams {
  path: string;
  title?: string;
  locale?: string;
}

interface TrackEventParams {
  eventName: string;
  category?: string;
  label?: string;
  value?: number;
  properties?: Record<string, unknown>;
  productId?: string;
  orderId?: string;
}

// Track product view (both Vendure and GA)
export async function trackProductView({
  productId,
  productVariantId,
  locale,
}: TrackProductViewParams): Promise<void> {
  if (typeof window === 'undefined') return;

  const sessionId = getSessionId();

  // Track in GA
  trackGAEvent({
    action: 'view_item',
    category: 'ecommerce',
    label: productId,
  });

  // Track in Vendure
  try {
    await fetch(VENDURE_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        query: TRACK_PRODUCT_VIEW,
        variables: {
          input: {
            productId,
            productVariantId,
            sessionId,
            referrer: document.referrer,
            locale,
          },
        },
      }),
    });
  } catch (error) {
    console.debug('Failed to track product view:', error);
  }
}

// Track page view (Vendure analytics)
export async function trackVendurePageView({
  path,
  title,
  locale,
}: TrackPageViewParams): Promise<void> {
  if (typeof window === 'undefined') return;

  const sessionId = getSessionId();
  const urlParams = new URLSearchParams(window.location.search);

  try {
    await fetch(VENDURE_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        query: TRACK_PAGE_VIEW,
        variables: {
          input: {
            path,
            title,
            sessionId,
            referrer: document.referrer,
            utmSource: urlParams.get('utm_source') || undefined,
            utmMedium: urlParams.get('utm_medium') || undefined,
            utmCampaign: urlParams.get('utm_campaign') || undefined,
            locale,
          },
        },
      }),
    });
  } catch (error) {
    console.debug('Failed to track page view:', error);
  }
}

// Track custom event (both Vendure and GA)
export async function trackAnalyticsEvent({
  eventName,
  category = 'custom',
  label,
  value,
  properties,
  productId,
  orderId,
}: TrackEventParams): Promise<void> {
  if (typeof window === 'undefined') return;

  const sessionId = getSessionId();

  // Track in GA
  trackGAEvent({
    action: eventName,
    category,
    label,
    value,
  });

  // Track in Vendure
  try {
    await fetch(VENDURE_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        query: TRACK_EVENT,
        variables: {
          input: {
            eventName,
            category,
            label,
            value,
            properties,
            sessionId,
            productId,
            orderId,
            path: window.location.pathname,
            locale: document.documentElement.lang || undefined,
          },
        },
      }),
    });
  } catch (error) {
    console.debug('Failed to track event:', error);
  }
}

// Predefined event helpers
export const analytics = {
  // Product events
  productView: (productId: string, locale?: string) =>
    trackProductView({ productId, locale }),

  addToCart: (productId: string, quantity: number = 1, price?: number) =>
    trackAnalyticsEvent({
      eventName: 'add_to_cart',
      category: 'cart',
      label: productId,
      value: price,
      properties: { quantity },
      productId,
    }),

  removeFromCart: (productId: string, quantity: number = 1) =>
    trackAnalyticsEvent({
      eventName: 'remove_from_cart',
      category: 'cart',
      label: productId,
      properties: { quantity },
      productId,
    }),

  // Checkout events
  beginCheckout: (cartTotal: number) =>
    trackAnalyticsEvent({
      eventName: 'begin_checkout',
      category: 'checkout',
      value: cartTotal,
    }),

  purchase: (orderId: string, total: number) =>
    trackAnalyticsEvent({
      eventName: 'purchase',
      category: 'checkout',
      value: total,
      orderId,
    }),

  // Contact events
  contactFormSubmit: (formType: string) =>
    trackAnalyticsEvent({
      eventName: 'contact_form_submit',
      category: 'contact',
      label: formType,
    }),

  // Navigation events
  searchQuery: (query: string) =>
    trackAnalyticsEvent({
      eventName: 'search',
      category: 'navigation',
      label: query,
    }),

  filterApplied: (filterName: string, filterValue: string) =>
    trackAnalyticsEvent({
      eventName: 'filter_applied',
      category: 'navigation',
      label: `${filterName}: ${filterValue}`,
    }),

  // Engagement events
  videoPlay: (videoId: string) =>
    trackAnalyticsEvent({
      eventName: 'video_play',
      category: 'engagement',
      label: videoId,
    }),

  imageZoom: (productId: string) =>
    trackAnalyticsEvent({
      eventName: 'image_zoom',
      category: 'engagement',
      productId,
    }),

  shareProduct: (productId: string, platform: string) =>
    trackAnalyticsEvent({
      eventName: 'share',
      category: 'engagement',
      label: platform,
      productId,
    }),

  downloadCatalog: () =>
    trackAnalyticsEvent({
      eventName: 'catalog_download',
      category: 'engagement',
    }),

  // Error events
  error: (errorType: string, errorMessage: string) =>
    trackAnalyticsEvent({
      eventName: 'error',
      category: 'error',
      label: errorType,
      properties: { message: errorMessage },
    }),
};

export default analytics;
