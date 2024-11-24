import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { UserInterface } from '../types/context';

export const getUser = async (
  token: string,
  prisma: PrismaClient
): Promise<UserInterface | null> => {
  const userId = jwt.verify(token, process.env.JWT_SECRET!) as string;
  return prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, username: true },
}); 
};
