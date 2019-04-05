const Koa = require('koa');
const { ApolloServer, gql } = require('apollo-server-koa');

const typeDefs = gql`
  type Query {
    hello: String
  }
`;