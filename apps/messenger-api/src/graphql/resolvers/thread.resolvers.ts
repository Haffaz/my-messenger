import { convertDateToString } from "../../utils/date";
import { MyResolvers } from "./derived-types";

export const threadResolvers: MyResolvers = {
  Query: {
    threads: async (_parent, _args, { prisma, user }) => {
      return prisma.thread
        .findMany({
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
              take: 1,
              include: {
                sender: true,
              },
            },
          },
        })
        .then((threads) =>
          threads.map((thread) => ({
            ...thread,
            lastMessage: thread.messages[0]
              ? convertDateToString(thread.messages[0])
              : null,
          })),
        );
    },
  },
  Mutation: {
    createThread: async (_parent, { participants }, { prisma, user }) => {
      return prisma.thread
        .create({
          data: {
            participants: { connect: participants.map((id) => ({ id })) },
            createdById: user.id,
          },
          include: {
            participants: true,
            messages: {
              orderBy: {
                createdAt: "desc",
              },
              take: 1,
              include: {
                sender: true,
              },
            },
          },
        })
        .then((thread) => ({
          ...thread,
          lastMessage: thread.messages[0]
            ? convertDateToString(thread.messages[0])
            : null,
        }));
    },
  },
};
