import gql from 'graphql-tag';

const commonTypes = gql`
  type Banner implements Node {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
    code: String!
    position: Int!
    enabled: Boolean!
    link: String
    image: Asset
    title: String!
    subtitle: String!
  }

  type BannerList implements PaginatedList {
    items: [Banner!]!
    totalItems: Int!
  }

  type Page implements Node {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
    slug: String!
    enabled: Boolean!
    title: String!
    content: String!
    seoTitle: String
    seoDescription: String
  }

  type PageList implements PaginatedList {
    items: [Page!]!
    totalItems: Int!
  }

  type CaseCategory implements Node {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
    code: String!
    position: Int!
    name: String!
  }

  type CaseStudy implements Node {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
    slug: String!
    enabled: Boolean!
    position: Int!
    location: String
    completedAt: DateTime
    category: CaseCategory
    beforeImage: Asset
    afterImage: Asset
    featuredImage: Asset
    gallery: [Asset!]!
    title: String!
    description: String!
    content: String!
    reviews: [CustomerReview!]!
  }

  type CaseStudyList implements PaginatedList {
    items: [CaseStudy!]!
    totalItems: Int!
  }

  type CustomerReview implements Node {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
    customerName: String!
    customerCompany: String
    rating: Int!
    enabled: Boolean!
    position: Int!
    content: String!
  }

  type Certification implements Node {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
    code: String!
    position: Int!
    enabled: Boolean!
    icon: Asset
    certificate: Asset
    name: String!
    description: String!
  }

  type CertificationList implements PaginatedList {
    items: [Certification!]!
    totalItems: Int!
  }

  type TeamMember implements Node {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
    name: String!
    email: String
    position: Int!
    enabled: Boolean!
    photo: Asset
    jobTitle: String!
    bio: String!
  }

  type TeamMemberList implements PaginatedList {
    items: [TeamMember!]!
    totalItems: Int!
  }

  type CompanyTimeline implements Node {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
    year: Int!
    position: Int!
    enabled: Boolean!
    image: Asset
    title: String!
    description: String!
  }

  type CompanyTimelineList implements PaginatedList {
    items: [CompanyTimeline!]!
    totalItems: Int!
  }
`;

export const shopApiExtensions = gql`
  ${commonTypes}

  extend type Query {
    banners: [Banner!]!
    banner(id: ID, code: String): Banner

    page(id: ID, slug: String): Page

    caseStudies(categoryId: ID): [CaseStudy!]!
    caseStudy(id: ID, slug: String): CaseStudy
    caseCategories: [CaseCategory!]!

    certifications: [Certification!]!
    certification(id: ID, code: String): Certification

    teamMembers: [TeamMember!]!
    companyTimeline: [CompanyTimeline!]!
  }
`;

export const adminApiExtensions = gql`
  ${commonTypes}

  input BannerTranslationInput {
    languageCode: LanguageCode!
    title: String!
    subtitle: String
  }

  input CreateBannerInput {
    code: String!
    position: Int
    enabled: Boolean
    link: String
    imageId: ID
    translations: [BannerTranslationInput!]!
  }

  input UpdateBannerInput {
    id: ID!
    code: String
    position: Int
    enabled: Boolean
    link: String
    imageId: ID
    translations: [BannerTranslationInput!]
  }

  input PageTranslationInput {
    languageCode: LanguageCode!
    title: String!
    content: String
    seoTitle: String
    seoDescription: String
  }

  input CreatePageInput {
    slug: String!
    enabled: Boolean
    translations: [PageTranslationInput!]!
  }

  input UpdatePageInput {
    id: ID!
    slug: String
    enabled: Boolean
    translations: [PageTranslationInput!]
  }

  input CaseStudyTranslationInput {
    languageCode: LanguageCode!
    title: String!
    description: String
    content: String
  }

  input CreateCaseStudyInput {
    slug: String!
    enabled: Boolean
    position: Int
    location: String
    completedAt: DateTime
    categoryId: ID
    beforeImageId: ID
    afterImageId: ID
    featuredImageId: ID
    galleryIds: [ID!]
    translations: [CaseStudyTranslationInput!]!
  }

  input UpdateCaseStudyInput {
    id: ID!
    slug: String
    enabled: Boolean
    position: Int
    location: String
    completedAt: DateTime
    categoryId: ID
    beforeImageId: ID
    afterImageId: ID
    featuredImageId: ID
    galleryIds: [ID!]
    translations: [CaseStudyTranslationInput!]
  }

  input CertificationTranslationInput {
    languageCode: LanguageCode!
    name: String!
    description: String
  }

  input CreateCertificationInput {
    code: String!
    position: Int
    enabled: Boolean
    iconId: ID
    certificateId: ID
    translations: [CertificationTranslationInput!]!
  }

  input UpdateCertificationInput {
    id: ID!
    code: String
    position: Int
    enabled: Boolean
    iconId: ID
    certificateId: ID
    translations: [CertificationTranslationInput!]
  }

  input BannerListOptions {
    skip: Int
    take: Int
    sort: BannerSortParameter
    filter: BannerFilterParameter
  }

  input BannerSortParameter {
    id: SortOrder
    code: SortOrder
    position: SortOrder
    createdAt: SortOrder
    updatedAt: SortOrder
  }

  input BannerFilterParameter {
    id: IDOperators
    code: StringOperators
    enabled: BooleanOperators
    createdAt: DateOperators
    updatedAt: DateOperators
  }

  input PageListOptions {
    skip: Int
    take: Int
    sort: PageSortParameter
    filter: PageFilterParameter
  }

  input PageSortParameter {
    id: SortOrder
    slug: SortOrder
    createdAt: SortOrder
    updatedAt: SortOrder
  }

  input PageFilterParameter {
    id: IDOperators
    slug: StringOperators
    enabled: BooleanOperators
    createdAt: DateOperators
    updatedAt: DateOperators
  }

  input CaseStudyListOptions {
    skip: Int
    take: Int
    sort: CaseStudySortParameter
    filter: CaseStudyFilterParameter
  }

  input CaseStudySortParameter {
    id: SortOrder
    slug: SortOrder
    position: SortOrder
    createdAt: SortOrder
    updatedAt: SortOrder
  }

  input CaseStudyFilterParameter {
    id: IDOperators
    slug: StringOperators
    enabled: BooleanOperators
    createdAt: DateOperators
    updatedAt: DateOperators
  }

  input CertificationListOptions {
    skip: Int
    take: Int
    sort: CertificationSortParameter
    filter: CertificationFilterParameter
  }

  input CertificationSortParameter {
    id: SortOrder
    code: SortOrder
    position: SortOrder
    createdAt: SortOrder
    updatedAt: SortOrder
  }

  input CertificationFilterParameter {
    id: IDOperators
    code: StringOperators
    enabled: BooleanOperators
    createdAt: DateOperators
    updatedAt: DateOperators
  }

  extend type Query {
    banners(options: BannerListOptions): BannerList!
    banner(id: ID!): Banner

    pages(options: PageListOptions): PageList!
    page(id: ID!): Page

    caseStudies(options: CaseStudyListOptions): CaseStudyList!
    caseStudy(id: ID!): CaseStudy
    caseCategories: [CaseCategory!]!

    certifications(options: CertificationListOptions): CertificationList!
    certification(id: ID!): Certification

    teamMembers: TeamMemberList!
    companyTimeline: CompanyTimelineList!
  }

  extend type Mutation {
    createBanner(input: CreateBannerInput!): Banner!
    updateBanner(input: UpdateBannerInput!): Banner!
    deleteBanner(id: ID!): DeletionResponse!

    createPage(input: CreatePageInput!): Page!
    updatePage(input: UpdatePageInput!): Page!
    deletePage(id: ID!): DeletionResponse!

    createCaseStudy(input: CreateCaseStudyInput!): CaseStudy!
    updateCaseStudy(input: UpdateCaseStudyInput!): CaseStudy!
    deleteCaseStudy(id: ID!): DeletionResponse!

    createCertification(input: CreateCertificationInput!): Certification!
    updateCertification(input: UpdateCertificationInput!): Certification!
    deleteCertification(id: ID!): DeletionResponse!
  }
`;
