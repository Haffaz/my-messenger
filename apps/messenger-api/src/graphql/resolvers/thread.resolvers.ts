import { CreateThreadInput } from "@repo/shared-types";
import { Context } from "../../types/context";

export const threadResolvers = {
  Query: {
    threads: async (
      _parent: unknown,
      _args: unknown,
      { prisma, user }: Context,
    ) => {
      return prisma.thread.findMany({
        where: {
          participants: {
            some: {
              id: user.id,
            },
          },
        },
        include: {
          participants: true,
          messages: {
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      });
    },
  },
  Mutation: {
    createThread: async (
      _parent: unknown,
      { input }: { input: CreateThreadInput },
      { prisma, user }: Context,
    ) => {
      return prisma.thread.create({
        data: {
          participants: { connect: input.participants.map((id) => ({ id })) },
          createdById: user.id,
        },
      });
    },
  },
  Thread: {
    lastMessage: async (parent: any, _: any, { prisma }: Context) => {
      return prisma.message.findFirst({
        where: { threadId: parent.id },
        orderBy: { createdAt: "desc" },
      });
    },
  },
};
