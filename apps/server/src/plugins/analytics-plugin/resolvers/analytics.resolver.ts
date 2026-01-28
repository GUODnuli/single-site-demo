import { Args, Query, Resolver, Mutation } from '@nestjs/graphql';
import { Ctx, RequestContext, Permission, Allow, Transaction, ID } from '@vendure/core';
import {
  AnalyticsService,
  TrackProductViewInput,
  TrackPageViewInput,
  TrackEventInput,
  DateRange,
} from '../services/analytics.service';

@Resolver()
export class AnalyticsShopResolver {
  constructor(private analyticsService: AnalyticsService) {}

  @Mutation()
  @Transaction()
  async trackProductView(
    @Ctx() ctx: RequestContext,
    @Args() args: { input: TrackProductViewInput },
  ) {
    try {
      await this.analyticsService.trackProductView(ctx, args.input);
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  }

  @Mutation()
  @Transaction()
  async trackPageView(
    @Ctx() ctx: RequestContext,
    @Args() args: { input: TrackPageViewInput },
  ) {
    try {
      await this.analyticsService.trackPageView(ctx, args.input);
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  }

  @Mutation()
  @Transaction()
  async trackEvent(
    @Ctx() ctx: RequestContext,
    @Args() args: { input: TrackEventInput },
  ) {
    try {
      await this.analyticsService.trackEvent(ctx, args.input);
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  }
}

@Resolver()
export class AnalyticsAdminResolver {
  constructor(private analyticsService: AnalyticsService) {}

  @Query()
  @Allow(Permission.ReadCatalog)
  async analyticsSummary(
    @Ctx() ctx: RequestContext,
    @Args() args: { dateRange?: { start: string; end: string } },
  ) {
    const dateRange = args.dateRange
      ? { start: new Date(args.dateRange.start), end: new Date(args.dateRange.end) }
      : undefined;
    return this.analyticsService.getSummary(ctx, dateRange);
  }

  @Query()
  @Allow(Permission.ReadCatalog)
  async productViewCount(
    @Ctx() ctx: RequestContext,
    @Args() args: { productId: ID; dateRange?: { start: string; end: string } },
  ) {
    const dateRange = args.dateRange
      ? { start: new Date(args.dateRange.start), end: new Date(args.dateRange.end) }
      : undefined;
    return this.analyticsService.getProductViews(ctx, args.productId, dateRange);
  }

  @Query()
  @Allow(Permission.ReadCatalog)
  async topProducts(
    @Ctx() ctx: RequestContext,
    @Args() args: { limit?: number; dateRange?: { start: string; end: string } },
  ) {
    const dateRange = args.dateRange
      ? { start: new Date(args.dateRange.start), end: new Date(args.dateRange.end) }
      : undefined;
    return this.analyticsService.getTopProducts(ctx, args.limit || 10, dateRange);
  }

  @Query()
  @Allow(Permission.ReadCatalog)
  async topPages(
    @Ctx() ctx: RequestContext,
    @Args() args: { limit?: number; dateRange?: { start: string; end: string } },
  ) {
    const dateRange = args.dateRange
      ? { start: new Date(args.dateRange.start), end: new Date(args.dateRange.end) }
      : undefined;
    return this.analyticsService.getTopPages(ctx, args.limit || 10, dateRange);
  }

  @Query()
  @Allow(Permission.ReadCatalog)
  async dailyStats(
    @Ctx() ctx: RequestContext,
    @Args() args: { days?: number },
  ) {
    return this.analyticsService.getDailyStats(ctx, args.days || 30);
  }
}
