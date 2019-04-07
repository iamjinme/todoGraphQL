const Koa = require('koa');
const mount = require('koa-mount');
const render = require('koa-ejs');
const path = require('path');
const graphqlHTTP = require('koa-graphql');
const { buildSchema } = require('graphql');

// Creating todos examples
const todos = [];
todos[1] = 'buy beers';
todos[2] = 'make todo app';
let counter = todos.length;
// Creating completed todos example
const completed = ["finish day"];

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
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

// Function to get todo by id
const getTodo = ({ id }) => { 
  return todos.filter(todo => {
      return todo.id == id;
  })[0];
}

// Provide functions for your schema fields
const root = {
  hello: () => 'Hello world!',
  todo: getTodo,
  todos: () => todos,
};

// Create koa server
const app = new Koa();
// Body parser
const bodyParser = require('koa-bodyparser');
// Load middleware to parser body
app.use(bodyParser());
// Add render ejs middleware
render(app, {
  root: path.join(__dirname, 'views'),
  layout: false,
  viewExt: 'html',
  cache: false,
  debug: false
});

// GET index
app.use(mount('/todo', async (ctx) => {
  await ctx.render('index', { todos, completed });
}));

// POST addtask
app.use(mount('/addtask', async (ctx) => {
  const { todo } = ctx.request.body;
  if (todo !== '') {
    todos[counter] = todo;
    counter++;
  }
  ctx.redirect('/todo')
}));

// POST removetask
app.use(mount('/removetask', async (ctx) => {
  const { check } = ctx.request.body;
  if (check) {
    for (let value of check) {
      value = parseInt(value);
      completed.push(todos[value]);
      delete todos[value];
    }
  }
  ctx.redirect('/todo')
}));

// Mount GraphQL endpoint
const route = '/graphql'
app.use(mount(route, graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true
})));

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${route}`)
);