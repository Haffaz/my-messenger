import { type RootResolver, graphqlServer } from "@hono/graphql-server";
import { buildSchema } from "graphql";
import { Hono } from "hono";

const app = new Hono();

const schema = buildSchema(`
  type Query {
    hello: String!
  }
`);

const rootResolver: RootResolver = (_) => {
  return {
    hello: () => "Hello world!",
  };
};

app.use(
  "/graphql",
  graphqlServer({
    schema,
    rootResolver,
    graphiql: true,
  }),
);

const port = process.env.PORT || 3000;

console.log(`Hono 🥟 GraphQL Server Listening on port ${port}`);

export default {
  port,
  fetch: app.fetch,
};
