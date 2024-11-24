import { PrismaClient, User } from '@prisma/client';

export type UserInterface = Pick<User, 'id' | 'username'>;

export type Context = {
  prisma: PrismaClient;
  user: UserInterface;
};
