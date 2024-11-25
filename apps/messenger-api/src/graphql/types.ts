import { authTypeDefs } from "./auth.types";
import { messageTypeDefs } from "./message.types";
import { threadTypeDefs } from "./thread.types";

export const baseTypeDefs = `#graphql
  type User {
    id: ID!
    username: String!
  }

  type Query {
    hello: String!
  }

  type Mutation {
    _empty: String
  }

  type Subscription {
    messageCreated(threadId: ID!): Message!
  }
`;

export const typeDefs = `#graphql
  ${baseTypeDefs}
  ${authTypeDefs}
  ${messageTypeDefs}
  ${threadTypeDefs}
`;
