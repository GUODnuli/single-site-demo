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
import { TeamMember } from '../entities/team-member.entity';
import { TeamMemberTranslation } from '../entities/team-member-translation.entity';

export interface CreateTeamMemberInput {
  name: string;
  email?: string;
  position?: number;
  enabled?: boolean;
  photoId?: ID;
  translations: Array<{
    languageCode: string;
    jobTitle: string;
    bio?: string;
  }>;
}

export interface UpdateTeamMemberInput {
  id: ID;
  name?: string;
  email?: string;
  position?: number;
  enabled?: boolean;
  photoId?: ID;
  translations?: Array<{
    languageCode: string;
    jobTitle?: string;
    bio?: string;
  }>;
}

@Injectable()
export class TeamMemberService {
  constructor(
    private connection: TransactionalConnection,
    private listQueryBuilder: ListQueryBuilder,
    private translatableSaver: TranslatableSaver,
    private translator: TranslatorService,
    private assetService: AssetService,
  ) {}

  async findAll(
    ctx: RequestContext,
    options?: ListQueryOptions<TeamMember>,
  ): Promise<PaginatedList<TeamMember>> {
    return this.listQueryBuilder
      .build(TeamMember, options, {
        ctx,
        relations: ['photo'],
      })
      .getManyAndCount()
      .then(([items, totalItems]) => ({
        items: items.map((item) => this.translator.translate(item, ctx)),
        totalItems,
      }));
  }

  async findOne(ctx: RequestContext, id: ID): Promise<TeamMember | null> {
    const member = await this.connection
      .getRepository(ctx, TeamMember)
      .findOne({
        where: { id },
        relations: ['photo', 'translations'],
      });
    if (!member) return null;
    return this.translator.translate(member, ctx);
  }

  async findEnabled(ctx: RequestContext): Promise<TeamMember[]> {
    const members = await this.connection
      .getRepository(ctx, TeamMember)
      .find({
        where: { enabled: true },
        relations: ['photo', 'translations'],
        order: { position: 'ASC' },
      });
    return members.map((m) => this.translator.translate(m, ctx));
  }

  async create(ctx: RequestContext, input: CreateTeamMemberInput): Promise<TeamMember> {
    const member = await this.translatableSaver.create({
      ctx,
      input,
      entityType: TeamMember,
      translationType: TeamMemberTranslation,
      beforeSave: async (m) => {
        if (input.photoId) {
          m.photo = (await this.assetService.findOne(ctx, input.photoId)) as Asset;
        }
        return m;
      },
    });
    return this.translator.translate(member, ctx);
  }

  async update(ctx: RequestContext, input: UpdateTeamMemberInput): Promise<TeamMember> {
    const member = await this.translatableSaver.update({
      ctx,
      input,
      entityType: TeamMember,
      translationType: TeamMemberTranslation,
      beforeSave: async (m) => {
        if (input.photoId !== undefined) {
          m.photo = input.photoId
            ? ((await this.assetService.findOne(ctx, input.photoId)) as Asset)
            : null as any;
        }
        return m;
      },
    });
    return this.translator.translate(member, ctx);
  }

  async delete(ctx: RequestContext, id: ID): Promise<boolean> {
    const member = await this.connection.getEntityOrThrow(ctx, TeamMember, id);
    await this.connection.getRepository(ctx, TeamMember).remove(member);
    return true;
  }
}
