import { Resolvers } from "./codegen-types";

export const baseResolvers: Resolvers = {
  Query: {
    hello: (): string => "Hello, world!",
  },
};
