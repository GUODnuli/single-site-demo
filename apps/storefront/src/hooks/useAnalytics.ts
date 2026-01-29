'use client';

import { useCallback, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { analytics, trackVendurePageView } from '@/lib/analytics';

/**
 * Hook for tracking analytics events
 */
export function useAnalytics() {
  return analytics;
}

/**
 * Hook for tracking product views
 * Automatically tracks when productId changes
 */
export function useProductViewTracking(productId: string, locale?: string) {
  const hasTracked = useRef(false);

  useEffect(() => {
    if (productId && !hasTracked.current) {
      hasTracked.current = true;
      analytics.productView(productId, locale);
    }
  }, [productId, locale]);
}

/**
 * Hook for tracking page views in Vendure analytics
 * Use this in addition to Google Analytics for backend analytics
 */
export function useVendurePageView(title?: string, locale?: string) {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname) {
      trackVendurePageView({
        path: pathname,
        title,
        locale,
      });
    }
  }, [pathname, title, locale]);
}

/**
 * Hook for tracking time on page
 */
export function useTimeOnPage(
  callback: (durationSeconds: number) => void,
  threshold: number = 10
) {
  const startTime = useRef<number>(Date.now());

  useEffect(() => {
    startTime.current = Date.now();

    return () => {
      const duration = Math.round((Date.now() - startTime.current) / 1000);
      if (duration >= threshold) {
        callback(duration);
      }
    };
  }, [callback, threshold]);
}

/**
 * Hook for tracking scroll depth
 */
export function useScrollDepthTracking(productId?: string) {
  const maxScrollDepth = useRef(0);
  const reported = useRef<Set<number>>(new Set());

  useEffect(() => {
    const trackScrollDepth = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      const depth = Math.round((scrolled / scrollHeight) * 100);

      if (depth > maxScrollDepth.current) {
        maxScrollDepth.current = depth;

        // Report at 25%, 50%, 75%, 100%
        const milestones = [25, 50, 75, 100];
        milestones.forEach((milestone) => {
          if (depth >= milestone && !reported.current.has(milestone)) {
            reported.current.add(milestone);
            import('@/lib/analytics').then(({ trackAnalyticsEvent }) => {
                trackAnalyticsEvent({
                  eventName: 'scroll_depth',
                  category: 'engagement',
                  label: `${milestone}%`,
                  value: milestone,
                  productId,
                });
              });
          }
        });
      }
    };

    window.addEventListener('scroll', trackScrollDepth, { passive: true });
    return () => window.removeEventListener('scroll', trackScrollDepth);
  }, [productId]);
}

/**
 * Hook for tracking element visibility
 */
export function useVisibilityTracking(
  elementRef: React.RefObject<HTMLElement>,
  eventName: string,
  options?: { threshold?: number; productId?: string }
) {
  const hasTracked = useRef(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasTracked.current) {
            hasTracked.current = true;
            import('@/lib/analytics').then(({ trackAnalyticsEvent }) => {
              trackAnalyticsEvent({
                eventName,
                category: 'engagement',
                productId: options?.productId,
              });
            });
          }
        });
      },
      { threshold: options?.threshold || 0.5 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [elementRef, eventName, options?.productId, options?.threshold]);
}
