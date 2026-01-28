import { Injectable } from '@nestjs/common';
import {
  RequestContext,
  TransactionalConnection,
  ListQueryBuilder,
  ListQueryOptions,
  PaginatedList,
  ID,
  TranslatableSaver,
  TranslatorService,
  ChannelService,
} from '@vendure/core';
import { Page } from '../entities/page.entity';
import { PageTranslation } from '../entities/page-translation.entity';
import { LanguageCode } from '@vendure/core';

export interface CreatePageInput {
  slug: string;
  enabled?: boolean;
  translations: Array<{
    languageCode: LanguageCode;
    title: string;
    content?: string;
    seoTitle?: string;
    seoDescription?: string;
  }>;
}

export interface UpdatePageInput {
  id: ID;
  slug?: string;
  enabled?: boolean;
  translations?: Array<{
    languageCode: LanguageCode;
    title?: string;
    content?: string;
    seoTitle?: string;
    seoDescription?: string;
  }>;
}

@Injectable()
export class PageService {
  constructor(
    private connection: TransactionalConnection,
    private listQueryBuilder: ListQueryBuilder,
    private translatableSaver: TranslatableSaver,
    private translator: TranslatorService,
    private channelService: ChannelService,
  ) {}

  async findAll(
    ctx: RequestContext,
    options?: ListQueryOptions<Page>,
  ): Promise<PaginatedList<Page>> {
    return this.listQueryBuilder
      .build(Page, options, {
        ctx,
        channelId: ctx.channelId,
        relations: ['channels'],
      })
      .getManyAndCount()
      .then(([items, totalItems]) => ({
        items: items.map((item) => this.translator.translate(item, ctx)),
        totalItems,
      }));
  }

  async findOne(ctx: RequestContext, id: ID): Promise<Page | null> {
    const page = await this.connection
      .getRepository(ctx, Page)
      .findOne({
        where: { id },
        relations: ['translations', 'channels'],
      });
    if (!page) return null;
    return this.translator.translate(page, ctx);
  }

  async findBySlug(ctx: RequestContext, slug: string): Promise<Page | null> {
    const page = await this.connection
      .getRepository(ctx, Page)
      .findOne({
        where: { slug },
        relations: ['translations', 'channels'],
      });
    if (!page) return null;
    return this.translator.translate(page, ctx);
  }

  async create(ctx: RequestContext, input: CreatePageInput): Promise<Page> {
    const page = await this.translatableSaver.create({
      ctx,
      input,
      entityType: Page,
      translationType: PageTranslation,
      beforeSave: async (p) => {
        p.channels = [ctx.channel];
        return p;
      },
    });
    return this.translator.translate(page, ctx);
  }

  async update(ctx: RequestContext, input: UpdatePageInput): Promise<Page> {
    const page = await this.translatableSaver.update({
      ctx,
      input,
      entityType: Page,
      translationType: PageTranslation,
    });
    return this.translator.translate(page, ctx);
  }

  async delete(ctx: RequestContext, id: ID): Promise<boolean> {
    const page = await this.connection.getEntityOrThrow(ctx, Page, id);
    await this.connection.getRepository(ctx, Page).remove(page);
    return true;
  }
}
