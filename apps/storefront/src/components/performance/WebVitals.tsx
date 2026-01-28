'use client';

import { useEffect } from 'react';
import { initWebVitals } from '@/lib/performance';

/**
 * Web Vitals monitoring component
 * Add this to your root layout to track Core Web Vitals
 */
export function WebVitals() {
  useEffect(() => {
    initWebVitals();
  }, []);

  return null;
}
