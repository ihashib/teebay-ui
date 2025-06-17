import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input)
  }
`;

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($productId: ID!) {
    deleteProduct(productId: $productId)
  }
`;

export const REGISTER_MUTATION = gql`
  mutation Register($input: UserDto!) {
    register(input: $input) {
      id
      email
      firstName
      lastName
      userType
    }
  }
`;

export const CREATE_PRODUCT_MUTATION = gql`
  mutation CreateProduct($input: ProductInput!) {
    createProduct(input: $input) {
      id
      title
      owner {
        id
        email
      }
    }
  }
`;

export const UPDATE_PRODUCT_MUTATION = gql`
  mutation UpdateProduct($input: ProductInput!) {
    updateProduct(input: $input) {
      id
      title
      description
      categories
      price
      rentPrice
      rentUnit
    }
  }
`;