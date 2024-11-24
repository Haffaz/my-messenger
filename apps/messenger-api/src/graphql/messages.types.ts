export const messagesTypeDefs = `#graphql
  type Message {
    id: ID!
    content: String!
    senderId: ID!
    receiverId: ID!
    threadId: ID!
  }

  type Query {
    messages(threadId: ID!): [Message!]!
  }

  input SendMessageInput {
    content: String!  
    senderId: ID!
    receiverId: ID!
    threadId: ID
  }

  type Mutation {
    sendMessage(input: SendMessageInput!): Message!
  }
`; 