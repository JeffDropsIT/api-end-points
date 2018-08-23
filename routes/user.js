const Router = require('koa-router');
const auth = require("../app/db/authentication");
const userOps = require("./app/db/user-operations");
const router = new Router();


//register
router.post('/afroturf/user/register'
, async ctx => {
    const username = ctx.request.body.username;
    const password = ctx.request.body.password;
    const fname = ctx.request.body.fname;
    const res = await userOps.createUser(fname, "", password, username, "", "");
    
    console.log(ctx.request.body.password);
    ctx.body = res === 200 ? "successfully added "+res : " something went wrong, username might already exist "+res ;
});

router.post('/afroturf/user/login'
, async ctx => {
    const username = ctx.request.body.username;
    const password = ctx.request.body.password;
    const res = await auth.authenticateUser(username, "", "", password);
    
    console.log(ctx.request.body.password);
    ctx.body = res === 200 ? "successfully added "+res : " something went wrong, incorrect username/password  "+res ;
});


