export const threadTypeDefs = `#graphql
  type Thread {
    id: ID!
    participants: [User!]!
  }

  extend type Query {
    threads: [Thread!]!
  }

  extend type Mutation {
    createThread(participants: [ID!]!): Thread!
  }
`;