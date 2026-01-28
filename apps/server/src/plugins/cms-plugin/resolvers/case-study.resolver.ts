import { Args, Query, Resolver, Mutation, ResolveField, Parent } from '@nestjs/graphql';
import { Ctx, RequestContext, Permission, Allow, Transaction, ID } from '@vendure/core';
import { CaseStudyService, CreateCaseStudyInput, UpdateCaseStudyInput } from '../services/case-study.service';
import { CaseStudy } from '../entities/case-study.entity';

@Resolver('CaseStudy')
export class CaseStudyShopResolver {
  constructor(private caseStudyService: CaseStudyService) {}

  @Query()
  async caseStudies(
    @Ctx() ctx: RequestContext,
    @Args() args: { categoryId?: ID },
  ) {
    return this.caseStudyService.findEnabled(ctx, args.categoryId);
  }

  @Query()
  async caseStudy(
    @Ctx() ctx: RequestContext,
    @Args() args: { id?: ID; slug?: string },
  ) {
    if (args.id) {
      return this.caseStudyService.findOne(ctx, args.id);
    }
    if (args.slug) {
      return this.caseStudyService.findBySlug(ctx, args.slug);
    }
    return null;
  }

  @Query()
  async caseCategories(@Ctx() ctx: RequestContext) {
    return this.caseStudyService.findAllCategories(ctx);
  }

  @ResolveField()
  async reviews(@Parent() caseStudy: CaseStudy, @Ctx() ctx: RequestContext) {
    if (caseStudy.reviews) {
      return caseStudy.reviews;
    }
    return this.caseStudyService.findReviewsByCaseStudy(ctx, caseStudy.id);
  }
}

@Resolver('CaseStudy')
export class CaseStudyAdminResolver {
  constructor(private caseStudyService: CaseStudyService) {}

  @Query()
  @Allow(Permission.ReadCatalog)
  async caseStudies(
    @Ctx() ctx: RequestContext,
    @Args() args: { options?: any },
  ) {
    return this.caseStudyService.findAll(ctx, args.options);
  }

  @Query()
  @Allow(Permission.ReadCatalog)
  async caseStudy(@Ctx() ctx: RequestContext, @Args() args: { id: ID }) {
    return this.caseStudyService.findOne(ctx, args.id);
  }

  @Query()
  @Allow(Permission.ReadCatalog)
  async caseCategories(@Ctx() ctx: RequestContext) {
    return this.caseStudyService.findAllCategories(ctx);
  }

  @Mutation()
  @Transaction()
  @Allow(Permission.CreateCatalog)
  async createCaseStudy(
    @Ctx() ctx: RequestContext,
    @Args() args: { input: CreateCaseStudyInput },
  ) {
    return this.caseStudyService.create(ctx, args.input);
  }

  @Mutation()
  @Transaction()
  @Allow(Permission.UpdateCatalog)
  async updateCaseStudy(
    @Ctx() ctx: RequestContext,
    @Args() args: { input: UpdateCaseStudyInput },
  ) {
    return this.caseStudyService.update(ctx, args.input);
  }

  @Mutation()
  @Transaction()
  @Allow(Permission.DeleteCatalog)
  async deleteCaseStudy(@Ctx() ctx: RequestContext, @Args() args: { id: ID }) {
    await this.caseStudyService.delete(ctx, args.id);
    return { result: 'DELETED' as const };
  }

  @ResolveField()
  async reviews(@Parent() caseStudy: CaseStudy, @Ctx() ctx: RequestContext) {
    if (caseStudy.reviews) {
      return caseStudy.reviews;
    }
    return this.caseStudyService.findReviewsByCaseStudy(ctx, caseStudy.id);
  }
}
