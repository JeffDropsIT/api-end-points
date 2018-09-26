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
router.post('/afroturf/user/register',userOps.createUser);
//login
router.post('/afroturf/user/login',auth.authenticateUser);
//getsalon data
router.post('/afroturf/user/',auth.getAllUserData);
//edit a user
router.post('/afroturf/user/edit/profile',userOps.updateUser);
//create salon /afroturf/user/profile/create/salon
router.post('/afroturf/user/profile/create/salon',salonOps.createSalon);
//edit salon details /afroturf/user/profile/edit/salon/dashboard
router.post('/afroturf/user/profile/edit/salon/dashboard',salonOps.updateSalonContent); //notity all devices
//favourite salon /afroturf/user/profile/salon/id/favorite
router.post('/afroturf/user/profile/salon/:id/follow', userOps.followSalon); //tell owner 
//write review /afroturf/user/profile/salon/id/favorite
router.post('/afroturf/user/profile/salon/:id/review',userOps.sendReview); //tell all followers and update all devices
//write message /afroturf/user/profile/messages/room'
router.post('/afroturf/user/profile/messages/room',userOps.sendMessage); //tell owner
//apply to a salon as stylist api/afroturf/user/apply/salon
router.post('/afroturf/user/profile/salon/apply',stylistOps.applyAsStylist);  //tell owner
//respond to application api/afroturf/user/profile/applications/status
router.post('/afroturf/user/profile/salon/dashboard/applications/status',salonOps.acceptStylistRequest); //tell stylist
//book a salon /afroturf/user/profile/bookings/salon/id (geneic booking)
router.post('/afroturf/user/profile/salon/service/bookings',salonOps.addtosalonOrders); //tell stylist and salon
//book a stylist api/afroturf/user/book/service/salon/stylist  (specific booking)
router.post('/afroturf/user/profile/salon/service/stylist/bookings',salonOps.addtostylistOrders);  //tell stylist
//respond to booking api/afroturf/salon/salon/dashboard/bookings/status
router.post('/afroturf/user/profile/salon/dashboard/bookings/status',salonOps.acceptOrder); //tell booker
//get available time slots /afroturf/user/profile/salon/bookings/available
router.get('/afroturf/user/profile/salon/bookings/unavailable',salonOps.getBookedTimeSlotForSalon);
//get available orders after /afroturf/user/profile/salon/bookings/available
router.get('/afroturf/user/profile/salon/bookings/stylist/unavailable',salonOps.getBookedTimeSlotForStylist);
//get available orders after /afroturf/user/profile/salon/bookings/available
router.get('/afroturf/user/profile/salon/bookings/stylist/duration/unavailable-btwn',salonOps.getStylistOrdersByDateBetween);
//get available orders after /afroturf/user/profile/salon/bookings/available
router.get('/afroturf/user/profile/salon/bookings/duration/unavailable-btwn',salonOps.getSalonOrdersByDateBetween);
//get available orders after /afroturf/user/profile/salon/bookings/available
router.get('/afroturf/user/profile/salon/bookings/stylist/duration/unavailable-b',salonOps.getStylistOrdersByDateBefore);
//get available orders after /afroturf/user/profile/salon/bookings/available
router.get('/afroturf/user/profile/salon/bookings/duration/unavailable-b',salonOps.getSalonOrdersByDateBefore);
//get available orders after /afroturf/user/profile/salon/bookings/available
router.get('/afroturf/user/profile/salon/bookings/:orderNumber',salonOps.getOrderByOrderNumber);
//get bookings doc /afroturf/user/profile/salon/bookings/available
router.get('/afroturf/user/profile/salon/bookings',salonOps.getSalonOrdersDoc);
//crud salon content
//add subservice To Salon Services /afroturf/user/profile/edit/salon/dashboard
router.put('/afroturf/user/profile/edit/salon/dashboard/subservices',salonOps.addsubserviceToSalonServices); //tell all devices that data changed and follwers
//add service To Salon Services /afroturf/user/profile/edit/salon/dashboard
router.put('/afroturf/user/profile/edit/salon/dashboard/services',salonOps.addServicesToSalon); //tell all devices that data changed and follwers
//add service avatar To a Salon service  /afroturf/user/profile/edit/salon/dashboard
//update service name for a salon /afroturf/user/profile/edit/salon/dashboard
router.patch('/afroturf/user/profile/edit/salon/dashboard/services',salonOps.updateServiceName); //tell all devices that data changed
//update service name for a salon /afroturf/user/profile/edit/salon/dashboard
router.patch('/afroturf/user/profile/edit/salon/dashboard/subservices',salonOps.updateSubservice); //tell all devices that data changed




//--controller routes start--
// /afroturf/salons/?location=23.123,21.3434
//&radius=1000&limit=10
router.get('/afroturf/salons/',salon.getNearestSalons);
router.get('/afroturf/salons/-a',salon.getAllSalons);
router.get("/afroturf/salons/:salonId",salon.getSalonBySalonId);
router.get("/afroturf/user/salons/obj/",salon.getSalonBySalonObj)


//--end--
//upload salon avatar
router.post("/afroturf/avatar/salon",uploads.uploadSalonAvatar); //tested || tell owner
// handle uploads
router.post("/afroturf/gallery/stylist",uploads.uploadToStylistGallary); //tested || tell followers && stylist
router.put('/afroturf/avatar/subservice',uploads.addSubserviceAvatar); //tell followers and return data
router.post("/afroturf/avatar/user",uploads.uploadToUserAvatar); // tested
router.post("/afroturf/gallery/salon",uploads.uploadToSalonGallary); //tested || tell followers
router.get('/afroturf/search/global-q',quickSearch.generalQuickSearch);





//reviews
router.get("/afroturf/reviews", salon.getReviews);

//room
router.get("/afroturf/rooms", salon.getRoom);

//services
router.get("/afroturf/service/-a", service.getAllServices);
///afroturf/filter/:salonId/services-a
router.get("/afroturf/:salonId/service/-a", service.getAllServicesInSalonId);
// /afroturf/filter/:salonId/services 
router.get("/afroturf/filter/:salonId/services/name", service.getServicesByNameSalonId)
//4a.
// /afroturf/filter/services?query={"code":"ASS1"} //returns all services
router.get("/afroturf/filter/services/code", service.getServicesCode);
// /afroturf/filter/services? 
router.get("/afroturf/filter/services/price", service.getServicesPriceRange);
// /afroturf/filter/:salonId/services/price
router.get("/afroturf/filter/:salonId/services/price", service.getServicesPriceRangeSalonId);
//2a.
// /afroturf/filter/services?query={"serviceType": "fade", "price":[0,100]} //returns services which match query
router.get("/afroturf/filter/services/price-type", service.getServicesByTypePriceRange);
//2b.
// /afroturf/filter/:salonId/services?query={"serviceType": "fade", "price":[0,100]} //returns services which match query
router.get("/afroturf/filter/:salonId/services/price-type", service.getServicesByTypePriceRangeSalonId); //failed
// /afroturf/filter/services?query={serviceName:name}
router.get("/afroturf/filter/services/name", service.getServicesByName);





// stylists
router.get("/afroturf/stylist/-a",stylist.getAllStylist);

// /afroturf/user/:salonId/:stylistId
router.get("/afroturf/user/:salonId/:stylistId",stylist.getStylistByIdSalonId);
// /afroturf/filter/:salonId/stylist?query={"rating":[0, 5], "gender":"male", "name":"t"} //returns all services

router.get("/afroturf/filter/:salonId/stylist",stylist.getSalonByStylistNameRatingGenderAndSalonId);


app.use(serve(path.join(__dirname, '/public')));
app.use(router.routes());
app.use(router.allowedMethods());
app.listen(9000);
console.log('listening on port 9000');