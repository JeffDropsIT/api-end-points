const Koa = require('koa');
const Router = require('koa-router');
const salon = require('./app/controllers/salons');
const stylist = require('./app/controllers/stylists');
const service = require('./app/controllers/services')
const PORT = process.env.PORT || 3000;

const app = new Koa();
const router = new Router();

// /afroturf/salons/?location=23.123,21.3434
//&radius=1000&limit=10
router.get('/afroturf/salons/',salon.getNearestSalons();
router.get('/afroturf/salons/-a',salon.getAllSalons)
// /afroturf/salons/q?location=-73.99842,40.719544
//&radius=10000&limit=10&name=HeartBeauty
//or
// /afroturf/salons/q?location=-73.99842,40.719544
//&radius=10000&limit=10&rating=4
router.get('/afroturf/salons/q',salon.getSalonByNameOrRating);
// /afroturf/salons/shallow/?location=23.123,21.3434
//&radius=10000
router.get('/afroturf/salons/shallow/',salon.getAllNearestSalonsShallow);
// /afroturf/salons/shallow/q?location=23.123,21.3434
//&radius=100000&limit=10&name=HeartBeauty
router.get('/afroturf/salons/shallow/q',salon.getSalonByNameShallow);
// /afroturf/salons/shallow/:salonId/?location=23.123,21.3434
//&radius=100000
router.get('/afroturf/salons/shallow/:salonId/',salon.getSalonBySalonIdShallow);
// /afroturf/salons/:salonId/?location=23.123,21.3434
//&radius=10000
router.get('/afroturf/salons/:salonId/',salon.getSalonBySalonId);
//returns all salon reviews by id/salonId
router.get('/afroturf/salons/stylist/:salonId/:stylistId/q',stylist.getStylistById);
// /afroturf/salons/stylist/global-q?location=-21.32565,23.54454&
//radius=10000&limit=10&gender=male&rating=4;
router.get('/afroturf/salons/stylist/global-q',stylist.stylistQueries);
// /afroturf/salons/:salonId/stylist/local-q?location=-21.32565,23.54454&
//radius=10000&limit=10&gender=male&rating=4;
router.get('/afroturf/salons/:salonId/stylist/local-q',stylist.stylistQueriesLocal);
//filter 
// /afroturf/salons/stylist/filter/?location=-21.32565,23.54454&
//radius=10000&limit=10&gender=male&rating=4;
router.get('/afroturf/salons/stylist/filter/',stylist.stylistQueries;
//services filter 
///afroturf/salons/:salonId/services/local-q?location=23.123,21.3434
//&radius=700000&price_lte=50&service=hairstyles&price_gte=10&code=F567B&type=Locks
router.get('/afroturf/salons/:salonId/services/local-q',service.servicesFilterLocal);
///afroturf/salons/services/global-q?location=23.123,21.3434
//&radius=700000&price_lte=50&service=hairstyles&price_gte=10&code=F567B&type=Locks
router.get('/afroturf/salons/services/global-q', service.servicesFilterGlobal);

app.use(router.routes())
    .use(router.allowedMethods());

app.listen(PORT);