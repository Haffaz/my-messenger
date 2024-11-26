import { graphql } from "../graphql/generated";

export const GET_MESSAGES = graphql(`
  query GetMessages($threadId: ID!) {
    messages(threadId: $threadId) {
        id
        content
        createdAt
      threadId
            sender {
        id
        username
      }
    }
  }
`);
