export const authTypeDefs = `#graphql
  type AuthPayload {
    token: String!
    user: User!
  }

  input LoginInput {
    username: String!
    password: String!
  }

  type Mutation {
    login(input: LoginInput!): AuthPayload!
  }
`; 