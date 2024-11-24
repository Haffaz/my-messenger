import { CreateThreadInput } from "../schemas/thread.schema";
import { Context } from "../types/context";

export const threadResolvers = {
    Query: {
        threads: async (_parent: unknown, _args: unknown, { prisma, user }: Context) => {
            
            return prisma.thread.findMany({
                where: {
                    participants: {
                        some: {
                            id: user.id
                        }
                    }
                },
                include: {
                    participants: true,
                    messages: {
                        orderBy: {
                            createdAt: 'desc'
                        }
                    }
                }
            });
        }
    },
    Mutation: {
        createThread: async (_parent: unknown, { input }: { input: CreateThreadInput }, { prisma }: Context) => {
            return prisma.thread.create({ data: { participants: { connect: input.participants.map((id) => ({ id })) }, createdById: input.createdById  } });
        }
    }
}