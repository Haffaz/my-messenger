export const messageTypeDefs = `#graphql
  type Message {
    id: ID!
    content: String!
    createdAt: String!
    sender: User!
    threadId: ID!
  }

  extend type Query {
    messages(threadId: ID!): [Message!]!
  }

  input SendMessageInput {
    content: String!  
    receiverUsername: String!
    threadId: ID
  }

  extend type Mutation {
    sendMessage(input: SendMessageInput!): Message!
  }
`; 