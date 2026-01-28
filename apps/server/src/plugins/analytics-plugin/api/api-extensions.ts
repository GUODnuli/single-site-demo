import gql from 'graphql-tag';

export const shopApiExtensions = gql`
  input TrackProductViewInput {
    productId: ID!
    productVariantId: ID
    sessionId: String
    referrer: String
    locale: String
  }

  input TrackPageViewInput {
    path: String!
    title: String
    sessionId: String
    referrer: String
    utmSource: String
    utmMedium: String
    utmCampaign: String
    locale: String
  }

  input TrackEventInput {
    eventName: String!
    category: String
    label: String
    value: Float
    properties: JSON
    sessionId: String
    productId: ID
    orderId: ID
    path: String
    locale: String
  }

  type TrackingResult {
    success: Boolean!
  }

  extend type Mutation {
    trackProductView(input: TrackProductViewInput!): TrackingResult!
    trackPageView(input: TrackPageViewInput!): TrackingResult!
    trackEvent(input: TrackEventInput!): TrackingResult!
  }
`;

export const adminApiExtensions = gql`
  type ProductViewStats {
    productId: ID!
    views: Int!
  }

  type PageViewStats {
    path: String!
    views: Int!
  }

  type DailyStats {
    date: String!
    pageViews: Int!
    productViews: Int!
    uniqueVisitors: Int!
  }

  type AnalyticsSummary {
    totalPageViews: Int!
    uniqueVisitors: Int!
    totalProductViews: Int!
    topProducts: [ProductViewStats!]!
    topPages: [PageViewStats!]!
    eventCounts: JSON!
  }

  input DateRangeInput {
    start: DateTime!
    end: DateTime!
  }

  extend type Query {
    analyticsSummary(dateRange: DateRangeInput): AnalyticsSummary!
    productViewCount(productId: ID!, dateRange: DateRangeInput): Int!
    topProducts(limit: Int, dateRange: DateRangeInput): [ProductViewStats!]!
    topPages(limit: Int, dateRange: DateRangeInput): [PageViewStats!]!
    dailyStats(days: Int): [DailyStats!]!
  }
`;
