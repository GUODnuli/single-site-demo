# Vendure + Next.js 窗帘展示独立站 实现计划

## 项目概述

基于 Vendure 3.5+ 和 Next.js 15+ 构建的多语言窗帘品牌展示网站，面向海外市场。

---

## 一、技术架构

```
┌─────────────────────────────────────────────────────────────────┐
│                        CDN Layer (Cloudflare)                    │
│                    全球加速 + DDoS防护 + SSL                      │
└─────────────────────────────────────────────────────────────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    ▼                           ▼
┌─────────────────────────────┐   ┌─────────────────────────────┐
│      Next.js Frontend       │   │      Vendure Backend        │
│  -------------------------  │   │  -------------------------  │
│  • App Router (SSR/SSG)     │   │  • GraphQL API              │
│  • React Server Components  │   │  • Admin Dashboard          │
│  • TanStack Query           │   │  • Asset Management         │
│  • shadcn/ui + Tailwind     │   │  • Multi-language Plugin    │
│  • next-intl (i18n)         │   │  • Custom CMS Plugin        │
│  • Image Optimization       │   │  • Contact Form Plugin      │
└─────────────────────────────┘   └─────────────────────────────┘
                    │                           │
                    └─────────────┬─────────────┘
                                  ▼
                    ┌─────────────────────────────┐
                    │     PostgreSQL Database     │
                    │     (海外云服务器)           │
                    └─────────────────────────────┘
```

---

## 二、目录结构

```
single-site-demo/
├── apps/
│   ├── server/                          # Vendure 后端
│   │   ├── src/
│   │   │   ├── vendure-config.ts        # 核心配置
│   │   │   ├── index.ts                 # 服务入口
│   │   │   ├── index-worker.ts          # Worker 入口
│   │   │   ├── migrations/              # 数据库迁移
│   │   │   └── plugins/
│   │   │       ├── cms-plugin/          # 自定义CMS插件
│   │   │       │   ├── entities/
│   │   │       │   │   ├── page.entity.ts
│   │   │       │   │   ├── banner.entity.ts`
│   │   │       │   │   └── case-study.entity.ts
│   │   │       │   ├── services/
│   │   │       │   ├── resolvers/
│   │   │       │   └── ui-extensions/
│   │   │       ├── contact-plugin/      # 联系表单插件
│   │   │       └── analytics-plugin/    # 访问统计插件
│   │   └── .env
│   │
│   └── storefront/                      # Next.js 前端
│       ├── src/
│       │   ├── app/
│       │   │   ├── [locale]/            # 多语言路由
│       │   │   │   ├── page.tsx         # 首页
│       │   │   │   ├── products/
│       │   │   │   │   ├── page.tsx     # 产品列表
│       │   │   │   │   └── [slug]/
│       │   │   │   │       └── page.tsx # 产品详情
│       │   │   │   ├── cases/
│       │   │   │   │   ├── page.tsx     # 案例列表
│       │   │   │   │   └── [slug]/
│       │   │   │   │       └── page.tsx # 案例详情
│       │   │   │   ├── about/
│       │   │   │   │   └── page.tsx     # 关于我们
│       │   │   │   └── contact/
│       │   │   │       └── page.tsx     # 联系我们
│       │   │   ├── api/                 # API Routes
│       │   │   │   └── contact/
│       │   │   │       └── route.ts
│       │   │   ├── layout.tsx
│       │   │   └── globals.css
│       │   │
│       │   ├── components/
│       │   │   ├── ui/                  # shadcn/ui 组件
│       │   │   ├── layout/
│       │   │   │   ├── Header.tsx
│       │   │   │   ├── Footer.tsx
│       │   │   │   ├── LanguageSwitcher.tsx
│       │   │   │   └── MobileNav.tsx
│       │   │   ├── home/
│       │   │   │   ├── HeroCarousel.tsx
│       │   │   │   ├── CategoryNav.tsx
│       │   │   │   ├── NewProducts.tsx
│       │   │   │   └── Certifications.tsx
│       │   │   ├── products/
│       │   │   │   ├── ProductCard.tsx
│       │   │   │   ├── ProductFilter.tsx
│       │   │   │   ├── ProductGallery.tsx
│       │   │   │   └── ProductSearch.tsx
│       │   │   ├── cases/
│       │   │   │   ├── CaseCard.tsx
│       │   │   │   ├── BeforeAfterSlider.tsx
│       │   │   │   └── CustomerReviews.tsx
│       │   │   └── contact/
│       │   │       ├── ContactForm.tsx
│       │   │       └── MapEmbed.tsx
│       │   │
│       │   ├── lib/
│       │   │   ├── graphql-client.ts    # GraphQL 客户端
│       │   │   ├── queries/             # GraphQL 查询
│       │   │   └── utils/
│       │   │
│       │   ├── i18n/
│       │   │   ├── config.ts            # i18n 配置
│       │   │   └── messages/
│       │   │       ├── en.json
│       │   │       ├── es.json
│       │   │       ├── de.json
│       │   │       └── fr.json
│       │   │
│       │   └── gql/                     # 生成的 GraphQL 类型
│       │
│       ├── public/
│       │   ├── images/
│       │   └── icons/
│       │
│       ├── codegen.ts
│       ├── next.config.ts
│       ├── tailwind.config.ts
│       └── components.json
│
├── packages/
│   └── shared/                          # 共享类型和工具
│       ├── src/
│       │   └── types/
│       └── package.json
│
├── docker-compose.yml
├── package.json
└── turbo.json
```

---

## 三、功能模块映射

### 3.1 前端展示模块

#### 首页模块 (P0)

| 功能点 | 实现方案 | 组件/文件 |
|--------|----------|-----------|
| 品牌故事轮播 | Embla Carousel + Framer Motion | `HeroCarousel.tsx` |
| 产品分类导航 | Vendure Collections API | `CategoryNav.tsx` |
| 新品推荐展示 | 自定义 Facet "isNew" 筛选 | `NewProducts.tsx` |
| 品牌荣誉展示 | CMS Plugin 自定义实体 | `Certifications.tsx` |

#### 产品展示模块 (P0)

| 功能点 | 实现方案 | 组件/文件 |
|--------|----------|-----------|
| 多级分类管理 | Vendure Collections (树形结构) | 后台原生支持 |
| 产品详情页 | SSG + ISR 预渲染 | `products/[slug]/page.tsx` |
| 图片放大预览 | react-medium-image-zoom | `ProductGallery.tsx` |
| 搜索筛选 (P1) | Vendure Facets + Search API | `ProductFilter.tsx` |
| 收藏分享 (P2) | localStorage + Web Share API | `ShareButton.tsx` |

#### 案例展示模块 (P0)

| 功能点 | 实现方案 | 组件/文件 |
|--------|----------|-----------|
| 工程案例展示 | CMS Plugin CaseStudy 实体 | `CaseCard.tsx` |
| 前后对比滑块 | react-compare-slider | `BeforeAfterSlider.tsx` |
| 客户评价 (P1) | CMS Plugin Review 实体 | `CustomerReviews.tsx` |
| 案例分类 (P1) | CMS Plugin CaseCategory | 分类筛选 |

#### 关于我们模块 (P0)

| 功能点 | 实现方案 | 组件/文件 |
|--------|----------|-----------|
| 公司介绍 | CMS Plugin Page 实体 | 富文本渲染 |
| 品牌历程 (P1) | Timeline 自定义字段 | `Timeline.tsx` |
| 团队展示 (P2) | CMS Plugin TeamMember | `TeamSection.tsx` |
| 荣誉资质 (P1) | Asset 管理 + Gallery | `CertGallery.tsx` |

#### 多语言模块 (P0)

| 功能点 | 实现方案 | 配置文件 |
|--------|----------|----------|
| 多语言支持 | next-intl + Vendure i18n | `i18n/config.ts` |
| 语言选择器 | 下拉菜单 + Cookie 持久化 | `LanguageSwitcher.tsx` |
| 浏览器检测 (P1) | Accept-Language Header | middleware.ts |

#### 联系我们模块 (P0)

| 功能点 | 实现方案 | 组件/文件 |
|--------|----------|-----------|
| 联系表单 | React Hook Form + Zod 验证 | `ContactForm.tsx` |
| 地图定位 (P1) | Google Maps Embed | `MapEmbed.tsx` |
| 多联系方式 | CMS Plugin 配置 | Footer 展示 |
| 在线客服 (P2) | Tawk.to / Crisp 集成 | Script 注入 |

---

### 3.2 后台管理模块

#### Vendure 原生功能

| 功能 | Vendure 支持 | 备注 |
|------|--------------|------|
| 产品 CRUD | ✅ 原生 | Products + Variants |
| 分类管理 | ✅ 原生 | Collections (树形) |
| 资产管理 | ✅ 原生 | 图片/视频上传、裁剪 |
| 多语言内容 | ✅ 原生 | Translatable 字段 |
| 管理员权限 | ✅ 原生 | Roles + Permissions |

#### 自定义 CMS Plugin

```typescript
// plugins/cms-plugin/entities/

// 1. Banner 轮播图
interface Banner {
  id: number;
  title: string;           // 可翻译
  subtitle: string;        // 可翻译
  image: Asset;
  link?: string;
  order: number;
  enabled: boolean;
}

// 2. Page 页面内容
interface Page {
  id: number;
  slug: string;
  title: string;           // 可翻译
  content: string;         // 富文本，可翻译
  seoTitle?: string;
  seoDescription?: string;
}

// 3. CaseStudy 案例
interface CaseStudy {
  id: number;
  title: string;           // 可翻译
  slug: string;
  category: CaseCategory;
  description: string;     // 可翻译
  beforeImage: Asset;
  afterImage: Asset;
  gallery: Asset[];
  location?: string;
  completedAt?: Date;
}

// 4. CustomerReview 客户评价
interface CustomerReview {
  id: number;
  customerName: string;
  rating: number;          // 1-5
  content: string;         // 可翻译
  caseStudy?: CaseStudy;
  enabled: boolean;
}

// 5. Certification 认证证书
interface Certification {
  id: number;
  name: string;            // 可翻译
  icon: Asset;
  certificate?: Asset;
  order: number;
}

// 6. TeamMember 团队成员
interface TeamMember {
  id: number;
  name: string;
  position: string;        // 可翻译
  bio?: string;            // 可翻译
  photo: Asset;
  order: number;
}

// 7. CompanyTimeline 公司历程
interface CompanyTimeline {
  id: number;
  year: number;
  title: string;           // 可翻译
  description: string;     // 可翻译
  image?: Asset;
}
```

#### Contact Plugin

```typescript
// plugins/contact-plugin/entities/

interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  source: string;          // 来源页面
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  isRead: boolean;
  notes?: string;          // 管理员备注
}
```

#### Analytics Plugin (P1)

```typescript
// plugins/analytics-plugin/

// 集成 Google Analytics 4
// 或自建简易统计：
interface PageView {
  id: number;
  path: string;
  referrer?: string;
  userAgent: string;
  country?: string;
  createdAt: Date;
}

interface ProductClick {
  id: number;
  productId: number;
  createdAt: Date;
}
```

---

## 四、数据模型设计

### 4.1 Vendure 原生实体扩展

```typescript
// 产品扩展字段
Product CustomFields:
  - videoUrl: string              // 产品视频
  - material: string (翻译)       // 材质
  - style: string (翻译)          // 风格
  - applicationScenes: string[]   // 应用场景
  - isNew: boolean                // 新品标记
  - isFeatured: boolean           // 推荐标记

// Collection 扩展字段
Collection CustomFields:
  - icon: Asset                   // 分类图标
  - bannerImage: Asset            // 分类横幅
  - showOnHomepage: boolean       // 首页展示
```

### 4.2 分类结构示例

```
窗帘 (Curtains)
├── 遮光窗帘 (Blackout)
├── 半遮光窗帘 (Semi-Blackout)
├── 纯色窗帘 (Solid Color)
└── 印花窗帘 (Printed)

窗纱 (Sheers)
├── 纱帘 (Voile)
├── 蕾丝纱 (Lace)
└── 绣花纱 (Embroidered)

配件 (Accessories)
├── 窗帘杆 (Curtain Rods)
├── 窗帘环 (Curtain Rings)
├── 幕布扎带 (Tiebacks)
└── 轨道配件 (Track Accessories)
```

---

## 五、实现阶段划分

### Phase 1: 基础架构搭建 (Week 1-2)

**目标**: 项目初始化，核心框架搭建

| 任务 | 优先级 | 产出 |
|------|--------|------|
| 项目脚手架搭建 | P0 | Monorepo 结构 |
| Docker PostgreSQL 配置 | P0 | 开发数据库 |
| Vendure 后端初始化 | P0 | 基础 API |
| Next.js 前端初始化 | P0 | App Router 结构 |
| GraphQL Codegen 配置 | P0 | 类型安全 |
| shadcn/ui 初始化 | P0 | UI 组件库 |
| Tailwind 响应式配置 | P0 | 断点系统 |

### Phase 2: CMS Plugin 开发 (Week 2-3)

**目标**: 自定义内容管理功能

| 任务 | 优先级 | 产出 |
|------|--------|------|
| Banner 实体 + CRUD | P0 | 轮播管理 |
| Page 实体 + 富文本 | P0 | 页面管理 |
| CaseStudy 实体 | P0 | 案例管理 |
| Certification 实体 | P1 | 认证管理 |
| Admin UI Extensions | P0 | 后台界面 |

### Phase 3: 前端核心页面 (Week 3-5)

**目标**: P0 功能页面开发

| 任务 | 优先级 | 产出 |
|------|--------|------|
| 响应式布局框架 | P0 | Header/Footer |
| 首页开发 | P0 | 轮播+分类+新品 |
| 产品列表页 | P0 | 分类筛选 |
| 产品详情页 | P0 | 图片放大+视频 |
| 案例列表页 | P0 | 案例展示 |
| 案例详情页 | P0 | 对比滑块 |
| 关于我们页 | P0 | 公司介绍 |
| 联系我们页 | P0 | 表单提交 |

### Phase 4: 多语言支持 (Week 5-6)

**目标**: 国际化功能

| 任务 | 优先级 | 产出 |
|------|--------|------|
| next-intl 集成 | P0 | i18n 框架 |
| 语言切换器 | P0 | UI 组件 |
| 浏览器语言检测 | P1 | 自动跳转 |
| 翻译文件管理 | P0 | JSON 文件 |
| Vendure 多语言配置 | P0 | 后台翻译 |

### Phase 5: SEO + 性能优化 (Week 6-7)

**目标**: 搜索引擎优化和性能提升

| 任务 | 优先级 | 产出 |
|------|--------|------|
| Meta 标签配置 | P1 | 动态 SEO |
| Sitemap 生成 | P1 | 自动更新 |
| 结构化数据 | P2 | Schema.org |
| 图片懒加载 | P1 | 性能优化 |
| Next.js Image 优化 | P0 | 自动压缩 |
| 代码分割 | P1 | Bundle 优化 |

### Phase 6: Contact Plugin + Analytics (Week 7-8)

**目标**: 联系表单和数据统计

| 任务 | 优先级 | 产出 |
|------|--------|------|
| Contact Plugin 开发 | P0 | 表单提交 |
| 邮件通知集成 | P1 | 新留言通知 |
| GA4 集成 | P1 | 访问统计 |
| 热门产品统计 | P1 | 点击追踪 |

### Phase 7: 部署上线 (Week 8-9)

**目标**: 生产环境部署

| 任务 | 优先级 | 产出 |
|------|--------|------|
| 云服务器配置 | P0 | AWS/GCP |
| PostgreSQL 生产库 | P0 | 数据库 |
| Cloudflare 配置 | P0 | CDN + SSL |
| 域名解析 | P0 | DNS 配置 |
| CI/CD 流水线 | P1 | 自动部署 |
| 备份策略 | P1 | 每日备份 |

---

## 六、关键技术实现

### 6.1 GraphQL 客户端配置

```typescript
// apps/storefront/src/lib/graphql-client.ts
import { GraphQLClient } from 'graphql-request';

const API_URL = process.env.NEXT_PUBLIC_SHOP_API_URL || 'http://localhost:3000/shop-api';

export const graphqlClient = new GraphQLClient(API_URL, {
  credentials: 'include',
  headers: {
    'vendure-token': '', // 从 cookie 读取
  },
});

// React Query 配置
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 分钟
      gcTime: 5 * 60 * 1000, // 5 分钟
    },
  },
});
```

### 6.2 多语言路由配置

```typescript
// apps/storefront/src/i18n/config.ts
export const locales = ['en', 'es', 'de', 'fr'] as const;
export const defaultLocale = 'en' as const;

export type Locale = (typeof locales)[number];

// middleware.ts
import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/config';

export default createMiddleware({
  locales,
  defaultLocale,
  localeDetection: true, // 浏览器语言检测
});

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
```

### 6.3 响应式断点

```typescript
// tailwind.config.ts
export default {
  theme: {
    screens: {
      'sm': '375px',   // 手机
      'md': '768px',   // 平板
      'lg': '1024px',  // 小桌面
      'xl': '1280px',  // 桌面
      '2xl': '1920px', // 大桌面
    },
  },
};
```

### 6.4 图片优化策略

```typescript
// next.config.ts
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'your-vendure-server.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [375, 640, 768, 1024, 1280, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
};
```

### 6.5 联系表单安全

```typescript
// apps/storefront/src/app/api/contact/route.ts
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(10).max(2000),
  // 蜜罐字段防机器人
  honeypot: z.string().max(0),
});

export async function POST(request: Request) {
  const body = await request.json();

  // 验证输入
  const result = contactSchema.safeParse(body);
  if (!result.success) {
    return Response.json({ error: 'Invalid input' }, { status: 400 });
  }

  // 蜜罐检测
  if (result.data.honeypot) {
    return Response.json({ success: true }); // 静默失败
  }

  // 提交到 Vendure Contact Plugin
  // ...
}
```

---

## 七、部署架构

### 7.1 推荐方案: AWS (美国/欧洲节点)

```
┌─────────────────────────────────────────────────────────────────┐
│                      Cloudflare (CDN + WAF)                      │
│                    • 全球 300+ 节点                              │
│                    • 免费 SSL 证书                               │
│                    • DDoS 防护                                   │
└─────────────────────────────────────────────────────────────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    ▼                           ▼
┌─────────────────────────────┐   ┌─────────────────────────────┐
│       Vercel (前端)          │   │    AWS EC2 (后端)           │
│  -------------------------  │   │  -------------------------  │
│  • Next.js 自动部署          │   │  • t3.medium (2vCPU/4GB)    │
│  • 边缘函数                  │   │  • Docker Compose           │
│  • 图片优化                  │   │  • Vendure + Worker         │
│  • 免费 SSL                  │   │  • Nginx 反向代理           │
│  • 自动 CI/CD               │   │                             │
└─────────────────────────────┘   └─────────────────────────────┘
                                              │
                                              ▼
                               ┌─────────────────────────────┐
                               │   AWS RDS PostgreSQL        │
                               │  -------------------------  │
                               │  • db.t3.micro              │
                               │  • 自动备份                  │
                               │  • Multi-AZ (可选)          │
                               └─────────────────────────────┘
                                              │
                                              ▼
                               ┌─────────────────────────────┐
                               │   AWS S3 (资产存储)          │
                               │  -------------------------  │
                               │  • 产品图片                  │
                               │  • 视频文件                  │
                               │  • 生命周期策略              │
                               └─────────────────────────────┘
```

### 7.2 成本估算 (月度)

| 服务 | 配置 | 月费用 (USD) |
|------|------|-------------|
| Vercel | Pro | $20 |
| AWS EC2 | t3.medium | ~$30 |
| AWS RDS | db.t3.micro | ~$15 |
| AWS S3 | 50GB | ~$2 |
| Cloudflare | Free | $0 |
| 域名 (.com) | 年付 | ~$1 |
| **合计** | | **~$68/月** |

### 7.3 备选方案: 一体化 VPS

| 服务 | 配置 | 月费用 (USD) |
|------|------|-------------|
| DigitalOcean/Vultr | 4GB RAM | $24 |
| Cloudflare | Free | $0 |
| **合计** | | **~$24/月** |

---

## 八、安全措施

### 8.1 应用层安全

- [x] Zod 输入验证 (防 SQL 注入)
- [x] CSRF Token
- [x] Rate Limiting (API 限流)
- [x] 蜜罐字段 (防机器人)
- [x] 文件上传白名单 (仅允许图片/视频)
- [x] 文件大小限制 (10MB)

### 8.2 基础设施安全

- [x] HTTPS 强制 (Cloudflare SSL)
- [x] 安全 Headers (CSP, HSTS)
- [x] 数据库密码加密存储
- [x] 环境变量管理 (.env)
- [x] 定期安全更新

### 8.3 备份策略

```yaml
# 每日自动备份
Database:
  - 每日 03:00 UTC 全量备份
  - 保留 7 天
  - 异地存储 (S3 不同区域)

Assets:
  - S3 版本控制
  - 跨区域复制 (可选)
```

---

## 九、性能指标

| 指标 | 目标 | 测试工具 |
|------|------|----------|
| 首页 LCP | < 2.5s | Lighthouse |
| 首页 FCP | < 1.8s | Lighthouse |
| CLS | < 0.1 | Lighthouse |
| API 响应 | < 200ms | 压测工具 |
| 并发支持 | ≥ 1000 | k6/Locust |
| Lighthouse 分数 | ≥ 90 | Lighthouse |

---

## 十、浏览器兼容性

| 浏览器 | 最低版本 | 测试状态 |
|--------|----------|----------|
| Chrome | 90+ | 🟢 支持 |
| Firefox | 88+ | 🟢 支持 |
| Safari | 14+ | 🟢 支持 |
| Edge | 90+ | 🟢 支持 |
| iOS Safari | 14+ | 🟢 支持 |
| Android Chrome | 90+ | 🟢 支持 |

---

## 十一、开发命令

```bash
# 安装依赖
npm install

# 启动数据库
docker compose up -d

# 启动开发服务
npm run dev

# 仅启动后端
npm run dev -w apps/server

# 仅启动前端
npm run dev -w apps/storefront

# 生成 GraphQL 类型
npm run codegen -w apps/storefront

# 构建生产版本
npm run build

# 运行测试
npm run test

# 数据库迁移
npm run migration:run -w apps/server
```

---

## 十二、验收清单

### P0 功能验收

- [ ] 首页轮播正常显示和切换
- [ ] 产品分类导航正确
- [ ] 产品列表分页正常
- [ ] 产品详情图片放大功能
- [ ] 案例前后对比滑块
- [ ] 联系表单提交成功
- [ ] 多语言切换正常
- [ ] 响应式布局 (PC/平板/手机)
- [ ] 首页加载 < 3秒
- [ ] SSL 证书有效
- [ ] 后台产品管理正常

### P1 功能验收

- [ ] 产品搜索筛选
- [ ] 客户评价展示
- [ ] SEO Meta 配置
- [ ] Sitemap 生成
- [ ] GA4 数据采集
- [ ] 浏览器语言自动检测
- [ ] 每日数据备份

---

**文档版本**: 1.0
**最后更新**: 2025-01-28
