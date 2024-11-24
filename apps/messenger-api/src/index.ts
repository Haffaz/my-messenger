import { makeExecutableSchema } from '@graphql-tools/schema';
import { PrismaClient } from '@prisma/client';
import express from 'express';
import { createHandler } from 'graphql-http/lib/use/express';

import cors from 'cors';
import { resolvers } from './graphql/resolvers';
import { typeDefs } from './graphql/types';
import { Context } from './types/context';

const prisma = new PrismaClient();

// Create executable schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

// Create Express app
const app = express();
const PORT = process.env.PORT || 4000;

// Add JSON parsing middleware
app.use(express.json());


// GraphQL endpoint
app.use(
  '/graphql',
  // TODO: Remove this before deploying
  cors<cors.CorsRequest>({ origin: ['http://localhost:5173'] }),
  createHandler({
    schema,
    context: (): Context => ({
      prisma,
    }),
  })
);

// Health check endpoint
app.get('/health', (_, res) => {
  res.json({ status: 'ok' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📊 GraphQL endpoint: http://localhost:${PORT}/graphql`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Closing HTTP server and Prisma client...');
  await prisma.$disconnect();
  process.exit(0);
});
