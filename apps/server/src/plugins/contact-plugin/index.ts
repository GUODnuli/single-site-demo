import { PluginCommonModule, VendurePlugin } from '@vendure/core';
import { ContactSubmission } from './entities/contact-submission.entity';
import { ContactService } from './services/contact.service';
import { EmailNotificationService } from './services/email-notification.service';
import { ContactAdminResolver, ContactShopResolver } from './resolvers/contact.resolver';
import { adminApiExtensions, shopApiExtensions } from './api/api-extensions';

@VendurePlugin({
  imports: [PluginCommonModule],
  entities: [ContactSubmission],
  providers: [ContactService, EmailNotificationService],
  adminApiExtensions: {
    schema: adminApiExtensions,
    resolvers: [ContactAdminResolver],
  },
  shopApiExtensions: {
    schema: shopApiExtensions,
    resolvers: [ContactShopResolver],
  },
  compatibility: '^3.0.0',
})
export class ContactPlugin {}
