import { GraphQLError } from 'graphql';
import { z } from 'zod';
import { LoginInput, loginSchema } from '../schemas/auth.schema';
import { Context } from '../types/context';
import { generateAuthToken } from '../utils/auth';
import { comparePasswords } from '../utils/password';

export const authResolvers = {
  Mutation: {
    login: async (_, { input }: { input: LoginInput }, context: Context) => {
      try {
        // Validate input using Zod
        const validatedInput = loginSchema.parse(input);
        
        // Find user in database
        const user = await context.prisma.user.findUnique({
          where: { username: validatedInput.username },
        });

        if (!user) {
          throw new GraphQLError('Invalid credentials', {
            extensions: { code: 'UNAUTHORIZED' },
          });
        }

        // Verify password
        const isValidPassword = await comparePasswords(
          validatedInput.password,
          user.password_hash
        );

        if (!isValidPassword) {
          throw new GraphQLError('Invalid credentials', {
            extensions: { code: 'UNAUTHORIZED' },
          });
        }

        // Generate JWT token
        const token = generateAuthToken(user);

        return {
          token,
          user,
        };
      } catch (error) {
        if (error instanceof z.ZodError) {
          throw new GraphQLError('Validation error', {
            extensions: {
              code: 'BAD_USER_INPUT',
              validationErrors: error.errors,
            },
          });
        }
        throw error;
      }
    },
  },
}; 