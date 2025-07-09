import express from "express";
import { ApolloServer, gql } from "apollo-server-express";
import bodyParser from "body-parser";

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 4000;

  // Middleware to parse JSON bodies
  app.use(bodyParser.json());

  // Define your GraphQL schema and resolvers here
  const typeDefs = gql`
    type Query {
      hello: String
      sayHello(name: String!): String
    }
  `;

  const resolvers = {
    Query: {
      hello: () => "Hello, world!",
      sayHello: (_: any, { name }: { name: string }) => {
        return `Hello, ${name}!`;
      },
    },
  };

  const gqlServer = new ApolloServer({ typeDefs, resolvers });

  await gqlServer.start();

  gqlServer.applyMiddleware({ app });

  app.listen(PORT, () => {
    console.log(
      `Server is running on http://localhost:${PORT}${gqlServer.graphqlPath}`
    );
  });
}

startServer().catch((error) => {
  console.error("Error starting the gqlServer:", error);
});
