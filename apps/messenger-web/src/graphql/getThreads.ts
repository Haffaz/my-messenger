import { graphql } from "../graphql/generated";

export const GET_THREADS = graphql(`
    query GetThreads {
      threads {
        id
        participants {
          id
          username
        }
        lastMessage {
          content
          createdAt
        }
      }
    }
  `);
