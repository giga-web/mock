console.log(process.env.NODE_ENV);

const Koa = require('koa');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
const routes = require('./routes/index');
const mongodbConnect = require('./utils/mongodb');

const app = new Koa();

mongodbConnect(app);

// error handler
onerror(app, {
  all: (err, ctx, next) => {
    ctx.status = 200;
    ctx.body = JSON.stringify({
      code: err.status,
      message: err.message,
    });
  },
});

// middlewares
app.use(logger());
app.use(
  bodyparser({
    enableTypes: ['json', 'form', 'text'],
  })
);

// routes
app.use(routes.routes(), routes.allowedMethods());

module.exports = app;
