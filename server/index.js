import { ApolloServer } from 'apollo-server'
import { typeDefs } from './data/schema'
import { resolvers } from './data/resolvers'
import { mocks } from './data/mocks'

const PORT = 8080
const server = new ApolloServer({
  resolvers,
  typeDefs,
  mocks,
})
server.listen({ port: PORT }).then(({ url }) => console.log(`🚀 Server ready at ${url}`))