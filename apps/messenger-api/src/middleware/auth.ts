import { type PrismaClient } from "@prisma/client";
import { type Request } from "express";
import { GraphQLError } from "graphql";
import { PubSub } from "graphql-subscriptions";
import { type Context as WsContext } from "graphql-ws";
import { Context } from "../types/context";
import { getUser } from "../utils/auth";

export const createHttpContext = async (
  req: Request,
  prisma: PrismaClient,
  pubsub: PubSub,
): Promise<Context> => {
  if (req.body.operationName === "Login") {
    return { prisma, user: null, pubsub: null };
  }

  const token = req.headers.authorization || "";
  const user = await getUser(token, prisma);

  if (!user) {
    throw new GraphQLError("User is not authenticated", {
      extensions: {
        code: "UNAUTHENTICATED",
        http: { status: 401 },
      },
    });
  }

  return { prisma, user, pubsub };
};

export const createWsContext = async (
  ctx: WsContext,
  prisma: PrismaClient,
  pubsub: PubSub,
): Promise<Context> => {
  const token = ctx.connectionParams?.authorization as string;
  const user = await getUser(token, prisma);

  if (!user) {
    throw new GraphQLError("User is not authenticated", {
      extensions: {
        code: "UNAUTHENTICATED",
        http: { status: 401 },
      },
    });
  }

  return { prisma, user, pubsub };
};
