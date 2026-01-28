import {
  VendureConfig,
  DefaultJobQueuePlugin,
  DefaultSearchPlugin,
  LanguageCode,
} from '@vendure/core';
import { AdminUiPlugin } from '@vendure/admin-ui-plugin';
import { AssetServerPlugin } from '@vendure/asset-server-plugin';
import { EmailPlugin, defaultEmailHandlers } from '@vendure/email-plugin';
import path from 'path';
import 'dotenv/config';

import { CmsPlugin } from './plugins/cms-plugin';
import { ContactPlugin } from './plugins/contact-plugin';
import { AnalyticsPlugin } from './plugins/analytics-plugin';

const IS_DEV = process.env.NODE_ENV !== 'production';

export const config: VendureConfig = {
  apiOptions: {
    port: Number(process.env.VENDURE_PORT) || 3000,
    adminApiPath: 'admin-api',
    shopApiPath: 'shop-api',
    cors: {
      origin: IS_DEV ? true : ['https://your-storefront.com'],
      credentials: true,
    },
  },
  authOptions: {
    tokenMethod: ['bearer', 'cookie'],
    superadminCredentials: {
      identifier: process.env.SUPERADMIN_USERNAME || 'superadmin',
      password: process.env.SUPERADMIN_PASSWORD || 'superadmin',
    },
    cookieOptions: {
      secret: process.env.COOKIE_SECRET || 'cookie-secret',
    },
  },
  dbConnectionOptions: {
    type: 'postgres',
    synchronize: IS_DEV, // Auto-sync in dev, use migrations in production
    logging: IS_DEV,
    migrations: [path.join(__dirname, './migrations/*.ts')],
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || 'vendure',
    username: process.env.DB_USERNAME || 'vendure',
    password: process.env.DB_PASSWORD || 'vendure_password',
  },
  paymentOptions: {
    paymentMethodHandlers: [],
  },
  customFields: {
    Product: [
      {
        name: 'videoUrl',
        type: 'string',
        label: [{ languageCode: LanguageCode.en, value: 'Video URL' }],
        nullable: true,
      },
      {
        name: 'material',
        type: 'localeString',
        label: [{ languageCode: LanguageCode.en, value: 'Material' }],
        nullable: true,
      },
      {
        name: 'style',
        type: 'localeString',
        label: [{ languageCode: LanguageCode.en, value: 'Style' }],
        nullable: true,
      },
      {
        name: 'applicationScenes',
        type: 'string',
        list: true,
        label: [{ languageCode: LanguageCode.en, value: 'Application Scenes' }],
        nullable: true,
      },
      {
        name: 'isNew',
        type: 'boolean',
        label: [{ languageCode: LanguageCode.en, value: 'Is New Product' }],
        defaultValue: false,
      },
      {
        name: 'isFeatured',
        type: 'boolean',
        label: [{ languageCode: LanguageCode.en, value: 'Is Featured' }],
        defaultValue: false,
      },
    ],
    Collection: [
      {
        name: 'icon',
        type: 'relation',
        entity: 'Asset' as any,
        label: [{ languageCode: LanguageCode.en, value: 'Category Icon' }],
        nullable: true,
      },
      {
        name: 'bannerImage',
        type: 'relation',
        entity: 'Asset' as any,
        label: [{ languageCode: LanguageCode.en, value: 'Banner Image' }],
        nullable: true,
      },
      {
        name: 'showOnHomepage',
        type: 'boolean',
        label: [{ languageCode: LanguageCode.en, value: 'Show on Homepage' }],
        defaultValue: false,
      },
    ],
  },
  plugins: [
    AssetServerPlugin.init({
      route: 'assets',
      assetUploadDir: process.env.ASSET_UPLOAD_DIR || path.join(__dirname, '../static/assets'),
      assetUrlPrefix: IS_DEV ? 'http://localhost:3000/assets/' : 'https://your-cdn.com/assets/',
    }),
    DefaultJobQueuePlugin.init({ useDatabaseForBuffer: true }),
    DefaultSearchPlugin.init({ bufferUpdates: false, indexStockStatus: true }),
    EmailPlugin.init({
      devMode: true,
      outputPath: path.join(__dirname, '../static/email/test-emails'),
      route: 'mailbox',
      handlers: defaultEmailHandlers,
      templatePath: path.join(__dirname, '../static/email/templates'),
      globalTemplateVars: {
        fromAddress: '"Curtain Showcase" <noreply@example.com>',
      },
    }),
    AdminUiPlugin.init({
      route: 'admin',
      port: 3002,
      adminUiConfig: {
        brand: 'Curtain Showcase',
        hideVendureBranding: false,
        hideVersion: false,
      },
    }),
    CmsPlugin,
    ContactPlugin,
    AnalyticsPlugin,
  ],
};
