import { PubSub } from "graphql-subscriptions";
import { Context } from "../types/context";
import { authResolvers } from "./auth.resolvers";
import { messageResolvers } from "./message.resolvers";
import { threadResolvers } from "./thread.resolvers";

export const pubsub = new PubSub();

const baseResolvers = {
  Query: {
    hello: (): string => "Hello, world!",
  },
  Subscription: {
    messageCreated: {
      subscribe: (
        parent: any,
        { threadId }: { threadId: string },
        context: Context,
      ) => {
        if (!context.user) {
          throw new Error("Not authenticated");
        }

        console.log(`MESSAGE_CREATED.${threadId}`);

        return pubsub.asyncIterableIterator([`MESSAGE_CREATED.${threadId}`]);
      },
    },
  },
};

export const resolvers = [
  baseResolvers,
  authResolvers,
  messageResolvers,
  threadResolvers,
];
