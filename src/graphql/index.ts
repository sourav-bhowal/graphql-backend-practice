import { ApolloServer } from "apollo-server-express";
import { userGraphQL } from "./user";

export async function graphqlServer() {
  const gqlServer = new ApolloServer({
    typeDefs: `
      type Query {
        ${userGraphQL.queries}
      }
      type Mutation {
        ${userGraphQL.mutations}
      }
    `,
    resolvers: {
      Query: {
        ...userGraphQL.resolvers.queries,
      },
      Mutation: {
        ...userGraphQL.resolvers.mutations,
      },
    },
  });

  await gqlServer.start();

  return gqlServer;
}
