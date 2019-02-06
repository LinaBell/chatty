import { gql } from 'apollo-server'
export const typeDefs = gql`
  scalar Date

  type User {
    id: Int!
    email: String!
    username: String
    messages: [Message]
    groups: [Group]
    friends: [User]
  }

  type Group {
    id: Int!
    name: String
    users: [User]!
    messages: [Message]
  }

  type Message {
    id: Int!
    to: Group!
    from: User!
    text: String!
    createdAt: Date!
  }

  type Query {
    user(email: String, id: Int): User
    messages(groupId: Int, userId: Int): [Message]
    group(id: Int!): Group
    groups: [Group]!
  }
  schema {
    query: Query
  }
`
export default typeDefs