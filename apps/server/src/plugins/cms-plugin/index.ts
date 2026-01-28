import { PluginCommonModule, VendurePlugin } from '@vendure/core';
import { AdminUiExtension } from '@vendure/ui-devkit/compiler';
import path from 'path';

import { Banner } from './entities/banner.entity';
import { BannerTranslation } from './entities/banner-translation.entity';
import { Page } from './entities/page.entity';
import { PageTranslation } from './entities/page-translation.entity';
import { CaseStudy } from './entities/case-study.entity';
import { CaseStudyTranslation } from './entities/case-study-translation.entity';
import { CaseCategory } from './entities/case-category.entity';
import { CaseCategoryTranslation } from './entities/case-category-translation.entity';
import { CustomerReview } from './entities/customer-review.entity';
import { CustomerReviewTranslation } from './entities/customer-review-translation.entity';
import { Certification } from './entities/certification.entity';
import { CertificationTranslation } from './entities/certification-translation.entity';
import { TeamMember } from './entities/team-member.entity';
import { TeamMemberTranslation } from './entities/team-member-translation.entity';
import { CompanyTimeline } from './entities/company-timeline.entity';
import { CompanyTimelineTranslation } from './entities/company-timeline-translation.entity';

import { BannerService } from './services/banner.service';
import { PageService } from './services/page.service';
import { CaseStudyService } from './services/case-study.service';
import { CertificationService } from './services/certification.service';
import { TeamMemberService } from './services/team-member.service';
import { CompanyTimelineService } from './services/company-timeline.service';

import { BannerAdminResolver, BannerShopResolver } from './resolvers/banner.resolver';
import { PageAdminResolver, PageShopResolver } from './resolvers/page.resolver';
import { CaseStudyAdminResolver, CaseStudyShopResolver } from './resolvers/case-study.resolver';
import { CertificationAdminResolver, CertificationShopResolver } from './resolvers/certification.resolver';

import { adminApiExtensions, shopApiExtensions } from './api/api-extensions';

@VendurePlugin({
  imports: [PluginCommonModule],
  entities: [
    Banner,
    BannerTranslation,
    Page,
    PageTranslation,
    CaseStudy,
    CaseStudyTranslation,
    CaseCategory,
    CaseCategoryTranslation,
    CustomerReview,
    CustomerReviewTranslation,
    Certification,
    CertificationTranslation,
    TeamMember,
    TeamMemberTranslation,
    CompanyTimeline,
    CompanyTimelineTranslation,
  ],
  providers: [
    BannerService,
    PageService,
    CaseStudyService,
    CertificationService,
    TeamMemberService,
    CompanyTimelineService,
  ],
  adminApiExtensions: {
    schema: adminApiExtensions,
    resolvers: [
      BannerAdminResolver,
      PageAdminResolver,
      CaseStudyAdminResolver,
      CertificationAdminResolver,
    ],
  },
  shopApiExtensions: {
    schema: shopApiExtensions,
    resolvers: [
      BannerShopResolver,
      PageShopResolver,
      CaseStudyShopResolver,
      CertificationShopResolver,
    ],
  },
  compatibility: '^3.0.0',
})
export class CmsPlugin {
  static uiExtensions: AdminUiExtension = {
    extensionPath: path.join(__dirname, 'ui'),
    ngModules: [
      {
        type: 'shared',
        ngModuleFileName: 'cms-ui-extension.module.ts',
        ngModuleName: 'CmsUiExtensionModule',
      },
      {
        type: 'lazy',
        route: 'cms',
        ngModuleFileName: 'cms-ui-lazy.module.ts',
        ngModuleName: 'CmsUiLazyModule',
      },
    ],
  };
}
