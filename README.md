# Curtain Showcase - Vendure + Next.js 窗帘展示独立站

基于 Vendure 3.5+ 和 Next.js 15+ 构建的多语言窗帘品牌展示网站。

## 技术栈

| 层级 | 技术 |
|------|------|
| **后端** | Vendure 3.x (NestJS) |
| **前端** | Next.js 15 (App Router) |
| **数据库** | PostgreSQL 15 |
| **GraphQL** | TanStack Query + graphql-request |
| **UI** | shadcn/ui + Tailwind CSS |
| **多语言** | next-intl |
| **项目结构** | npm workspaces Monorepo |

## 快速开始

### 前置条件

- Node.js 20+
- Docker Desktop (用于 PostgreSQL)
- npm 10+

### 安装步骤

```bash
# 1. 安装依赖
npm install

# 2. 启动 PostgreSQL 数据库
npm run db:up

# 3. 启动开发服务器
npm run dev
```

### 访问地址

| 服务 | 地址 |
|------|------|
| 前端 (Storefront) | http://localhost:3001 |
| Vendure Admin | http://localhost:3000/admin |
| Shop API | http://localhost:3000/shop-api |
| Admin API | http://localhost:3000/admin-api |

### 默认管理员账号

- 用户名: `superadmin`
- 密码: `superadmin`

## 项目结构

```
single-site-demo/
├── apps/
│   ├── server/           # Vendure 后端
│   │   ├── src/
│   │   │   ├── vendure-config.ts
│   │   │   ├── index.ts
│   │   │   ├── migrations/
│   │   │   └── plugins/
│   │   └── .env
│   │
│   └── storefront/       # Next.js 前端
│       ├── src/
│       │   ├── app/[locale]/
│       │   ├── components/
│       │   ├── lib/
│       │   └── i18n/
│       └── .env.local
│
├── docker-compose.yml
├── package.json
└── turbo.json
```

## 开发命令

```bash
# 启动所有服务
npm run dev

# 仅启动后端
npm run dev -w apps/server

# 仅启动前端
npm run dev -w apps/storefront

# 生成 GraphQL 类型
npm run codegen

# 数据库操作
npm run db:up      # 启动数据库
npm run db:down    # 停止数据库
```

## 支持的语言

- English (en) - 默认
- Español (es)
- Deutsch (de)
- Français (fr)
- 中文 (zh)

## 功能模块

### 前端展示
- [x] 首页轮播
- [x] 产品分类导航
- [x] 新品推荐
- [x] 品牌认证展示
- [ ] 产品列表/详情
- [ ] 案例展示
- [ ] 联系表单
- [ ] 多语言切换

### 后台管理
- [x] 产品管理 (Vendure 原生)
- [x] 分类管理 (Vendure 原生)
- [x] 资产管理 (Vendure 原生)
- [ ] CMS 内容管理
- [ ] 联系表单管理
- [ ] 数据统计

## 部署

详见 [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) 中的部署架构章节。

## License

MIT
