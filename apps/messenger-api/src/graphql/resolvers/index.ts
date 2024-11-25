import { authResolvers } from "./auth.resolvers";
import { baseResolvers } from "./base.resolvers";
import { messageResolvers } from "./message.resolvers";
import { threadResolvers } from "./thread.resolvers";

export default [
  baseResolvers,
  authResolvers,
  messageResolvers,
  threadResolvers,
];
