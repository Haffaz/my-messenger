import { Context } from "../../types/context";
import { pubsub } from "../../utils/pubsub";

export const baseResolvers = {
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
