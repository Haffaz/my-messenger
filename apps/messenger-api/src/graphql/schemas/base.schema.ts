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
