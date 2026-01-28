import { Injectable } from '@nestjs/common';
import {
  RequestContext,
  TransactionalConnection,
  ListQueryBuilder,
  ListQueryOptions,
  PaginatedList,
  ID,
  Logger,
} from '@vendure/core';
import { ContactSubmission } from '../entities/contact-submission.entity';
import { EmailNotificationService } from './email-notification.service';

export interface CreateContactSubmissionInput {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  source?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface UpdateContactSubmissionInput {
  id: ID;
  isRead?: boolean;
  notes?: string;
}

@Injectable()
export class ContactService {
  private logger = new Logger();

  constructor(
    private connection: TransactionalConnection,
    private listQueryBuilder: ListQueryBuilder,
    private emailNotificationService: EmailNotificationService,
  ) {}

  async findAll(
    ctx: RequestContext,
    options?: ListQueryOptions<ContactSubmission>,
  ): Promise<PaginatedList<ContactSubmission>> {
    return this.listQueryBuilder
      .build(ContactSubmission, options, { ctx })
      .getManyAndCount()
      .then(([items, totalItems]) => ({ items, totalItems }));
  }

  async findOne(ctx: RequestContext, id: ID): Promise<ContactSubmission | null> {
    return this.connection
      .getRepository(ctx, ContactSubmission)
      .findOne({ where: { id } });
  }

  async create(ctx: RequestContext, input: CreateContactSubmissionInput): Promise<ContactSubmission> {
    const submission = new ContactSubmission(input);
    const saved = await this.connection.getRepository(ctx, ContactSubmission).save(submission);

    // Send email notification asynchronously (don't block the response)
    this.emailNotificationService.sendContactNotification(ctx, saved).catch((error) => {
      this.logger.error(`Failed to send email notification: ${error}`);
    });

    return saved;
  }

  async update(ctx: RequestContext, input: UpdateContactSubmissionInput): Promise<ContactSubmission> {
    const submission = await this.connection.getEntityOrThrow(ctx, ContactSubmission, input.id);

    if (input.isRead !== undefined) {
      submission.isRead = input.isRead;
    }
    if (input.notes !== undefined) {
      submission.notes = input.notes;
    }

    return this.connection.getRepository(ctx, ContactSubmission).save(submission);
  }

  async delete(ctx: RequestContext, id: ID): Promise<boolean> {
    const submission = await this.connection.getEntityOrThrow(ctx, ContactSubmission, id);
    await this.connection.getRepository(ctx, ContactSubmission).remove(submission);
    return true;
  }

  async markAsRead(ctx: RequestContext, id: ID): Promise<ContactSubmission> {
    return this.update(ctx, { id, isRead: true });
  }

  async getUnreadCount(ctx: RequestContext): Promise<number> {
    return this.connection
      .getRepository(ctx, ContactSubmission)
      .count({ where: { isRead: false } });
  }
}
