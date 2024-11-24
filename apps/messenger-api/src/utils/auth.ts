import { User } from '@prisma/client';
import jwt from 'jsonwebtoken';

export const generateAuthToken = (user: User) => {
  return jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET!,
    { expiresIn: '1d' }
  );
}; 