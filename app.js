const logger = require('koa-logger');
const serve = require('koa-static');
const koaBody = require('koa-body');
const Koa = require('koa');
const fs = require('fs');
const app = new Koa();
//const os = require('os');
const path = require('path');
//const multer = require('koa-multer');
//const s3fs = require("s3fs");
const Router = require("koa-router");
//const s3 = require("./s3");
const userOps = require("./app/db/user-operations");
const salonOps = require("./app/db/salon-operations");
const stylistOps = require("./app/db/stylist-operations");
const auth = require("./app/db/authentication");
const uploads = require("./app/controllers/uploads");
const quickSearch = require("./app/db/quickSearch")
//--start--controllers

const salon = require('./app/controllers/salons');
const stylist = require('./app/controllers/stylists');
const service = require('./app/controllers/services')

//--end--
const router = new Router();

// log requests

app.use(logger());
app.use(koaBody({ multipart: true, formLimit: 2000 * 1024}));

// custom 404

router.get("/", async function(ctx, next) {
  await next();
  if (ctx.body || !ctx.idempotent) return;
  ctx.redirect('/404.html');
});

// serve files from ./public


//register
router.post('/afroturf/user/register', userOps.createUser);
//login
router.post('/afroturf/user/login', auth.authenticateUser);
//getsalon data
router.post('/afroturf/user/', auth.getAllUserData);
//edit a user
router.post('/afroturf/user/edit/profile',userOps.updateUser);
//create salon /afroturf/user/profile/create/salon
router.post('/afroturf/user/profile/create/salon', salonOps.createSalon);
//edit salon details /afroturf/user/profile/edit/salon/dashboard
router.post('/afroturf/user/profile/edit/salon/dashboard',salonOps.updateSalonContent);
//favourite salon /afroturf/user/profile/salon/id/favorite
router.post('/afroturf/user/profile/salon/:id/follow', userOps.followSalon);
//write review /afroturf/user/profile/salon/id/favorite
router.post('/afroturf/user/profile/salon/:id/review',userOps.sendReview);
//write message /afroturf/user/profile/messages/room'
router.post('/afroturf/user/profile/messages/room',userOps.sendMessage);
//apply to a salon as stylist api/afroturf/user/apply/salon
router.post('/afroturf/user/profile/salon/apply',stylistOps.applyAsStylist);
//respond to application api/afroturf/user/profile/applications/status
router.post('/afroturf/user/profile/salon/dashboard/applications/status',salonOps.acceptStylistRequest);
//book a salon /afroturf/user/profile/bookings/salon/id (geneic booking)
router.post('/afroturf/user/profile/salon/service/bookings',salonOps.addtosalonOrders);
//book a stylist api/afroturf/user/book/service/salon/stylist  (specific booking)
router.post('/afroturf/user/profile/salon/service/stylist/bookings',salonOps.addtostylistOrders);
//respond to booking api/afroturf/salon/salon/dashboard/bookings/status
router.post('/afroturf/user/profile/salon/dashboard/bookings/status',salonOps.acceptOrder);
//get available time slots /afroturf/user/profile/salon/bookings/available
router.get('/afroturf/user/profile/salon/bookings/unavailable',salonOps.getBookedTimeSlotForSalon);
//get available orders after /afroturf/user/profile/salon/bookings/available
router.get('/afroturf/user/profile/salon/bookings/stylist/unavailable',salonOps.getBookedTimeSlotForStylist);
//get available orders after /afroturf/user/profile/salon/bookings/available
router.get('/afroturf/user/profile/salon/bookings/stylist/duration/unavailable-btwn',salonOps.getStylistOrdersByDateBetween);
//get available orders after /afroturf/user/profile/salon/bookings/available
router.get('/afroturf/user/profile/salon/bookings/duration/unavailable-btwn',salonOps.getSalonOrdersByDateBetween);
//get available orders after /afroturf/user/profile/salon/bookings/available
router.get('/afroturf/user/profile/salon/bookings/stylist/duration/unavailable-b', salonOps.getStylistOrdersByDateBefore);
//get available orders after /afroturf/user/profile/salon/bookings/available
router.get('/afroturf/user/profile/salon/bookings/duration/unavailable-b',salonOps.getSalonOrdersByDateBefore);
//get available orders after /afroturf/user/profile/salon/bookings/available
router.get('/afroturf/user/profile/salon/bookings/:orderNumber',salonOps.getOrderByOrderNumber);
//get bookings doc /afroturf/user/profile/salon/bookings/available
router.get('/afroturf/user/profile/salon/bookings',salonOps.getSalonOrdersDoc);
//crud salon content
//add subservice To Salon Services /afroturf/user/profile/edit/salon/dashboard
router.put('/afroturf/user/profile/edit/salon/dashboard/subservices',salonOps.addsubserviceToSalonServices);
//add service To Salon Services /afroturf/user/profile/edit/salon/dashboard
router.put('/afroturf/user/profile/edit/salon/dashboard/services',salonOps.addServicesToSalon);
//add service avatar To a Salon service  /afroturf/user/profile/edit/salon/dashboard
router.put('/afroturf/user/profile/edit/salon/dashboard/services/avatar',salonOps.addServiceAvatar);
//update service name for a salon /afroturf/user/profile/edit/salon/dashboard
router.patch('/afroturf/user/profile/edit/salon/dashboard/services',salonOps.updateServiceName);
//update service name for a salon /afroturf/user/profile/edit/salon/dashboard
router.patch('/afroturf/user/profile/edit/salon/dashboard/subservices',salonOps.updateSubservice);
//--controller routes start--
// /afroturf/salons/?location=23.123,21.3434
//&radius=1000&limit=10
router.get('/afroturf/salons/',salon.getNearestSalons);
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
router.get('/afroturf/salons/stylist/filter/',stylist.stylistQueries);
//services filter 
///afroturf/salons/:salonId/services/local-q?location=23.123,21.3434
//&radius=700000&price_lte=50&service=hairstyles&price_gte=10&code=F567B&type=Locks
router.get('/afroturf/salons/:salonId/services/local-q',service.servicesFilterLocal);
///afroturf/salons/services/global-q?location=23.123,21.3434
//&radius=700000&price_lte=50&service=hairstyles&price_gte=10&code=F567B&type=Locks
router.get('/afroturf/salons/services/global-q', service.servicesFilterGlobal);
//--end--
//upload salon avatar
router.post("/avatar/salon",uploads.uploadSalonAvatar)
// handle uploads
router.post("/gallery/stylist",uploads.uploadToStylistGallary);
router.post("/avatar/user",uploads.uploadToUserAvatar);
router.post("/gallery",uploads.uploadToSalonGallary);


router.get("/afroturf/search/shallow-q", quickSearch.generalQuickSearch);
app.use(serve(path.join(__dirname, '/public')));
app.use(router.routes());
app.use(router.allowedMethods());
app.listen(3000);
console.log('listening on port 3000');