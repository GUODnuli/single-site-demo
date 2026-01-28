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
  AssetService,
} from '@vendure/core';
import { CompanyTimeline } from '../entities/company-timeline.entity';
import { CompanyTimelineTranslation } from '../entities/company-timeline-translation.entity';

export interface CreateCompanyTimelineInput {
  year: number;
  position?: number;
  enabled?: boolean;
  imageId?: ID;
  translations: Array<{
    languageCode: string;
    title: string;
    description?: string;
  }>;
}

export interface UpdateCompanyTimelineInput {
  id: ID;
  year?: number;
  position?: number;
  enabled?: boolean;
  imageId?: ID;
  translations?: Array<{
    languageCode: string;
    title?: string;
    description?: string;
  }>;
}

@Injectable()
export class CompanyTimelineService {
  constructor(
    private connection: TransactionalConnection,
    private listQueryBuilder: ListQueryBuilder,
    private translatableSaver: TranslatableSaver,
    private translator: TranslatorService,
    private assetService: AssetService,
  ) {}

  async findAll(
    ctx: RequestContext,
    options?: ListQueryOptions<CompanyTimeline>,
  ): Promise<PaginatedList<CompanyTimeline>> {
    return this.listQueryBuilder
      .build(CompanyTimeline, options, {
        ctx,
        relations: ['image'],
      })
      .getManyAndCount()
      .then(([items, totalItems]) => ({
        items: items.map((item) => this.translator.translate(item, ctx)),
        totalItems,
      }));
  }

  async findOne(ctx: RequestContext, id: ID): Promise<CompanyTimeline | null> {
    const timeline = await this.connection
      .getRepository(ctx, CompanyTimeline)
      .findOne({
        where: { id },
        relations: ['image', 'translations'],
      });
    if (!timeline) return null;
    return this.translator.translate(timeline, ctx);
  }

  async findEnabled(ctx: RequestContext): Promise<CompanyTimeline[]> {
    const timelines = await this.connection
      .getRepository(ctx, CompanyTimeline)
      .find({
        where: { enabled: true },
        relations: ['image', 'translations'],
        order: { year: 'ASC', position: 'ASC' },
      });
    return timelines.map((t) => this.translator.translate(t, ctx));
  }

  async create(ctx: RequestContext, input: CreateCompanyTimelineInput): Promise<CompanyTimeline> {
    const timeline = await this.translatableSaver.create({
      ctx,
      input,
      entityType: CompanyTimeline,
      translationType: CompanyTimelineTranslation,
      beforeSave: async (t) => {
        if (input.imageId) {
          t.image = (await this.assetService.findOne(ctx, input.imageId)) as Asset;
        }
        return t;
      },
    });
    return this.translator.translate(timeline, ctx);
  }

  async update(ctx: RequestContext, input: UpdateCompanyTimelineInput): Promise<CompanyTimeline> {
    const timeline = await this.translatableSaver.update({
      ctx,
      input,
      entityType: CompanyTimeline,
      translationType: CompanyTimelineTranslation,
      beforeSave: async (t) => {
        if (input.imageId !== undefined) {
          t.image = input.imageId
            ? ((await this.assetService.findOne(ctx, input.imageId)) as Asset)
            : null as any;
        }
        return t;
      },
    });
    return this.translator.translate(timeline, ctx);
  }

  async delete(ctx: RequestContext, id: ID): Promise<boolean> {
    const timeline = await this.connection.getEntityOrThrow(ctx, CompanyTimeline, id);
    await this.connection.getRepository(ctx, CompanyTimeline).remove(timeline);
    return true;
  }
}
