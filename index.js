const Koa = require('koa');
const Router = require('koa-router');
const controller = require('./controller');
const task = require('./task');
const PORT = process.env.PORT || 5000;

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
        ctx.body = await controller.getSalonByNameShallow(name, userLocation, radius,limit);
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
router.get('/afroturf/salons/services/', async (ctx)=> {
    const location = await ctx.query.location;
    const radius = await ctx.query.radius;
    const serviceName = await ctx.query.name;
    const servicetype = await ctx.query.type;
    const salonId = await ctx.query.salonId;
    const code = await ctx.query.code
    if(location !== undefined && serviceName !== undefined 
    && radius !== undefined && servicetype !== undefined && salonId !== undefined){
        const userLocation = await task.toLocationObject(location);
        //get services by name and type for a salonid
    }else if(location !== undefined && serviceName !== undefined 
        && radius !== undefined && servicetype !== undefined){
            const userLocation = await task.toLocationObject(location);
            //get all nearest services by name and type 
    }
    else if(location !== undefined && serviceName !== undefined 
        && radius !== undefined){
            const userLocation = await task.toLocationObject(location);
            //get all nearest services by name 
    }
    else if(location !== undefined && serviceName !== undefined 
        && radius !== undefined && code !== undefined){
            const userLocation = await task.toLocationObject(location);
            //get all nearest services by name and code
    }
    
    else if(location !== undefined && serviceName !== undefined 
        && radius !== undefined && price !== undefined){
            const userLocation = await task.toLocationObject(location);
            //get all nearest services by name and price range 
    }
    else if(location !== undefined && radius !== undefined && code !== undefined){
        const userLocation = await task.toLocationObject(location);
        //get all nearest services by code
    }
    else if(location !== undefined && radius !== undefined && servicetype !== undefined){
        const userLocation = await task.toLocationObject(location);
        //get all nearest services by type
    }

    //also create a filter for services



});

//returns all salon reviews by id/salonId
router.get('afroturf/salons/reviews/id');
//returns all stylist reviews by id/username
router.get('afroturf/salons/stylist/reviews/id');
//returns all stylist by id/username
router.get('afroturf/salons/stylist/id')
app.use(router.routes())
    .use(router.allowedMethods());

app.listen(PORT);