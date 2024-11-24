import { authTypeDefs } from './auth.types';
import { messagesTypeDefs } from './messages.types';

export const baseTypeDefs = `#graphql
  type User {
    id: ID!
    username: String!
    email: String!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    hello: String!
  }
`;

export const typeDefs = `#graphql
  ${baseTypeDefs}
  ${authTypeDefs}
  ${messagesTypeDefs}
`; 