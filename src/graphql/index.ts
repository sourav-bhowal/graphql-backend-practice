import { ApolloServer } from "apollo-server-express";
import { userGraphQL } from "./user";
import { UserService } from "../services/user";

export async function graphqlServer() {
  const gqlServer = new ApolloServer({
    typeDefs: `
      ${userGraphQL.typeDefs}
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
    context: async ({ req }) => {
      const token = req.headers.authorization || "";
      try {
        const user = await UserService.decodeToken(token);
        return { user };
      } catch (error) {
        console.error("Error decoding token:", error);
        return {};
      }
    },
  });

  await gqlServer.start();

  return gqlServer;
}
