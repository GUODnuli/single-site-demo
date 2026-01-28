import { Args, Query, Resolver, Mutation } from '@nestjs/graphql';
import { Ctx, RequestContext, Permission, Allow, Transaction, ID } from '@vendure/core';
import { ContactService, CreateContactSubmissionInput, UpdateContactSubmissionInput } from '../services/contact.service';

@Resolver()
export class ContactShopResolver {
  constructor(private contactService: ContactService) {}

  @Mutation()
  @Transaction()
  async submitContactForm(
    @Ctx() ctx: RequestContext,
    @Args() args: { input: CreateContactSubmissionInput & { source?: string } },
  ) {
    try {
      // Get IP and user agent from request if available
      const req = (ctx as any).req;
      const input: CreateContactSubmissionInput = {
        ...args.input,
        ipAddress: req?.ip || req?.connection?.remoteAddress,
        userAgent: req?.headers?.['user-agent'],
      };

      await this.contactService.create(ctx, input);

      return {
        success: true,
        message: 'Thank you for your message. We will get back to you soon.',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to submit form. Please try again later.',
      };
    }
  }
}

@Resolver()
export class ContactAdminResolver {
  constructor(private contactService: ContactService) {}

  @Query()
  @Allow(Permission.ReadCatalog)
  async contactSubmissions(
    @Ctx() ctx: RequestContext,
    @Args() args: { options?: any },
  ) {
    return this.contactService.findAll(ctx, args.options);
  }

  @Query()
  @Allow(Permission.ReadCatalog)
  async contactSubmission(@Ctx() ctx: RequestContext, @Args() args: { id: ID }) {
    return this.contactService.findOne(ctx, args.id);
  }

  @Query()
  @Allow(Permission.ReadCatalog)
  async unreadContactCount(@Ctx() ctx: RequestContext) {
    return this.contactService.getUnreadCount(ctx);
  }

  @Mutation()
  @Transaction()
  @Allow(Permission.UpdateCatalog)
  async updateContactSubmission(
    @Ctx() ctx: RequestContext,
    @Args() args: { input: UpdateContactSubmissionInput },
  ) {
    return this.contactService.update(ctx, args.input);
  }

  @Mutation()
  @Transaction()
  @Allow(Permission.UpdateCatalog)
  async markContactAsRead(@Ctx() ctx: RequestContext, @Args() args: { id: ID }) {
    return this.contactService.markAsRead(ctx, args.id);
  }

  @Mutation()
  @Transaction()
  @Allow(Permission.DeleteCatalog)
  async deleteContactSubmission(@Ctx() ctx: RequestContext, @Args() args: { id: ID }) {
    await this.contactService.delete(ctx, args.id);
    return { result: 'DELETED' as const };
  }
}
