import { CreateThreadInput } from "../schemas/thread.schema";
import { Context } from "../types/context";

export const threadResolvers = {
    Query: {
        threads: async (_, {}, { prisma }: Context) => {
            return prisma.thread.findMany();
        }
    },
    Mutation: {
        createThread: async (_, { input }: { input: CreateThreadInput }, { prisma }: Context) => {
            return prisma.thread.create({ data: { participants: { connect: input.participants.map((id) => ({ id })) } } });
        }
    }
}