const Koa = require('koa');
const mount = require('koa-mount');
const graphqlHTTP = require('koa-graphql');
const { buildSchema } = require('graphql');

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
  {
    id: 3,
    body: 'The Avengers',
    date: '20190101',
  },
];

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    hello: String
    todo(id: Int!): Todo
    todos: [Todo]
  }
  type Todo {
    id: Int
    body: String
    date: String
  }
`);

var getTodo = function(args) { 
  var id = args.id;
  return todos.filter(todo => {
      return todo.id == id;
  })[0];
}

const root = {
  hello: () => 'Hello world!',
  todo: getTodo,
  todos: () => todos,
};

const app = new Koa();
const route = '/graphql'

app.use(mount(route, graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true
})));

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${route}`)
);