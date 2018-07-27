const Router = require('koa-router');


let baseUri = "https://devprestige.com/Afroturf/v1";
let router = new Router();

router.get(baseUri+"/salons", async function (ctx) {
    let name;
    let location;
    let radius;
    let limit; 

    
});

router.post("/user", async function (ctx) {
    let name = ctx.request.body.user || "rr";
   ctx.body = {message : `hello ${user}` } 
});
