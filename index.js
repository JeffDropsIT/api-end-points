const Koa = require('koa');
const Router = require('koa-router');
const salonClient = require('./app/db/databaseClient');
const task = require('./app/controllers/task');
const salon = require('./app/controllers/salons')
const PORT = process.env.PORT || 5000;

const app = new Koa();
const router = new Router();

// /afroturf/salons/?location=23.123,21.3434
//&radius=1000&limit=10
router.get('/afroturf/salons/'
, async ctx => {
    console.log("getNearestSalons");
    ctx.body = await salon.getNearestSalons(ctx);
});
router.get('/afroturf/salons/-a', async ctx => {
    console.log("getAllSalons");
    ctx.body = await salon.getAllSalons(ctx);
})

// /afroturf/salons/q?location=-73.99842,40.719544
//&radius=10000&limit=10&name=HeartBeauty
router.get('/afroturf/salons/q'
, async ctx =>{
    
   ctx.body = await salon.getSalonByName(ctx);
   
} );


// /afroturf/salons/shallow/?location=23.123,21.3434
//&radius=10000

router.get('/afroturf/salons/shallow/'
, async ctx => {
    
   ctx.body = await salon.getAllNearestSalonsShallow(ctx);
});



// /afroturf/salons/shallow/q?location=23.123,21.3434
//&radius=100000&limit=10&name=HeartBeauty
router.get('/afroturf/salons/shallow/q'
, async ctx => {
    console.log("getSalonByNameShallow sdsd")
    ctx.body = await salon.getSalonByNameShallow(ctx);
});

// /afroturf/salons/shallow/:salonId/?location=23.123,21.3434
//&radius=100000

router.get('/afroturf/salons/shallow/:salonId/'
, async ctx => {
    console.log("getSalonByNameShallow ssedvvdsd")
    console.log("getSalonBySalonId")
    ctx.body = await salon.getSalonBySalonIdShallow(ctx);
});
// /afroturf/salons/:salonId/?location=23.123,21.3434
//&radius=10000
router.get('/afroturf/salons/:salonId/'
,async ctx => {
    console.log("getSalonByNameShallow sdsd")
    console.log("getSalonBySalonId")
    ctx.body = await salon.getSalonBySalonId(ctx);
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