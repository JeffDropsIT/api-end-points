const Koa = require('koa');
const Router = require('koa-router');
const salon = require('./app/controllers/salons');
const stylist = require('./app/controllers/stylists')
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
router.get('/afroturf/salons/stylist/:salonId/:stylistId/q', async ctx =>{
    console.log("getStylistById -entry")
    ctx.body = await stylist.getStylistById(ctx);
});

// /afroturf/salons/stylist/global-q?location=-21.32565,23.54454&
//radius=10000&limit=10&gender=male&rating=4;
router.get('/afroturf/salons/stylist/global-q', async ctx =>{
    console.log("stylistQueries -entry")
    ctx.body = await stylist.stylistQueries(ctx);
});

// /afroturf/salons/stylist/local-q?location=-21.32565,23.54454&
//radius=10000&limit=10&gender=male&rating=4;
router.get('/afroturf/salons/:salonId/stylist/local-q', async ctx =>{
    console.log("Local -entry")
    ctx.body = await stylist.stylistQueriesLocal(ctx);
});


//filter 
// /afroturf/salons/stylist/filter/?location=-21.32565,23.54454&
//radius=10000&limit=10&gender=male&rating=4;
router.get('/afroturf/salons/stylist/filter/', async ctx =>{
    console.log("stylistsFilter -entry")
    ctx.body = await stylist.stylistQueries(ctx);
});


//returns all stylist reviews by id/username
router.get('afroturf/salons/stylist/reviews/id');
//returns all stylist by id/username
router.get('afroturf/salons/stylist/id')


app.use(router.routes())
    .use(router.allowedMethods());

app.listen(PORT);