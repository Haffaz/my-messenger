import { sendMessageInputSchema } from "@repo/shared-types";
import { GraphQLError } from "graphql";
import { convertDateToString } from "../../utils/date";
import { MyResolvers } from "./derived-types";

export const messageResolvers: MyResolvers = {
  Query: {
    messages: async (_parent, { threadId }, { prisma }) => {
      return prisma.message
        .findMany({
          where: { threadId },
          orderBy: { createdAt: "asc" },
          include: {
            sender: true,
          },
        })
        .then((messages) => messages.map(convertDateToString));
    },
  },
  Mutation: {
    sendMessage: async (_parent, { input }, { prisma, user, pubsub }) => {
      try {
        const validatedInput = sendMessageInputSchema.parse(input);
        return prisma.$transaction(async (tx) => {
          let thread = await tx.thread.findFirst({
            where: { id: validatedInput.threadId },
          });

          // If thread doesn't exist, create a new one
          if (!thread) {
            const receiver = await tx.user.findUnique({
              where: { username: validatedInput.receiverUsername },
            });

            if (!receiver) {
              throw new GraphQLError("Receiver not found", {
                extensions: { code: "BAD_REQUEST" },
              });
            }

            thread = await tx.thread.create({
              data: {
                createdById: user.id,
                participants: {
                  connect: [{ id: user.id }, { id: receiver.id }],
                },
              },
            });
          }

          const message = await tx.message
            .create({
              data: {
                content: validatedInput.content,
                threadId: thread.id,
                senderId: user.id,
              },
              include: {
                sender: true,
              },
            })
            .then(convertDateToString);

          await pubsub.publish(`MESSAGE_CREATED.${thread.id}`, {
            messageCreated: message,
          });

          return message;
        });
      } catch (error) {
        console.log(error);
        throw new GraphQLError("Failed to send message", {
          extensions: { code: "BAD_REQUEST" },
        });
      }
    },
  },
  Subscription: {
    messageCreated: {
      subscribe: (_, { threadId }, { pubsub }) => {
        return pubsub.asyncIterableIterator([`MESSAGE_CREATED.${threadId}`]);
      },
    },
  },
};
