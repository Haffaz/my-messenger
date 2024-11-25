export const threadTypeDefs = `#graphql
  type Thread {
    id: ID!
    participants: [User!]!
    createdById: ID!
    lastMessage: Message!
  }

  extend type Query {
    threads: [Thread!]!
    thread(id: ID!): Thread
  }

  extend type Mutation {
    createThread(participants: [ID!]!): Thread!
  }
`;