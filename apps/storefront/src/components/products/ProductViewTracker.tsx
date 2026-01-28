'use client';

import { useEffect } from 'react';
import { useProductViewTracking } from '@/hooks/useAnalytics';

interface ProductViewTrackerProps {
  productId: string;
  locale?: string;
}

/**
 * Invisible component that tracks product views
 * Add this to product detail pages
 */
export function ProductViewTracker({ productId, locale }: ProductViewTrackerProps) {
  useProductViewTracking(productId, locale);
  return null;
}

export default ProductViewTracker;
