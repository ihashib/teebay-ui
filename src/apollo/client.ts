import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  ApolloLink,
} from '@apollo/client'

const httpLink = createHttpLink({
  uri: 'http://localhost:8080/graphql',
})

const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem('authToken')
  operation.setContext({
    headers: {
      authorization: token ? `${token}` : '',
    },
  })
  return forward(operation)
})

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})
