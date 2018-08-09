const Koa = require('koa');
const Router = require('koa-router');
const salonClient = require('./databaseClient');
const task = require('./task');
const salon = require('./app/controllers/salons')
const PORT = process.env.PORT || 5000;

const app = new Koa();
const router = new Router();

// /afroturf/salons/?location=23.123,21.3434
//&radius=10&limit=10
router.get('/afroturf/salons/'
, salon.getNearestSalons(ctx));

// /afroturf/salons/:salonId/?location=23.123,21.3434
//&radius=10
router.get('/afroturf/salons/:salonId/'
, salon.getSalonBySalonId(ctx));

// /afroturf/salons/q?location=23.123,21.3434
//&radius=10&limit=10&name=HeartBeauty
router.get('/afroturf/salons/q/'
, salon.getSalonByName(ctx) );


// /afroturf/salons/shallow/:salonId/?location=23.123,21.3434
//&radius=10

router.get('/afroturf/salons/shallow/:salonId/'
, salon.getSalonBySalonIdShallow(ctx));

// /afroturf/salons/shallow/?location=23.123,21.3434
//&radius=10

router.get('/afroturf/salons/shallow/'
, salon.getAllNearestSalonsShallow(ctx));



// /afroturf/salons/shallow/q?location=23.123,21.3434
//&radius=10&limit=10&name=HeartBeauty
router.get('/afroturf/salons/shallow/q'
, salon.getSalonByNameShallow(ctx));



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
        ctx.body = await salonClient.getSalonByStylistNameRatingGender(userLocation, radius, name, limit, rating, gender);
    }else if(location !== undefined && radius !== undefined
        && limit !== undefined && gender !== undefined && rating !== undefined){
        const userLocation = await task.toLocationObject(location);
        ctx.body = await salonClient.getSalonByStylistRatingGender(userLocation, radius, limit, rating, gender);
    }else if(location !== undefined && radius !== undefined
        && limit !== undefined && rating !== undefined){
            const userLocation = await task.toLocationObject(location);
            ctx.body = await salonClient.getSalonByStylistRating(userLocation, radius, limit, rating);
        }
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