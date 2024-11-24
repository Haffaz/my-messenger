import { authResolvers } from "./auth.resolvers";
import { messageResolvers } from "./message.resolvers";
import { threadResolvers } from "./thread.resolvers";

const baseResolvers = {
  Query: {
    hello: (): string => 'Hello, world!',
  },
};

export const resolvers = [  
  baseResolvers,
  authResolvers,
  messageResolvers,
  threadResolvers,
]; 