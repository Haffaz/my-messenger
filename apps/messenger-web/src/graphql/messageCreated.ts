import { graphql } from "../graphql/generated";

export const MESSAGE_SUBSCRIPTION = graphql(`
    subscription OnMessageSent($threadId: ID!) {
      messageCreated(threadId: $threadId) {
        content
        id
        createdAt
        threadId
        sender {
          id
          username
        }
      }
  }
`);
