// This file contains GraphQL queries related to user authentication.
export const queries = `#graphql
   loginUser(
    email: String!
    password: String!
   ): String
`;
