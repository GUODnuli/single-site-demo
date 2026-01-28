import { graphqlClient, serverGraphqlClient } from '@/lib/graphql-client';

// GraphQL Queries
export const GET_ANALYTICS_SUMMARY = `
  query GetAnalyticsSummary($dateRange: DateRangeInput) {
    analyticsSummary(dateRange: $dateRange) {
      totalPageViews
      uniqueVisitors
      totalProductViews
      topProducts {
        productId
        views
      }
      topPages {
        path
        views
      }
      eventCounts
    }
  }
`;

export const GET_TOP_PRODUCTS = `
  query GetTopProducts($limit: Int, $dateRange: DateRangeInput) {
    topProducts(limit: $limit, dateRange: $dateRange) {
      productId
      views
    }
  }
`;

export const GET_TOP_PAGES = `
  query GetTopPages($limit: Int, $dateRange: DateRangeInput) {
    topPages(limit: $limit, dateRange: $dateRange) {
      path
      views
    }
  }
`;

export const GET_DAILY_STATS = `
  query GetDailyStats($days: Int) {
    dailyStats(days: $days) {
      date
      pageViews
      productViews
      uniqueVisitors
    }
  }
`;

export const GET_PRODUCT_VIEW_COUNT = `
  query GetProductViewCount($productId: ID!, $dateRange: DateRangeInput) {
    productViewCount(productId: $productId, dateRange: $dateRange)
  }
`;

// API Functions
export interface DateRange {
  start: string;
  end: string;
}

export interface AnalyticsSummary {
  totalPageViews: number;
  uniqueVisitors: number;
  totalProductViews: number;
  topProducts: Array<{ productId: string; views: number }>;
  topPages: Array<{ path: string; views: number }>;
  eventCounts: Record<string, number>;
}

export interface DailyStat {
  date: string;
  pageViews: number;
  productViews: number;
  uniqueVisitors: number;
}

export async function fetchAnalyticsSummary(
  dateRange?: DateRange
): Promise<AnalyticsSummary | null> {
  try {
    const data = await serverGraphqlClient.request<{
      analyticsSummary: AnalyticsSummary;
    }>(GET_ANALYTICS_SUMMARY, { dateRange });
    return data.analyticsSummary;
  } catch (error) {
    console.error('Failed to fetch analytics summary:', error);
    return null;
  }
}

export async function fetchDailyStats(days: number = 30): Promise<DailyStat[]> {
  try {
    const data = await serverGraphqlClient.request<{
      dailyStats: DailyStat[];
    }>(GET_DAILY_STATS, { days });
    return data.dailyStats;
  } catch (error) {
    console.error('Failed to fetch daily stats:', error);
    return [];
  }
}

export async function fetchProductViewCount(
  productId: string,
  dateRange?: DateRange
): Promise<number> {
  try {
    const data = await serverGraphqlClient.request<{
      productViewCount: number;
    }>(GET_PRODUCT_VIEW_COUNT, { productId, dateRange });
    return data.productViewCount;
  } catch (error) {
    console.error('Failed to fetch product view count:', error);
    return 0;
  }
}
