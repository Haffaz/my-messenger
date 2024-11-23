import express from 'express';
import { GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql';
import { createHandler } from 'graphql-http/lib/use/express';

// Define a basic GraphQL schema
const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      hello: {
        type: GraphQLString,
        resolve: () => 'Hello, World!'
      }
    }
  })
});

// Create Express app
const app = express();
const PORT = 4000;

// GraphQL endpoint
app.use('/graphql', createHandler({ schema }));

// Optional: Add a basic REST endpoint
app.get('/', (_, res) => {
  res.send('Welcome to GraphQL Server! Try /graphql endpoint');
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📊 GraphQL endpoint: http://localhost:${PORT}/graphql`);
});
