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
import { Banner } from '../entities/banner.entity';
import { BannerTranslation } from '../entities/banner-translation.entity';
import { LanguageCode } from '@vendure/core';

export interface CreateBannerInput {
  code: string;
  position?: number;
  enabled?: boolean;
  link?: string;
  imageId?: ID;
  translations: Array<{
    languageCode: LanguageCode
    title: string;
    subtitle?: string;
  }>;
}

export interface UpdateBannerInput {
  id: ID;
  code?: string;
  position?: number;
  enabled?: boolean;
  link?: string;
  imageId?: ID;
  translations?: Array<{
    languageCode: LanguageCode;
    title?: string;
    subtitle?: string;
  }>;
}

@Injectable()
export class BannerService {
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
    options?: ListQueryOptions<Banner>,
  ): Promise<PaginatedList<Banner>> {
    return this.listQueryBuilder
      .build(Banner, options, {
        ctx,
        channelId: ctx.channelId,
        relations: ['image', 'channels'],
      })
      .getManyAndCount()
      .then(([items, totalItems]) => ({
        items: items.map((item) => this.translator.translate(item, ctx)),
        totalItems,
      }));
  }

  async findOne(ctx: RequestContext, id: ID): Promise<Banner | null> {
    const banner = await this.connection
      .getRepository(ctx, Banner)
      .findOne({
        where: { id },
        relations: ['image', 'translations', 'channels'],
      });
    if (!banner) return null;
    return this.translator.translate(banner, ctx);
  }

  async findByCode(ctx: RequestContext, code: string): Promise<Banner | null> {
    const banner = await this.connection
      .getRepository(ctx, Banner)
      .findOne({
        where: { code },
        relations: ['image', 'translations', 'channels'],
      });
    if (!banner) return null;
    return this.translator.translate(banner, ctx);
  }

  async findEnabled(ctx: RequestContext): Promise<Banner[]> {
    const banners = await this.connection
      .getRepository(ctx, Banner)
      .find({
        where: { enabled: true },
        relations: ['image', 'translations', 'channels'],
        order: { position: 'ASC' },
      });
    return banners.map((banner) => this.translator.translate(banner, ctx));
  }

  async create(ctx: RequestContext, input: CreateBannerInput): Promise<Banner> {
    const banner = await this.translatableSaver.create({
      ctx,
      input,
      entityType: Banner,
      translationType: BannerTranslation,
      beforeSave: async (b) => {
        if (input.imageId) {
          b.image = await this.assetService.findOne(ctx, input.imageId) as Asset;
        }
        b.channels = [ctx.channel];
        return b;
      },
    });
    return this.translator.translate(banner, ctx);
  }

  async update(ctx: RequestContext, input: UpdateBannerInput): Promise<Banner> {
    const banner = await this.translatableSaver.update({
      ctx,
      input,
      entityType: Banner,
      translationType: BannerTranslation,
      beforeSave: async (b) => {
        if (input.imageId !== undefined) {
          b.image = input.imageId
            ? (await this.assetService.findOne(ctx, input.imageId)) as Asset
            : null as any;
        }
        return b;
      },
    });
    return this.translator.translate(banner, ctx);
  }

  async delete(ctx: RequestContext, id: ID): Promise<boolean> {
    const banner = await this.connection.getEntityOrThrow(ctx, Banner, id);
    await this.connection.getRepository(ctx, Banner).remove(banner);
    return true;
  }
}
