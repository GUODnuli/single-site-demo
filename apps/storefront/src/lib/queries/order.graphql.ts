import { graphql } from '@/gql';

export const ORDER_FRAGMENT = `
  fragment OrderFields on Order {
    id
    code
    state
    active
    totalQuantity
    subTotal
    subTotalWithTax
    shipping
    shippingWithTax
    total
    totalWithTax
    currencyCode
    couponCodes
    lines {
      id
      quantity
      linePriceWithTax
      unitPriceWithTax
      productVariant {
        id
        name
        sku
        priceWithTax
        product {
          id
          name
          slug
          featuredAsset {
            id
            preview
          }
        }
      }
    }
    shippingLines {
      shippingMethod {
        id
        name
        description
      }
      priceWithTax
    }
    customer {
      id
      firstName
      lastName
      emailAddress
    }
    shippingAddress {
      fullName
      streetLine1
      streetLine2
      city
      province
      postalCode
      country
      phoneNumber
    }
  }
`;

export const GET_ACTIVE_ORDER = graphql(`
  query GetActiveOrder {
    activeOrder {
      id
      code
      state
      active
      totalQuantity
      subTotal
      subTotalWithTax
      shipping
      shippingWithTax
      total
      totalWithTax
      currencyCode
      lines {
        id
        quantity
        linePriceWithTax
        unitPriceWithTax
        productVariant {
          id
          name
          sku
          priceWithTax
          product {
            id
            name
            slug
            featuredAsset {
              id
              preview
            }
          }
        }
      }
      shippingLines {
        shippingMethod {
          id
          name
          description
        }
        priceWithTax
      }
      customer {
        id
        firstName
        lastName
        emailAddress
      }
      shippingAddress {
        fullName
        streetLine1
        streetLine2
        city
        province
        postalCode
        country
        phoneNumber
      }
    }
  }
`);

export const ADD_ITEM_TO_ORDER = graphql(`
  mutation AddItemToOrder($productVariantId: ID!, $quantity: Int!) {
    addItemToOrder(productVariantId: $productVariantId, quantity: $quantity) {
      ... on Order {
        id
        totalQuantity
        totalWithTax
        lines {
          id
          quantity
          linePriceWithTax
          unitPriceWithTax
          productVariant {
            id
            name
            sku
            priceWithTax
            product {
              id
              name
              slug
              featuredAsset {
                id
                preview
              }
            }
          }
        }
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`);

export const ADJUST_ORDER_LINE = graphql(`
  mutation AdjustOrderLine($orderLineId: ID!, $quantity: Int!) {
    adjustOrderLine(orderLineId: $orderLineId, quantity: $quantity) {
      ... on Order {
        id
        totalQuantity
        totalWithTax
        lines {
          id
          quantity
          linePriceWithTax
          unitPriceWithTax
          productVariant {
            id
            name
            sku
            priceWithTax
            product {
              id
              name
              slug
              featuredAsset {
                id
                preview
              }
            }
          }
        }
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`);

export const REMOVE_ORDER_LINE = graphql(`
  mutation RemoveOrderLine($orderLineId: ID!) {
    removeOrderLine(orderLineId: $orderLineId) {
      ... on Order {
        id
        totalQuantity
        totalWithTax
        lines {
          id
          quantity
          linePriceWithTax
          unitPriceWithTax
          productVariant {
            id
            name
            sku
            priceWithTax
            product {
              id
              name
              slug
              featuredAsset {
                id
                preview
              }
            }
          }
        }
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`);

export const SET_CUSTOMER_FOR_ORDER = graphql(`
  mutation SetCustomerForOrder($input: CreateCustomerInput!) {
    setCustomerForOrder(input: $input) {
      ... on Order {
        id
        customer {
          id
          firstName
          lastName
          emailAddress
        }
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`);

export const SET_SHIPPING_ADDRESS = graphql(`
  mutation SetOrderShippingAddress($input: CreateAddressInput!) {
    setOrderShippingAddress(input: $input) {
      ... on Order {
        id
        shippingAddress {
          fullName
          streetLine1
          streetLine2
          city
          province
          postalCode
          country
          phoneNumber
        }
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`);

export const GET_ELIGIBLE_SHIPPING_METHODS = graphql(`
  query GetEligibleShippingMethods {
    eligibleShippingMethods {
      id
      name
      description
      price
      priceWithTax
    }
  }
`);

export const SET_SHIPPING_METHOD = graphql(`
  mutation SetOrderShippingMethod($shippingMethodId: [ID!]!) {
    setOrderShippingMethod(shippingMethodId: $shippingMethodId) {
      ... on Order {
        id
        shipping
        shippingWithTax
        total
        totalWithTax
        shippingLines {
          shippingMethod {
            id
            name
            description
          }
          priceWithTax
        }
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`);

export const GET_ELIGIBLE_PAYMENT_METHODS = graphql(`
  query GetEligiblePaymentMethods {
    eligiblePaymentMethods {
      id
      name
      description
      isEligible
    }
  }
`);

export const TRANSITION_ORDER_TO_STATE = graphql(`
  mutation TransitionOrderToState($state: String!) {
    transitionOrderToState(state: $state) {
      ... on Order {
        id
        state
        code
      }
      ... on OrderStateTransitionError {
        errorCode
        message
        transitionError
        fromState
        toState
      }
    }
  }
`);

export const ADD_PAYMENT_TO_ORDER = graphql(`
  mutation AddPaymentToOrder($input: PaymentInput!) {
    addPaymentToOrder(input: $input) {
      ... on Order {
        id
        state
        code
        totalWithTax
        payments {
          id
          method
          amount
          state
        }
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`);

export const GET_ORDER_BY_CODE = graphql(`
  query GetOrderByCode($code: String!) {
    orderByCode(code: $code) {
      id
      code
      state
      totalQuantity
      subTotalWithTax
      shippingWithTax
      totalWithTax
      currencyCode
      orderPlacedAt
      lines {
        id
        quantity
        linePriceWithTax
        unitPriceWithTax
        productVariant {
          id
          name
          sku
          product {
            id
            name
            slug
            featuredAsset {
              id
              preview
            }
          }
        }
      }
      shippingLines {
        shippingMethod {
          id
          name
        }
        priceWithTax
      }
      customer {
        firstName
        lastName
        emailAddress
      }
      shippingAddress {
        fullName
        streetLine1
        streetLine2
        city
        province
        postalCode
        country
        phoneNumber
      }
      payments {
        id
        method
        amount
        state
      }
    }
  }
`);
