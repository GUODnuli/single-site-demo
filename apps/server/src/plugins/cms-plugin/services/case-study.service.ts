import { Injectable } from '@nestjs/common';
import {
  RequestContext,
  TransactionalConnection,
  ListQueryBuilder,
  ListQueryOptions,
  PaginatedList,
  ID,
  Asset,
  TranslatableSaver,
  TranslatorService,
  ChannelService,
  AssetService,
} from '@vendure/core';
import { In } from 'typeorm';
import { CaseStudy } from '../entities/case-study.entity';
import { CaseStudyTranslation } from '../entities/case-study-translation.entity';
import { CaseCategory } from '../entities/case-category.entity';
import { CustomerReview } from '../entities/customer-review.entity';

export interface CreateCaseStudyInput {
  slug: string;
  enabled?: boolean;
  position?: number;
  location?: string;
  completedAt?: string;
  categoryId?: ID;
  beforeImageId?: ID;
  afterImageId?: ID;
  featuredImageId?: ID;
  galleryIds?: ID[];
  translations: Array<{
    languageCode: string;
    title: string;
    description?: string;
    content?: string;
  }>;
}

export interface UpdateCaseStudyInput {
  id: ID;
  slug?: string;
  enabled?: boolean;
  position?: number;
  location?: string;
  completedAt?: string;
  categoryId?: ID;
  beforeImageId?: ID;
  afterImageId?: ID;
  featuredImageId?: ID;
  galleryIds?: ID[];
  translations?: Array<{
    languageCode: string;
    title?: string;
    description?: string;
    content?: string;
  }>;
}

@Injectable()
export class CaseStudyService {
  constructor(
    private connection: TransactionalConnection,
    private listQueryBuilder: ListQueryBuilder,
    private translatableSaver: TranslatableSaver,
    private translator: TranslatorService,
    private channelService: ChannelService,
    private assetService: AssetService,
  ) {}

  async findAll(
    ctx: RequestContext,
    options?: ListQueryOptions<CaseStudy>,
  ): Promise<PaginatedList<CaseStudy>> {
    return this.listQueryBuilder
      .build(CaseStudy, options, {
        ctx,
        channelId: ctx.channelId,
        relations: ['category', 'beforeImage', 'afterImage', 'featuredImage', 'gallery', 'channels'],
      })
      .getManyAndCount()
      .then(([items, totalItems]) => ({
        items: items.map((item) => this.translator.translate(item, ctx)),
        totalItems,
      }));
  }

  async findOne(ctx: RequestContext, id: ID): Promise<CaseStudy | null> {
    const caseStudy = await this.connection
      .getRepository(ctx, CaseStudy)
      .findOne({
        where: { id },
        relations: ['category', 'beforeImage', 'afterImage', 'featuredImage', 'gallery', 'translations', 'channels', 'reviews'],
      });
    if (!caseStudy) return null;
    return this.translator.translate(caseStudy, ctx);
  }

  async findBySlug(ctx: RequestContext, slug: string): Promise<CaseStudy | null> {
    const caseStudy = await this.connection
      .getRepository(ctx, CaseStudy)
      .findOne({
        where: { slug, enabled: true },
        relations: ['category', 'beforeImage', 'afterImage', 'featuredImage', 'gallery', 'translations', 'channels', 'reviews'],
      });
    if (!caseStudy) return null;
    return this.translator.translate(caseStudy, ctx);
  }

  async findEnabled(ctx: RequestContext, categoryId?: ID): Promise<CaseStudy[]> {
    const qb = this.connection
      .getRepository(ctx, CaseStudy)
      .createQueryBuilder('caseStudy')
      .leftJoinAndSelect('caseStudy.category', 'category')
      .leftJoinAndSelect('caseStudy.beforeImage', 'beforeImage')
      .leftJoinAndSelect('caseStudy.afterImage', 'afterImage')
      .leftJoinAndSelect('caseStudy.featuredImage', 'featuredImage')
      .leftJoinAndSelect('caseStudy.gallery', 'gallery')
      .leftJoinAndSelect('caseStudy.translations', 'translations')
      .where('caseStudy.enabled = :enabled', { enabled: true })
      .orderBy('caseStudy.position', 'ASC');

    if (categoryId) {
      qb.andWhere('category.id = :categoryId', { categoryId });
    }

    const caseStudies = await qb.getMany();
    return caseStudies.map((cs) => this.translator.translate(cs, ctx));
  }

  async create(ctx: RequestContext, input: CreateCaseStudyInput): Promise<CaseStudy> {
    const caseStudy = await this.translatableSaver.create({
      ctx,
      input,
      entityType: CaseStudy,
      translationType: CaseStudyTranslation,
      beforeSave: async (cs) => {
        if (input.categoryId) {
          cs.category = await this.connection.getEntityOrThrow(ctx, CaseCategory, input.categoryId);
        }
        if (input.beforeImageId) {
          cs.beforeImage = (await this.assetService.findOne(ctx, input.beforeImageId)) as Asset;
        }
        if (input.afterImageId) {
          cs.afterImage = (await this.assetService.findOne(ctx, input.afterImageId)) as Asset;
        }
        if (input.featuredImageId) {
          cs.featuredImage = (await this.assetService.findOne(ctx, input.featuredImageId)) as Asset;
        }
        if (input.galleryIds?.length) {
          cs.gallery = await this.connection.getRepository(ctx, Asset).find({
            where: { id: In(input.galleryIds) },
          });
        }
        if (input.completedAt) {
          cs.completedAt = new Date(input.completedAt);
        }
        cs.channels = [ctx.channel];
        return cs;
      },
    });
    return this.translator.translate(caseStudy, ctx);
  }

  async update(ctx: RequestContext, input: UpdateCaseStudyInput): Promise<CaseStudy> {
    const caseStudy = await this.translatableSaver.update({
      ctx,
      input,
      entityType: CaseStudy,
      translationType: CaseStudyTranslation,
      beforeSave: async (cs) => {
        if (input.categoryId !== undefined) {
          cs.category = input.categoryId
            ? await this.connection.getEntityOrThrow(ctx, CaseCategory, input.categoryId)
            : null as any;
        }
        if (input.beforeImageId !== undefined) {
          cs.beforeImage = input.beforeImageId
            ? ((await this.assetService.findOne(ctx, input.beforeImageId)) as Asset)
            : null as any;
        }
        if (input.afterImageId !== undefined) {
          cs.afterImage = input.afterImageId
            ? ((await this.assetService.findOne(ctx, input.afterImageId)) as Asset)
            : null as any;
        }
        if (input.featuredImageId !== undefined) {
          cs.featuredImage = input.featuredImageId
            ? ((await this.assetService.findOne(ctx, input.featuredImageId)) as Asset)
            : null as any;
        }
        if (input.galleryIds !== undefined) {
          cs.gallery = input.galleryIds.length
            ? await this.connection.getRepository(ctx, Asset).find({
                where: { id: In(input.galleryIds) },
              })
            : [];
        }
        if (input.completedAt !== undefined) {
          cs.completedAt = input.completedAt ? new Date(input.completedAt) : null as any;
        }
        return cs;
      },
    });
    return this.translator.translate(caseStudy, ctx);
  }

  async delete(ctx: RequestContext, id: ID): Promise<boolean> {
    const caseStudy = await this.connection.getEntityOrThrow(ctx, CaseStudy, id);
    await this.connection.getRepository(ctx, CaseStudy).remove(caseStudy);
    return true;
  }

  // Categories
  async findAllCategories(ctx: RequestContext): Promise<CaseCategory[]> {
    const categories = await this.connection
      .getRepository(ctx, CaseCategory)
      .find({
        relations: ['translations'],
        order: { position: 'ASC' },
      });
    return categories.map((c) => this.translator.translate(c, ctx));
  }

  // Reviews
  async findReviewsByCaseStudy(ctx: RequestContext, caseStudyId: ID): Promise<CustomerReview[]> {
    const reviews = await this.connection
      .getRepository(ctx, CustomerReview)
      .find({
        where: { caseStudy: { id: caseStudyId }, enabled: true },
        relations: ['translations'],
        order: { position: 'ASC' },
      });
    return reviews.map((r) => this.translator.translate(r, ctx));
  }
}
