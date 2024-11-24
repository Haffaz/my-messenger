import { PrismaClient, User } from '@prisma/client';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { UserInterface } from '../types/context';

type DecodedToken = JwtPayload & { userId: string };

export const getUser = async (
  token: string,
  prisma: PrismaClient
): Promise<UserInterface | null> => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
  return prisma.user.findUnique({
    where: { id: decoded.userId },
    select: { id: true, username: true },
  });
};

export const generateAuthToken = (userId: Pick<User, 'id'>) => {
  return jwt.sign(
    { userId: userId.id },
    process.env.JWT_SECRET!,
    { expiresIn: '1d' }
  );
}; 