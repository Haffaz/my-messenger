import { expressMiddleware } from "@apollo/server/express4";
import { loadFilesSync } from "@graphql-tools/load-files";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import express from "express";
import http from "http";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

import resolvers from "./graphql/resolvers";
import { createHttpContext } from "./middleware/auth";
import { createApolloServer } from "./server/apollo";
import { setupWebSocketServer } from "./server/websocket";

const PORT = 4000;
const CORS_ORIGINS = ["http://localhost:5173"];

const app = express();
const httpServer = http.createServer(app);
const prisma = new PrismaClient();

const typeDefs = loadFilesSync(
  path.join(
    dirname(fileURLToPath(import.meta.url)),
    "./graphql/schema.graphql",
  ),
);
const schema = makeExecutableSchema({ typeDefs, resolvers });

async function initializeServer() {
  const wsServerCleanup = setupWebSocketServer(httpServer, schema, prisma);
  const apolloServer = createApolloServer(httpServer, schema, wsServerCleanup);
  await apolloServer.start();

  app.use(
    "/",
    cors<cors.CorsRequest>({ origin: CORS_ORIGINS }),
    express.json({ limit: "50mb" }),
    expressMiddleware(apolloServer, {
      context: async ({ req }) => createHttpContext(req, prisma),
    }),
  );

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: PORT }, resolve),
  );
  console.log(`🚀 Server ready at http://localhost:${PORT}/`);
}

function setupGracefulShutdown() {
  process.on("SIGTERM", async () => {
    console.log("SIGTERM received. Closing HTTP server and Prisma client...");
    await prisma.$disconnect();
    process.exit(0);
  });
}

async function bootstrap() {
  try {
    await initializeServer();
    setupGracefulShutdown();
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

bootstrap();
