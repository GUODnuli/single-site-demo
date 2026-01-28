import { Injectable } from '@nestjs/common';
import {
  RequestContext,
  TransactionalConnection,
  ListQueryBuilder,
  ListQueryOptions,
  PaginatedList,
  ID,
  Logger,
} from '@vendure/core';
import { Between, MoreThanOrEqual } from 'typeorm';
import { ProductView } from '../entities/product-view.entity';
import { PageView } from '../entities/page-view.entity';
import { AnalyticsEvent, EventCategory } from '../entities/analytics-event.entity';

export interface TrackProductViewInput {
  productId: ID;
  productVariantId?: ID;
  sessionId?: string;
  referrer?: string;
  locale?: string;
}

export interface TrackPageViewInput {
  path: string;
  title?: string;
  sessionId?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  locale?: string;
}

export interface TrackEventInput {
  eventName: string;
  category?: EventCategory;
  label?: string;
  value?: number;
  properties?: Record<string, unknown>;
  sessionId?: string;
  productId?: ID;
  orderId?: ID;
  path?: string;
  locale?: string;
}

export interface AnalyticsSummary {
  totalPageViews: number;
  uniqueVisitors: number;
  totalProductViews: number;
  topProducts: Array<{ productId: ID; views: number }>;
  topPages: Array<{ path: string; views: number }>;
  eventCounts: Record<string, number>;
}

export interface DateRange {
  start: Date;
  end: Date;
}

@Injectable()
export class AnalyticsService {
  private logger = new Logger();

  constructor(
    private connection: TransactionalConnection,
    private listQueryBuilder: ListQueryBuilder,
  ) {}

  // Product View Tracking
  async trackProductView(
    ctx: RequestContext,
    input: TrackProductViewInput,
  ): Promise<ProductView> {
    const req = (ctx as any).req;
    const view = new ProductView({
      ...input,
      productId: Number(input.productId),
      productVariantId: input.productVariantId ? Number(input.productVariantId) : undefined,
      ipAddress: this.getClientIp(req),
      userAgent: req?.headers?.['user-agent'],
      userId: ctx.activeUserId ? Number(ctx.activeUserId) : undefined,
      ...this.parseUserAgent(req?.headers?.['user-agent']),
    });

    return this.connection.getRepository(ctx, ProductView).save(view);
  }

  async getProductViews(
    ctx: RequestContext,
    productId: ID,
    dateRange?: DateRange,
  ): Promise<number> {
    const whereClause: any = { productId };
    if (dateRange) {
      whereClause.createdAt = Between(dateRange.start, dateRange.end);
    }
    return this.connection.getRepository(ctx, ProductView).count({ where: whereClause });
  }

  async getTopProducts(
    ctx: RequestContext,
    limit: number = 10,
    dateRange?: DateRange,
  ): Promise<Array<{ productId: string; views: number }>> {
    const repo = this.connection.getRepository(ctx, ProductView);
    const qb = repo.createQueryBuilder('pv')
      .select('pv.productId', 'productId')
      .addSelect('COUNT(*)', 'views')
      .groupBy('pv.productId')
      .orderBy('views', 'DESC')
      .limit(limit);

    if (dateRange) {
      qb.where('pv.createdAt BETWEEN :start AND :end', {
        start: dateRange.start,
        end: dateRange.end,
      });
    }

    return qb.getRawMany();
  }

  // Page View Tracking
  async trackPageView(
    ctx: RequestContext,
    input: TrackPageViewInput,
  ): Promise<PageView> {
    const req = (ctx as any).req;
    const view = new PageView({
      ...input,
      ipAddress: this.getClientIp(req),
      userAgent: req?.headers?.['user-agent'],
      userId: ctx.activeUserId ? Number(ctx.activeUserId) : undefined,
      ...this.parseUserAgent(req?.headers?.['user-agent']),
    });

    return this.connection.getRepository(ctx, PageView).save(view);
  }

  async getTopPages(
    ctx: RequestContext,
    limit: number = 10,
    dateRange?: DateRange,
  ): Promise<Array<{ path: string; views: number }>> {
    const repo = this.connection.getRepository(ctx, PageView);
    const qb = repo.createQueryBuilder('pv')
      .select('pv.path', 'path')
      .addSelect('COUNT(*)', 'views')
      .groupBy('pv.path')
      .orderBy('views', 'DESC')
      .limit(limit);

    if (dateRange) {
      qb.where('pv.createdAt BETWEEN :start AND :end', {
        start: dateRange.start,
        end: dateRange.end,
      });
    }

    return qb.getRawMany();
  }

  // Event Tracking
  async trackEvent(
    ctx: RequestContext,
    input: TrackEventInput,
  ): Promise<AnalyticsEvent> {
    const req = (ctx as any).req;
    const event = new AnalyticsEvent({
      ...input,
      category: input.category || 'custom',
      ipAddress: this.getClientIp(req),
      userAgent: req?.headers?.['user-agent'],
      userId: ctx.activeUserId ? Number(ctx.activeUserId) : undefined,
      productId: input.productId ? Number(input.productId) : undefined,
      orderId: input.orderId ? Number(input.orderId) : undefined,
      properties: input.properties as any,
    });

    return this.connection.getRepository(ctx, AnalyticsEvent).save(event);
  }

  async getEventCounts(
    ctx: RequestContext,
    dateRange?: DateRange,
  ): Promise<Record<string, number>> {
    const repo = this.connection.getRepository(ctx, AnalyticsEvent);
    const qb = repo.createQueryBuilder('e')
      .select('e.eventName', 'eventName')
      .addSelect('COUNT(*)', 'count')
      .groupBy('e.eventName');

    if (dateRange) {
      qb.where('e.createdAt BETWEEN :start AND :end', {
        start: dateRange.start,
        end: dateRange.end,
      });
    }

    const results = await qb.getRawMany();
    return results.reduce((acc, row) => {
      acc[row.eventName] = parseInt(row.count, 10);
      return acc;
    }, {} as Record<string, number>);
  }

  // Analytics Summary
  async getSummary(
    ctx: RequestContext,
    dateRange?: DateRange,
  ): Promise<AnalyticsSummary> {
    const whereClause = dateRange
      ? { createdAt: Between(dateRange.start, dateRange.end) }
      : {};

    const [
      totalPageViews,
      uniqueVisitors,
      totalProductViews,
      topProducts,
      topPages,
      eventCounts,
    ] = await Promise.all([
      this.connection.getRepository(ctx, PageView).count({ where: whereClause }),
      this.getUniqueVisitors(ctx, dateRange),
      this.connection.getRepository(ctx, ProductView).count({ where: whereClause }),
      this.getTopProducts(ctx, 10, dateRange),
      this.getTopPages(ctx, 10, dateRange),
      this.getEventCounts(ctx, dateRange),
    ]);

    return {
      totalPageViews,
      uniqueVisitors,
      totalProductViews,
      topProducts,
      topPages,
      eventCounts,
    };
  }

  private async getUniqueVisitors(
    ctx: RequestContext,
    dateRange?: DateRange,
  ): Promise<number> {
    const repo = this.connection.getRepository(ctx, PageView);
    const qb = repo.createQueryBuilder('pv')
      .select('COUNT(DISTINCT pv.sessionId)', 'count');

    if (dateRange) {
      qb.where('pv.createdAt BETWEEN :start AND :end', {
        start: dateRange.start,
        end: dateRange.end,
      });
    }

    const result = await qb.getRawOne();
    return parseInt(result?.count || '0', 10);
  }

  // Daily Stats
  async getDailyStats(
    ctx: RequestContext,
    days: number = 30,
  ): Promise<Array<{ date: string; pageViews: number; productViews: number; uniqueVisitors: number }>> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    // This is a simplified version - in production, you'd use proper SQL aggregation
    const pageViewRepo = this.connection.getRepository(ctx, PageView);
    const productViewRepo = this.connection.getRepository(ctx, ProductView);

    const pageViews = await pageViewRepo
      .createQueryBuilder('pv')
      .select("DATE(pv.createdAt)", 'date')
      .addSelect('COUNT(*)', 'count')
      .where('pv.createdAt >= :startDate', { startDate })
      .groupBy("DATE(pv.createdAt)")
      .orderBy('date', 'ASC')
      .getRawMany();

    const productViews = await productViewRepo
      .createQueryBuilder('pv')
      .select("DATE(pv.createdAt)", 'date')
      .addSelect('COUNT(*)', 'count')
      .where('pv.createdAt >= :startDate', { startDate })
      .groupBy("DATE(pv.createdAt)")
      .orderBy('date', 'ASC')
      .getRawMany();

    // Combine results
    const stats: Map<string, { pageViews: number; productViews: number; uniqueVisitors: number }> = new Map();

    pageViews.forEach((row) => {
      const date = row.date.toString().split('T')[0];
      stats.set(date, {
        pageViews: parseInt(row.count, 10),
        productViews: 0,
        uniqueVisitors: 0,
      });
    });

    productViews.forEach((row) => {
      const date = row.date.toString().split('T')[0];
      const existing = stats.get(date) || { pageViews: 0, productViews: 0, uniqueVisitors: 0 };
      stats.set(date, { ...existing, productViews: parseInt(row.count, 10) });
    });

    return Array.from(stats.entries()).map(([date, data]) => ({
      date,
      ...data,
    }));
  }

  // Utility methods
  private getClientIp(req: any): string | undefined {
    if (!req) return undefined;
    return (
      req.headers?.['x-forwarded-for']?.split(',')[0]?.trim() ||
      req.headers?.['x-real-ip'] ||
      req.ip ||
      req.connection?.remoteAddress
    );
  }

  private parseUserAgent(userAgent?: string): {
    device?: string;
    browser?: string;
    os?: string;
  } {
    if (!userAgent) return {};

    // Simple UA parsing - in production, use a proper UA parser library
    const device = /Mobile|Android|iPhone|iPad/i.test(userAgent)
      ? 'mobile'
      : /Tablet/i.test(userAgent)
      ? 'tablet'
      : 'desktop';

    let browser = 'unknown';
    if (/Chrome/i.test(userAgent)) browser = 'Chrome';
    else if (/Firefox/i.test(userAgent)) browser = 'Firefox';
    else if (/Safari/i.test(userAgent)) browser = 'Safari';
    else if (/Edge/i.test(userAgent)) browser = 'Edge';

    let os = 'unknown';
    if (/Windows/i.test(userAgent)) os = 'Windows';
    else if (/Mac OS/i.test(userAgent)) os = 'macOS';
    else if (/Linux/i.test(userAgent)) os = 'Linux';
    else if (/Android/i.test(userAgent)) os = 'Android';
    else if (/iOS|iPhone|iPad/i.test(userAgent)) os = 'iOS';

    return { device, browser, os };
  }
}
