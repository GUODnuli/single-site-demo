'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { trackPageView } from './GoogleAnalytics';

/**
 * Analytics provider that tracks page views on route changes
 * Add this to your root layout's Providers component
 */
export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = `${pathname}${searchParams?.toString() ? `?${searchParams.toString()}` : ''}`;
    trackPageView(url);
  }, [pathname, searchParams]);

  return <>{children}</>;
}
