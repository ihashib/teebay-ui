import { gql } from '@apollo/client'

export const GET_ALL_PRODUCTS = gql`
  query GetAllProducts {
    products {
      id
      title
      description
      price
      rentPrice
      rentUnit
      owner {
        id
        email
      }
    }
  }
`

export const GET_MY_PRODUCTS = gql`
  query GetMyProducts {
    userProducts {
      id
      title
      description
      price
      rentPrice
      rentUnit
    }
  }
`

export const GET_MY_ORDERS = gql`
  query GetMyOrders {
    buyerOrders {
      id
      type
      rentStart
      rentEnd
      product {
        id
        title
      }
      buyer {
        id
        email
      }
    }
  }
`

export const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    getCurrentUser {
      id
      email
      firstName
      lastName
      userType
      address
      phoneNumber
    }
  }
`

export const GET_PRODUCT_BY_ID = gql`
  query GetProductById($productId: ID!) {
    productById(productId: $productId) {
      id
      title
      description
      price
      rentPrice
      rentUnit
      categories
      owner {
        id
        email
        firstName
        lastName
      }
    }
  }
`

export const GET_MY_BOUGHT_ORDERS = gql`
  query GetMySoldProducts {
    buyerBoughtOrders {
      id
      product {
        title
      }
      type
    }
  }
`

export const GET_MY_SOLD_PRODUCTS = gql`
  query GetMySoldProducts {
    ownerSoldBoughtOrders {
      id
      product {
        title
      }
      buyer {
        email
      }
    }
  }
`

export const GET_MY_BORROWED_PRODUCTS = gql`
  query GetMyBorrowedProducts {
    buyerRentedOrders {
      id
      product {
        title
      }
      rentStart
      rentEnd
    }
  }
`

export const GET_MY_LENT_PRODUCTS = gql`
  query buyerRentedOrders {
    ownerSoldRentedOrders {
      id
      product {
        title
      }
      buyer {
        email
      }
      rentStart
      rentEnd
    }
  }
`
