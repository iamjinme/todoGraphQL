const Koa = require('koa');
const { ApolloServer, gql } = require('apollo-server-koa');

const todos = [
  {
    id: 1,
    body: 'Harry Potter and the Chamber of Secrets',
    date: '20190401',
  },
  {
    id: 2,
    body: 'Jurassic Park',
    date: '20190331',
  },
];

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    hello: String
    todos: [Todo]
  }
  type Todo {
    id: Int
    body: String
    date: String
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: () => 'Hello world!',
    todos: () => todos,
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

const app = new Koa();
server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);