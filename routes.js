const Router = require('koa-router');
const Salon = require("./controller.js");
const Koa = require('koa');
const BodyParser = require('koa-bodyparser');
const logger = require('koa-logger');

let app = new Koa();

let baseUri = "https://devprestige.com/Afroturf/v1";
let router = new Router();
const mongodb = require('mongodb');
const assert = require('assert');


let mongoClient = mongodb.MongoClient;
let url = 'mongodb://admin:password123@ds153841.mlab.com:53841/afroturf';


const database = mongoClient.connect(url, {useNewUrlParser : true}).then(db => {return db.db("afroturf")});


router.get( "/salons/:name", async (ctx) => {
      
    // let salon = await Salon.getSalonByName(database, ctx.params.id, function (salon){
    //     return salon;

    //   });
      ctx.body = name;

});

app
    .use(logger())
    .use(BodyParser())
    .use(require('koa-body')())
    .use(router.allowedMethods())
    .use(router.routes())
 
app.listen(3000);