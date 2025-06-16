import { gql } from '@apollo/client';

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
`;

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
`;

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
`;
