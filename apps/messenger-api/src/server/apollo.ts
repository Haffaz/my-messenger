import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { GraphQLSchema } from "graphql";
import { type Disposable } from "graphql-ws";
import { Server } from "http";
import { Context } from "../types/context";

export const createApolloServer = (
  httpServer: Server,
  schema: GraphQLSchema,
  wsServerCleanup: Disposable,
) => {
  return new ApolloServer<Context>({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await wsServerCleanup.dispose();
            },
          };
        },
      },
    ],
  });
};
