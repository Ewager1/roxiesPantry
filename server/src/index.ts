import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

import { typeDefs, resolvers } from "./graphql/schema.js";

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const port = Number(process.env.PORT ?? 4000);

const { url } = await startStandaloneServer(server, {
  listen: {
    port,
  },
});

console.log(`Server running at ${url}`);
