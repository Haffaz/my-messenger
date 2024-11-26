import { Message } from "@prisma/client";
import { sendMessageInputSchema } from "@repo/shared-types";
import { GraphQLError } from "graphql";
import { withFilter } from "graphql-subscriptions";
import { convertDateToString } from "../../utils/date";
import { Thread } from "./codegen-types";
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
          let thread: Pick<Thread, "id"> | null = null;

          if (validatedInput.threadId) {
            thread = await tx.thread.findUnique({
              where: { id: validatedInput.threadId },
              select: {
                id: true,
              },
            });

            if (!thread) {
              throw new GraphQLError("Thread not found", {
                extensions: { code: "NOT_FOUND" },
              });
            }
          } else {
            const receiver = await tx.user.findUnique({
              where: { username: validatedInput.receiverUsername },
            });

            if (!receiver) {
              throw new GraphQLError("Receiver not found", {
                extensions: { code: "NOT_FOUND" },
              });
            }

            const existingThread = await tx.thread.findFirst({
              where: {
                AND: [
                  { participants: { some: { id: user.id } } },
                  { participants: { some: { id: receiver.id } } },
                ],
              },
              select: {
                id: true,
              },
            });

            thread =
              existingThread ||
              (await tx.thread.create({
                data: {
                  createdById: user.id,
                  participants: {
                    connect: [{ id: user.id }, { id: receiver.id }],
                  },
                },
              }));
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
        if (error instanceof GraphQLError) throw error;

        throw new GraphQLError(
          error instanceof Error ? error.message : "Failed to send message",
          { extensions: { code: "BAD_REQUEST" } },
        );
      }
    },
  },
  Subscription: {
    messageCreated: {
      subscribe: withFilter(
        (_, { threadId }, { pubsub }) =>
          pubsub.asyncIterableIterator(`MESSAGE_CREATED.${threadId}`),
        (payload: { messageCreated: Message }, variables) => {
          console.log("payload", payload);
          console.log("variables", variables);
          return payload.messageCreated.threadId === variables.threadId;
        },
      ),
    },
  },
};
