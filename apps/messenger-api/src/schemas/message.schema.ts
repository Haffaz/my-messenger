import { z } from 'zod';

export const sendMessageInputSchema = z.object({
  content: z
    .string()
    .min(1, 'Message content cannot be empty')
    .max(2000, 'Message content cannot exceed 2000 characters'),
  threadId: z.string().optional(),
  receiverUsername: z.string().optional(),
});

export const getMessagesSchema = z.object({
  threadId: z.string(),
});

// For the subscription
export const messageSubscriptionSchema = z.object({
  threadId: z.string(),
});

// Type inference
export type SendMessageInput = z.infer<typeof sendMessageInputSchema>;
export type GetMessagesInput = z.infer<typeof getMessagesSchema>;
