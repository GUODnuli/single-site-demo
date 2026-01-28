import { PluginCommonModule, VendurePlugin } from '@vendure/core';
import { ProductView } from './entities/product-view.entity';
import { PageView } from './entities/page-view.entity';
import { AnalyticsEvent } from './entities/analytics-event.entity';
import { AnalyticsService } from './services/analytics.service';
import { AnalyticsAdminResolver, AnalyticsShopResolver } from './resolvers/analytics.resolver';
import { adminApiExtensions, shopApiExtensions } from './api/api-extensions';

@VendurePlugin({
  imports: [PluginCommonModule],
  entities: [ProductView, PageView, AnalyticsEvent],
  providers: [AnalyticsService],
  adminApiExtensions: {
    schema: adminApiExtensions,
    resolvers: [AnalyticsAdminResolver],
  },
  shopApiExtensions: {
    schema: shopApiExtensions,
    resolvers: [AnalyticsShopResolver],
  },
  compatibility: '^3.0.0',
})
export class AnalyticsPlugin {}
