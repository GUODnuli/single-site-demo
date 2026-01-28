/**
 * Performance monitoring and optimization utilities
 */

// Web Vitals types
type MetricName = 'CLS' | 'FCP' | 'FID' | 'INP' | 'LCP' | 'TTFB';

interface Metric {
  name: MetricName;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
}

type ReportHandler = (metric: Metric) => void;

/**
 * Report Web Vitals to analytics
 */
export function reportWebVitals(metric: Metric) {
  // Send to analytics (Google Analytics 4)
  if (typeof window !== 'undefined' && 'gtag' in window) {
    const gtag = window.gtag as (...args: unknown[]) => void;
    gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      non_interaction: true,
    });
  }

  // Log in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Web Vitals] ${metric.name}:`, {
      value: metric.value,
      rating: metric.rating,
    });
  }
}

/**
 * Initialize Web Vitals reporting
 */
export async function initWebVitals(onReport?: ReportHandler) {
  if (typeof window === 'undefined') return;

  const handler = onReport || reportWebVitals;

  try {
    const { onCLS, onFCP, onFID, onINP, onLCP, onTTFB } = await import('web-vitals');

    onCLS(handler);
    onFCP(handler);
    onFID(handler);
    onINP(handler);
    onLCP(handler);
    onTTFB(handler);
  } catch {
    console.warn('Failed to initialize Web Vitals');
  }
}

/**
 * Prefetch a page for faster navigation
 */
export function prefetchPage(href: string) {
  if (typeof window === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = href;
  link.as = 'document';
  document.head.appendChild(link);
}

/**
 * Preconnect to external origins for faster resource loading
 */
export function preconnect(href: string, crossOrigin?: 'anonymous' | 'use-credentials') {
  if (typeof window === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'preconnect';
  link.href = href;
  if (crossOrigin) {
    link.crossOrigin = crossOrigin;
  }
  document.head.appendChild(link);
}

/**
 * Debounce function for performance
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function for performance
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Check if user is on slow connection
 */
export function isSlowConnection(): boolean {
  if (typeof window === 'undefined') return false;

  const connection =
    (navigator as Navigator & { connection?: { effectiveType?: string; saveData?: boolean } })
      .connection;

  if (connection) {
    return (
      connection.saveData ||
      connection.effectiveType === 'slow-2g' ||
      connection.effectiveType === '2g'
    );
  }

  return false;
}

/**
 * Get device memory (in GB)
 */
export function getDeviceMemory(): number | undefined {
  if (typeof window === 'undefined') return undefined;
  return (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
}

/**
 * Adaptive loading based on device capabilities
 */
export function getLoadingStrategy(): 'high' | 'medium' | 'low' {
  const memory = getDeviceMemory();
  const slowConnection = isSlowConnection();
  const reducedMotion = prefersReducedMotion();

  if (slowConnection || (memory && memory < 2) || reducedMotion) {
    return 'low';
  }

  if (memory && memory < 4) {
    return 'medium';
  }

  return 'high';
}
