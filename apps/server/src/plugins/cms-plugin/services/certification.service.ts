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
import { Certification } from '../entities/certification.entity';
import { CertificationTranslation } from '../entities/certification-translation.entity';

export interface CreateCertificationInput {
  code: string;
  position?: number;
  enabled?: boolean;
  iconId?: ID;
  certificateId?: ID;
  translations: Array<{
    languageCode: string;
    name: string;
    description?: string;
  }>;
}

export interface UpdateCertificationInput {
  id: ID;
  code?: string;
  position?: number;
  enabled?: boolean;
  iconId?: ID;
  certificateId?: ID;
  translations?: Array<{
    languageCode: string;
    name?: string;
    description?: string;
  }>;
}

@Injectable()
export class CertificationService {
  constructor(
    private connection: TransactionalConnection,
    private listQueryBuilder: ListQueryBuilder,
    private translatableSaver: TranslatableSaver,
    private translator: TranslatorService,
    private assetService: AssetService,
  ) {}

  async findAll(
    ctx: RequestContext,
    options?: ListQueryOptions<Certification>,
  ): Promise<PaginatedList<Certification>> {
    return this.listQueryBuilder
      .build(Certification, options, {
        ctx,
        relations: ['icon', 'certificate'],
      })
      .getManyAndCount()
      .then(([items, totalItems]) => ({
        items: items.map((item) => this.translator.translate(item, ctx)),
        totalItems,
      }));
  }

  async findOne(ctx: RequestContext, id: ID): Promise<Certification | null> {
    const cert = await this.connection
      .getRepository(ctx, Certification)
      .findOne({
        where: { id },
        relations: ['icon', 'certificate', 'translations'],
      });
    if (!cert) return null;
    return this.translator.translate(cert, ctx);
  }

  async findEnabled(ctx: RequestContext): Promise<Certification[]> {
    const certs = await this.connection
      .getRepository(ctx, Certification)
      .find({
        where: { enabled: true },
        relations: ['icon', 'certificate', 'translations'],
        order: { position: 'ASC' },
      });
    return certs.map((cert) => this.translator.translate(cert, ctx));
  }

  async create(ctx: RequestContext, input: CreateCertificationInput): Promise<Certification> {
    const cert = await this.translatableSaver.create({
      ctx,
      input,
      entityType: Certification,
      translationType: CertificationTranslation,
      beforeSave: async (c) => {
        if (input.iconId) {
          c.icon = (await this.assetService.findOne(ctx, input.iconId)) as Asset;
        }
        if (input.certificateId) {
          c.certificate = (await this.assetService.findOne(ctx, input.certificateId)) as Asset;
        }
        return c;
      },
    });
    return this.translator.translate(cert, ctx);
  }

  async update(ctx: RequestContext, input: UpdateCertificationInput): Promise<Certification> {
    const cert = await this.translatableSaver.update({
      ctx,
      input,
      entityType: Certification,
      translationType: CertificationTranslation,
      beforeSave: async (c) => {
        if (input.iconId !== undefined) {
          c.icon = input.iconId
            ? ((await this.assetService.findOne(ctx, input.iconId)) as Asset)
            : null as any;
        }
        if (input.certificateId !== undefined) {
          c.certificate = input.certificateId
            ? ((await this.assetService.findOne(ctx, input.certificateId)) as Asset)
            : null as any;
        }
        return c;
      },
    });
    return this.translator.translate(cert, ctx);
  }

  async delete(ctx: RequestContext, id: ID): Promise<boolean> {
    const cert = await this.connection.getEntityOrThrow(ctx, Certification, id);
    await this.connection.getRepository(ctx, Certification).remove(cert);
    return true;
  }
}
