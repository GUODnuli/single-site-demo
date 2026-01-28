import { Args, Query, Resolver, Mutation } from '@nestjs/graphql';
import { Ctx, RequestContext, Permission, Allow, Transaction, ID } from '@vendure/core';
import { BannerService, CreateBannerInput, UpdateBannerInput } from '../services/banner.service';

@Resolver()
export class BannerShopResolver {
  constructor(private bannerService: BannerService) {}

  @Query()
  async banners(@Ctx() ctx: RequestContext) {
    return this.bannerService.findEnabled(ctx);
  }

  @Query()
  async banner(
    @Ctx() ctx: RequestContext,
    @Args() args: { id?: ID; code?: string },
  ) {
    if (args.id) {
      return this.bannerService.findOne(ctx, args.id);
    }
    if (args.code) {
      return this.bannerService.findByCode(ctx, args.code);
    }
    return null;
  }
}

@Resolver()
export class BannerAdminResolver {
  constructor(private bannerService: BannerService) {}

  @Query()
  @Allow(Permission.ReadCatalog)
  async banners(
    @Ctx() ctx: RequestContext,
    @Args() args: { options?: any },
  ) {
    return this.bannerService.findAll(ctx, args.options);
  }

  @Query()
  @Allow(Permission.ReadCatalog)
  async banner(@Ctx() ctx: RequestContext, @Args() args: { id: ID }) {
    return this.bannerService.findOne(ctx, args.id);
  }

  @Mutation()
  @Transaction()
  @Allow(Permission.CreateCatalog)
  async createBanner(
    @Ctx() ctx: RequestContext,
    @Args() args: { input: CreateBannerInput },
  ) {
    return this.bannerService.create(ctx, args.input);
  }

  @Mutation()
  @Transaction()
  @Allow(Permission.UpdateCatalog)
  async updateBanner(
    @Ctx() ctx: RequestContext,
    @Args() args: { input: UpdateBannerInput },
  ) {
    return this.bannerService.update(ctx, args.input);
  }

  @Mutation()
  @Transaction()
  @Allow(Permission.DeleteCatalog)
  async deleteBanner(@Ctx() ctx: RequestContext, @Args() args: { id: ID }) {
    await this.bannerService.delete(ctx, args.id);
    return { result: 'DELETED' as const };
  }
}
