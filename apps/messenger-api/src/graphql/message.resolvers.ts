import { GraphQLError } from "graphql";
import { SendMessageInput, sendMessageInputSchema } from "../schemas/messege.schema";
import { Context } from "../types/context";

export const messageResolvers = {
    Query: {
        messages: async (_parent: unknown, { threadId }: { threadId: string }, context: Context) => {
            return context.prisma.message.findMany({ where: { threadId: threadId } });
        },
    },
    Mutation: {
        sendMessage: async (_parent: unknown, { input }: { input: SendMessageInput }, { prisma }: Context) => {
            try {
                const validatedInput = sendMessageInputSchema.parse(input);
                return prisma.$transaction(async(tx) => {
                    let thread = await tx.thread.findFirst({ 
                        where: { id: validatedInput.threadId } 
                    });

                    const receiver = await tx.user.findUnique({
                        where: { username: validatedInput.receiverUsername }
                    });

                    if (!receiver) {
                        throw new GraphQLError('Receiver not found', { extensions: { code: 'BAD_REQUEST' } });
                    }

                    // If thread doesn't exist, create a new one
                    if (!thread) {
                        thread = await tx.thread.create({
                            data: {
                                createdById: validatedInput.senderId,
                                participants: {
                                    connect: [
                                        { id: validatedInput.senderId },
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
                            senderId: validatedInput.senderId
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