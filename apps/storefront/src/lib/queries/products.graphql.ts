import { graphql } from '@/gql';

export const GET_PRODUCTS = graphql(`
  query GetProducts($options: ProductListOptions) {
    products(options: $options) {
      items {
        id
        name
        slug
        description
        featuredAsset {
          id
          preview
          source
        }
        variants {
          id
          name
          priceWithTax
          currencyCode
        }
        customFields {
          isNew
          isFeatured
          material
          style
        }
      }
      totalItems
    }
  }
`);

export const GET_PRODUCT = graphql(`
  query GetProduct($slug: String!) {
    product(slug: $slug) {
      id
      name
      slug
      description
      featuredAsset {
        id
        preview
        source
      }
      assets {
        id
        preview
        source
      }
      variants {
        id
        name
        sku
        priceWithTax
        currencyCode
        stockLevel
      }
      customFields {
        videoUrl
        material
        style
        applicationScenes
        isNew
        isFeatured
      }
    }
  }
`);

export const GET_COLLECTIONS = graphql(`
  query GetCollections($options: CollectionListOptions) {
    collections(options: $options) {
      items {
        id
        name
        slug
        description
        featuredAsset {
          id
          preview
          source
        }
        parent {
          id
          name
        }
        children {
          id
          name
          slug
        }
        customFields {
          showOnHomepage
        }
      }
      totalItems
    }
  }
`);

export const GET_COLLECTION = graphql(`
  query GetCollection($slug: String!) {
    collection(slug: $slug) {
      id
      name
      slug
      description
      featuredAsset {
        id
        preview
        source
      }
      children {
        id
        name
        slug
        featuredAsset {
          preview
        }
      }
      productVariants {
        items {
          product {
            id
            name
            slug
            description
            featuredAsset {
              preview
            }
            variants {
              priceWithTax
              currencyCode
            }
            customFields {
              isNew
              isFeatured
            }
          }
        }
        totalItems
      }
    }
  }
`);

export const SEARCH_PRODUCTS = graphql(`
  query SearchProducts($input: SearchInput!) {
    search(input: $input) {
      items {
        productId
        productName
        slug
        description
        productAsset {
          preview
        }
        priceWithTax {
          ... on SinglePrice {
            value
          }
          ... on PriceRange {
            min
            max
          }
        }
        currencyCode
      }
      totalItems
      facetValues {
        count
        facetValue {
          id
          name
          facet {
            id
            name
          }
        }
      }
    }
  }
`);
