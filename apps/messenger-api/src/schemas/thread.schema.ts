import { z } from 'zod';

export const createThreadInputSchema = z.object({
    participants: z.array(z.string()),
    createdById: z.string(),
});

export type CreateThreadInput = z.infer<typeof createThreadInputSchema>;

  