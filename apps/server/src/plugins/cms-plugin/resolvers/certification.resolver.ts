import { Args, Query, Resolver, Mutation } from '@nestjs/graphql';
import { Ctx, RequestContext, Permission, Allow, Transaction, ID } from '@vendure/core';
import { CertificationService, CreateCertificationInput, UpdateCertificationInput } from '../services/certification.service';

@Resolver()
export class CertificationShopResolver {
  constructor(private certificationService: CertificationService) {}

  @Query()
  async certifications(@Ctx() ctx: RequestContext) {
    return this.certificationService.findEnabled(ctx);
  }

  @Query()
  async certification(
    @Ctx() ctx: RequestContext,
    @Args() args: { id?: ID; code?: string },
  ) {
    if (args.id) {
      return this.certificationService.findOne(ctx, args.id);
    }
    return null;
  }
}

@Resolver()
export class CertificationAdminResolver {
  constructor(private certificationService: CertificationService) {}

  @Query()
  @Allow(Permission.ReadCatalog)
  async certifications(
    @Ctx() ctx: RequestContext,
    @Args() args: { options?: any },
  ) {
    return this.certificationService.findAll(ctx, args.options);
  }

  @Query()
  @Allow(Permission.ReadCatalog)
  async certification(@Ctx() ctx: RequestContext, @Args() args: { id: ID }) {
    return this.certificationService.findOne(ctx, args.id);
  }

  @Mutation()
  @Transaction()
  @Allow(Permission.CreateCatalog)
  async createCertification(
    @Ctx() ctx: RequestContext,
    @Args() args: { input: CreateCertificationInput },
  ) {
    return this.certificationService.create(ctx, args.input);
  }

  @Mutation()
  @Transaction()
  @Allow(Permission.UpdateCatalog)
  async updateCertification(
    @Ctx() ctx: RequestContext,
    @Args() args: { input: UpdateCertificationInput },
  ) {
    return this.certificationService.update(ctx, args.input);
  }

  @Mutation()
  @Transaction()
  @Allow(Permission.DeleteCatalog)
  async deleteCertification(@Ctx() ctx: RequestContext, @Args() args: { id: ID }) {
    await this.certificationService.delete(ctx, args.id);
    return { result: 'DELETED' as const };
  }
}
