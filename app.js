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
const awsHandler = require('./aws/aws-handler');
const uuid = require("uuid");
const admin = require("./app/db/admin")
const userOps = require("./app/db/user-operations");
const salonOps = require("./app/db/salon-operations");
const stylistOps = require("./app/db/stylist-operations");
const auth = require("./app/db/authentication");
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













// router.post("/avatar/salon", async function(ctx) {
//   // ignore non-POSTs
//   //   if ('POST' != ctx.method) return await next();
  

//   const file = ctx.request.files.file;
//   console.log(" Tot: "+file.length)
//   if(file.length !== undefined){
//     for (let i = 0 ; i < file.length; i++){
//       const pathF = file[i].path;
//       const reader = await fs.createReadStream(pathF);
//       console.log("file[i].path) "+file[i].path+ " ");
//       const key = await uuid.v4()+"name="+file[i].name.replace(" ", "");
//       //awsHandler.uploadFile(key, "123bucket-err-2/testDir", pathF);
//       admin.addToSalonAvatar("5b7d240bb22b4e2390677e3c", key, pathF);
//       const stream = await fs.createWriteStream(path.join(__dirname+"/uploads/profiles", Math.random().toString() + "."+file[i].name.split(".")[1]));
//       reader.pipe(stream);
      
//     }
//   }else{
//     const pathF = file.path;
//     const reader = await fs.createReadStream(pathF);
//     console.log("file[i].path) "+file.path+ " ");
//     const key = await uuid.v4()+"name="+file.name.replace(" ", "");
//     //awsHandler.uploadFile(key, "123bucket-err-2/testDir", pathF);
//     admin.addToSalonAvatar("5b7d240bb22b4e2390677e3c", key, pathF);
//     const stream = await fs.createWriteStream(path.join(__dirname+"/uploads/profiles/", Math.random().toString() + "."+file.name.split(".")[1]));
//     reader.pipe(stream);
//     console.log("DONE")
//   }
  
  

//   ctx.redirect('/');
// });







app.use(serve(path.join(__dirname, '/public')));

// // handle uploads
// router.post("/gallery/stylist", async function(ctx) {
//   // ignore non-POSTs
//   //   if ('POST' != ctx.method) return await next();
  

//   const file = ctx.request.files.file;
//   console.log(" Tot: "+file.length)
//   if(file.length !== undefined){
//     for (let i = 0 ; i < file.length; i++){
//       const pathF = file[i].path;
//       const reader = await fs.createReadStream(pathF);
//       console.log("file[i].path) "+file[i].path+ " ");
//       const key = await uuid.v4()+"name="+file[i].name.replace(" ", "");
//       //awsHandler.uploadFile(key, "123bucket-err-2/testDir", pathF);
//       admin.addToStylistGallery("5b7d187730d4801a6891ffde","5b7d240bb22b4e2390677e3c", key, pathF);
//       const stream = await fs.createWriteStream(path.join(__dirname+"/uploads/profiles", Math.random().toString() + "."+file[i].name.split(".")[1]));
//       reader.pipe(stream);
      
//     }
//   }else{
//     const pathF = file.path;
//     const reader = await fs.createReadStream(pathF);
//     console.log("file[i].path) "+file.path+ " ");
//     const key = await uuid.v4()+"name="+file.name.replace(" ", "");
//     //awsHandler.uploadFile(key, "123bucket-err-2/testDir", pathF);
//     admin.addToStylistGallery("5b7d187730d4801a6891ffde","5b7d240bb22b4e2390677e3c", key, pathF);
//     const stream = await fs.createWriteStream(path.join(__dirname+"/uploads/profiles", Math.random().toString() + "."+file.name.split(".")[1]));
//     reader.pipe(stream);
//     console.log("DONE")
//   }
  
  

//   ctx.redirect('/');
// });


// router.post("/avatar/user", async function(ctx) {
//   // ignore non-POSTs
//   //   if ('POST' != ctx.method) return await next();
  

//   const file = ctx.request.files.file;
//   console.log(" Tot: "+file.length)
//   if(file.length !== undefined){
//     for (let i = 0 ; i < file.length; i++){
//       const pathF = file[i].path;
//       const reader = await fs.createReadStream(pathF);
//       console.log("file[i].path) "+file[i].path+ " ");
//       const key = await uuid.v4()+"name="+file[i].name.replace(" ", "");
//       //awsHandler.uploadFile(key, "123bucket-err-2/testDir", pathF);
//       admin.addToUserAvatar("5b7d187730d4801a6891ffde", key, pathF);
//       const stream = await fs.createWriteStream(path.join(__dirname+"/uploads/profiles", Math.random().toString() + "."+file[i].name.split(".")[1]));
//       reader.pipe(stream);
      
//     }
//   }else{
//     const pathF = file.path;
//     const reader = await fs.createReadStream(pathF);
//     console.log("file[i].path) "+file.path+ " ");
//     const key = await uuid.v4()+"name="+file.name.replace(" ", "");
//     //awsHandler.uploadFile(key, "123bucket-err-2/testDir", pathF);
//     admin.addToUserAvatar("5b7d187730d4801a6891ffde", key, pathF);
//     const stream = await fs.createWriteStream(path.join(__dirname+"/uploads/profiles/", Math.random().toString() + "."+file.name.split(".")[1]));
//     reader.pipe(stream);
//     console.log("DONE")
//   }
  
  

//   ctx.redirect('/');
// });


// router.post("/gallery", async function(ctx) {
//   // ignore non-POSTs
//   //   if ('POST' != ctx.method) return await next();
  

//   const file = ctx.request.files.file;
//   console.log(" Tot: "+file.length)
//   if(file.length !== undefined){
//     for (let i = 0 ; i < file.length; i++){
//       const pathF = file[i].path;
//       const reader = await fs.createReadStream(pathF);
//       console.log("file[i].path) "+file[i].path+ " ");
//       const key = await uuid.v4()+"name="+file[i].name.replace(" ", "");
//       //awsHandler.uploadFile(key, "123bucket-err-2/testDir", pathF);
//       admin.addToSalonGallery("5b7d240bb22b4e2390677e3c", key, pathF);
//       const stream = await fs.createWriteStream(path.join(__dirname+"/uploads/", Math.random().toString() + "."+file[i].name.split(".")[1]));
//       reader.pipe(stream);
      
//     }
//   }else{
//     const pathF = file.path;
//     const reader = await fs.createReadStream(pathF);
//     console.log("file[i].path) "+file.path+ " ");
//       const key = await uuid.v4()+"name="+file.name.replace(" ", "");
//       //awsHandler.uploadFile(key, "123bucket-err-2/testDir", pathF);
//       admin.addToSalonGallery("5b7d240bb22b4e2390677e3c", key, pathF);
//       const stream = await fs.createWriteStream(path.join(__dirname+"/uploads/", Math.random().toString() + "."+file.name.split(".")[1]));
//       reader.pipe(stream);
//       console.log("DONE")
//   }
  
  

//   ctx.redirect('/');
// });

app.use(router.routes());
app.use(router.allowedMethods());
app.listen(3000);
console.log('listening on port 3000');