const Koa = require('koa');
const Router = require('koa-router');
const controller = require('./controller');
const task = require('./task');

const app = new Koa();
const router = new Router();



router.get('/afroturf/salons/', async (ctx) =>{
    const location = await ctx.query.location;
    const radius = await ctx.query.radius;
    const name = await ctx.query.name;
    const limit = await ctx.query.limit;
    if(location !== undefined && name !== undefined &&radius !== undefined && limit !== undefined ){
        const userLocation = await task.toLocationObject(location);
        ctx.body = await controller.getSalonByName(name, userLocation, radius,limit);
    }else if(location !== undefined && radius !== undefined && limit !== undefined ){
        const userLocation = await task.toLocationObject(location);
        ctx.body = await controller.getNearestSalons(userLocation, radius,limit);
    }

});
router.get('/afroturf/salons/shallow', async (ctx) =>{
    const location = await ctx.query.location;
    const radius = await ctx.query.radius;
    const name = await ctx.query.name;
    const limit = await ctx.query.limit;
    if(location !== undefined && name !== undefined &&radius !== undefined && limit !== undefined ){
        const userLocation = await task.toLocationObject(location);
        ctx.body = await controller.getSalonByName(name, userLocation, radius,limit);
    }else if(location !== undefined && radius !== undefined && limit !== undefined ){
        const userLocation = await task.toLocationObject(location);
        ctx.body = await controller.getAllNearestSalonsShallow(userLocation, radius,limit);
    }else{
        ctx.body = "request bad magic";
    }
});
router.get('/afroturf/salons/stylist/filter', async (ctx) => {
    const location = await ctx.query.location;
    const radius = await ctx.query.radius;
    const name = await ctx.query.name;
    const rating = await ctx.query.rating;
    const gender = await ctx.query.gender
    const limit = await ctx.query.limit;
    if(location !== undefined && name !== undefined && radius !== undefined
        && limit !== undefined && gender !== undefined && rating !== undefined){
        const userLocation = await task.toLocationObject(location);
        ctx.body = await controller.getSalonByStylistNameRatingGender(userLocation, radius, name, limit, rating, gender);
    }else if(location !== undefined && radius !== undefined
        && limit !== undefined && gender !== undefined && rating !== undefined){
        const userLocation = await task.toLocationObject(location);
        ctx.body = await controller.getSalonByStylistRatingGender(userLocation, radius, limit, rating, gender);
    }else if(location !== undefined && radius !== undefined
        && limit !== undefined && rating !== undefined){
            const userLocation = await task.toLocationObject(location);
            ctx.body = await controller.getSalonByStylistRating(userLocation, radius, limit, rating);
        }
});


app.use(router.routes())
    .use(router.allowedMethods());

app.listen(3000);