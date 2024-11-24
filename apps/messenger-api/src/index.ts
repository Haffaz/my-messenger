import express from 'express';

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import cors from 'cors';

import { PrismaClient } from '@prisma/client';
import { GraphQLError } from 'graphql';
import http from 'http';
import { resolvers } from './graphql/resolvers';
import { typeDefs } from './graphql/types';
import { Context } from './types/context';
import { getUser } from './utils/auth';

const app = express();

const prisma = new PrismaClient();

const httpServer = http.createServer(app);

const server = new ApolloServer<Context>({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

app.use(
  '/',
  cors<cors.CorsRequest>({ origin: ['http://localhost:5173'] }),
  express.json({ limit: '50mb' }),
  expressMiddleware(server, {
    context: async ({ req }): Promise<Context> => {   
      
      if (req.body?.operationName === 'Login') {
        return { prisma };
      }

      const token = req.headers.authorization || '';
      const user = await getUser(token, prisma);

      if (!user) {
        throw new GraphQLError('User is not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
            http: { status: 401 },
          },
        });
      }

      return { prisma, user };
    },
  })
);

await new Promise<void>(resolve => httpServer.listen({ port: 4000 }, resolve));
console.log(`🚀 Server ready at http://localhost:4000/`);

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Closing HTTP server and Prisma client...');
  await prisma.$disconnect();
  process.exit(0);
});
