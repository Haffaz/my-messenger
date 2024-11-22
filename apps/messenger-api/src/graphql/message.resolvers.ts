import { GraphQLError } from "graphql";
import { SendMessageInput, sendMessageInputSchema } from "../schemas/message.schema";
import { Context } from "../types/context";

export const messageResolvers = {
    Query: {
        messages: async (_: any, { threadId }: { threadId: string }, { prisma }: Context) => {
            return prisma.message.findMany({
                where: { threadId },
                orderBy: { createdAt: 'asc' },
                include: {
                    sender: true
                }
            });
        },
    },
    Mutation: {
        sendMessage: async (_parent: unknown, { input }: { input: SendMessageInput }, { prisma, user }: Context) => {
            try {
                const validatedInput = sendMessageInputSchema.parse(input);
                return prisma.$transaction(async(tx) => {
                    let thread = await tx.thread.findFirst({ 
                        where: { id: validatedInput.threadId } 
                    });

                    // If thread doesn't exist, create a new one
                    if (!thread) {
                        const receiver = await tx.user.findUnique({
                            where: { username: validatedInput.receiverUsername }
                        });

                        if (!receiver) {
                            throw new GraphQLError('Receiver not found', { extensions: { code: 'BAD_REQUEST' } });
                        }

                        thread = await tx.thread.create({
                            data: {
                                createdById: user.id,
                                participants: {
                                    connect: [
                                        { id: user.id },
                                        { id: receiver.id }
                                    ]
                                }
                            }
                        });
                    }

                    return tx.message.create({ 
                        data: { 
                            content: validatedInput.content, 
                            threadId: thread.id,
                            senderId: user.id
                        },
                    }); 
                })                
            } catch (error) {
                console.log(error);
                throw new GraphQLError('Failed to send message', { extensions: { code: 'BAD_REQUEST' } });
            }
        },
    }, 
};