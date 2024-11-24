import { authResolvers } from './auth.resolvers';

export const baseResolvers = {
  Query: {
    hello: (): string => 'Hello, world!',
  },
};

export const resolvers = {
  ...baseResolvers,
  ...authResolvers,
}; 