import express from "express";
import bodyParser from "body-parser";
import { graphqlServer } from "./graphql";

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 4000;

  // Middleware to parse JSON bodies
  app.use(bodyParser.json());

  // Initialize GraphQL server
  const gqlServer = await graphqlServer();

  gqlServer.applyMiddleware({ app });

  app.listen(PORT, () => {
    console.log(
      `Server is running on http://localhost:${PORT}${gqlServer.graphqlPath}`
    );
  });
}

startServer();
