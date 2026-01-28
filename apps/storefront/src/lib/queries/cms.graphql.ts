import { graphql } from '@/gql';

export const GET_BANNERS = graphql(`
  query GetBanners {
    banners {
      id
      code
      position
      enabled
      link
      image {
        id
        preview
        source
      }
      title
      subtitle
    }
  }
`);

export const GET_PAGE = graphql(`
  query GetPage($slug: String!) {
    page(slug: $slug) {
      id
      slug
      enabled
      title
      content
      seoTitle
      seoDescription
    }
  }
`);

export const GET_CASE_STUDIES = graphql(`
  query GetCaseStudies($categoryId: ID) {
    caseStudies(categoryId: $categoryId) {
      id
      slug
      enabled
      position
      location
      completedAt
      category {
        id
        code
        name
      }
      beforeImage {
        id
        preview
        source
      }
      afterImage {
        id
        preview
        source
      }
      featuredImage {
        id
        preview
        source
      }
      title
      description
    }
  }
`);

export const GET_CASE_STUDY = graphql(`
  query GetCaseStudy($slug: String!) {
    caseStudy(slug: $slug) {
      id
      slug
      enabled
      position
      location
      completedAt
      category {
        id
        code
        name
      }
      beforeImage {
        id
        preview
        source
      }
      afterImage {
        id
        preview
        source
      }
      featuredImage {
        id
        preview
        source
      }
      gallery {
        id
        preview
        source
      }
      title
      description
      content
      reviews {
        id
        customerName
        customerCompany
        rating
        content
      }
    }
  }
`);

export const GET_CASE_CATEGORIES = graphql(`
  query GetCaseCategories {
    caseCategories {
      id
      code
      position
      name
    }
  }
`);

export const GET_CERTIFICATIONS = graphql(`
  query GetCertifications {
    certifications {
      id
      code
      position
      enabled
      icon {
        id
        preview
        source
      }
      certificate {
        id
        preview
        source
      }
      name
      description
    }
  }
`);

export const GET_TEAM_MEMBERS = graphql(`
  query GetTeamMembers {
    teamMembers {
      items {
        id
        name
        email
        position
        enabled
        photo {
          id
          preview
          source
        }
        jobTitle
        bio
      }
      totalItems
    }
  }
`);

export const GET_COMPANY_TIMELINE = graphql(`
  query GetCompanyTimeline {
    companyTimeline {
      items {
        id
        year
        position
        enabled
        image {
          id
          preview
          source
        }
        title
        description
      }
      totalItems
    }
  }
`);
