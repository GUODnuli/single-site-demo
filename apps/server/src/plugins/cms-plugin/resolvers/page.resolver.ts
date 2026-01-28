import { Args, Query, Resolver, Mutation } from '@nestjs/graphql';
import { Ctx, RequestContext, Permission, Allow, Transaction, ID } from '@vendure/core';
import { PageService, CreatePageInput, UpdatePageInput } from '../services/page.service';

@Resolver()
export class PageShopResolver {
  constructor(private pageService: PageService) {}

  @Query()
  async page(
    @Ctx() ctx: RequestContext,
    @Args() args: { id?: ID; slug?: string },
  ) {
    if (args.id) {
      return this.pageService.findOne(ctx, args.id);
    }
    if (args.slug) {
      return this.pageService.findBySlug(ctx, args.slug);
    }
    return null;
  }
}

@Resolver()
export class PageAdminResolver {
  constructor(private pageService: PageService) {}

  @Query()
  @Allow(Permission.ReadCatalog)
  async pages(
    @Ctx() ctx: RequestContext,
    @Args() args: { options?: any },
  ) {
    return this.pageService.findAll(ctx, args.options);
  }

  @Query()
  @Allow(Permission.ReadCatalog)
  async page(@Ctx() ctx: RequestContext, @Args() args: { id: ID }) {
    return this.pageService.findOne(ctx, args.id);
  }

  @Mutation()
  @Transaction()
  @Allow(Permission.CreateCatalog)
  async createPage(
    @Ctx() ctx: RequestContext,
    @Args() args: { input: CreatePageInput },
  ) {
    return this.pageService.create(ctx, args.input);
  }

  @Mutation()
  @Transaction()
  @Allow(Permission.UpdateCatalog)
  async updatePage(
    @Ctx() ctx: RequestContext,
    @Args() args: { input: UpdatePageInput },
  ) {
    return this.pageService.update(ctx, args.input);
  }

  @Mutation()
  @Transaction()
  @Allow(Permission.DeleteCatalog)
  async deletePage(@Ctx() ctx: RequestContext, @Args() args: { id: ID }) {
    await this.pageService.delete(ctx, args.id);
    return { result: 'DELETED' as const };
  }
}
