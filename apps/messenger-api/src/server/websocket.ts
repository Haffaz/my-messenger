import { PrismaClient } from "@prisma/client";
import { GraphQLSchema } from "graphql";
import { PubSub } from "graphql-subscriptions";
import { useServer } from "graphql-ws/lib/use/ws";
import { Server } from "http";
import { WebSocketServer } from "ws";
import { createWsContext } from "../middleware/auth";

export const setupWebSocketServer = (
  httpServer: Server,
  schema: GraphQLSchema,
  prisma: PrismaClient,
  pubsub: PubSub,
) => {
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  });

  return useServer(
    {
      schema,
      context: async (ctx, _msg, _arg) => createWsContext(ctx, prisma, pubsub),
    },
    wsServer,
  );
};
