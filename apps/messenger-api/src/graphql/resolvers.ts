import { authResolvers } from './auth.resolvers';
import { messagesResolvers } from './messages.resolvers';

export const baseResolvers = {
  Query: {
    hello: (): string => 'Hello, world!',
  },
};

export const resolvers = {
  ...baseResolvers,
  ...authResolvers,
  ...messagesResolvers,
}; 