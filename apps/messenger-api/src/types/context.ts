import { PrismaClient, User } from "@prisma/client";
import { PubSub } from "graphql-subscriptions";

export type UserInterface = Pick<User, "id" | "username">;

export type Context = {
  prisma: PrismaClient;
  user: UserInterface;
  pubsub: PubSub;
};
