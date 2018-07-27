const Koa = require('koa');
const Router = require('koa-router');
const BodyParser = require('koa-bodyparser');
const logger = require('koa-logger');

let app = new Koa();


app
    .use(logger())
    .use(BodyParser())
    .use(require('koa-body')())
    .use(router.allowedMethods())
    .use(router.routes())
 
app.listen(3000);