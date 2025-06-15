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