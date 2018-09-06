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
router.post('/afroturf/user/register'
, async ctx => {
    const res = await userOps.createUser(ctx);
    console.log(ctx.request.body.password);
    ctx.body = res === 200 ? "successfully added "+res : " something went wrong, username might already exist "+res ;
});


//login

router.post('/afroturf/user/login'
, async ctx => {
    const res = await auth.authenticateUser(ctx);
    console.log(ctx.request.body.password);
    ctx.body = res.res === 200 ? "successfully authenticated "+res.res+"\n\n\n\n user: \n" +JSON.stringify(res.user) : " something went wrong, incorrect username/password  "+res ;
});

//edit a user

router.post('/afroturf/user/edit/profile', async ctx => {
  console.log(ctx.request.body);
  const res = await userOps.updateUser(ctx);
  console.log(res)
  ctx.body = res === 200 ? "successfully edited user " : "Failed to edit user";
});




// {
//   "userId":"5b8f75f4de5f7e1964ca5137",
//   "name": "THE MILE",
//   "address": "Pretoria,The Blue Street, 0083",
//   "latitude": 31.212121,
//   "longitude": 22.12313,
//   "sName": "manicure"
// }
//create salon /afroturf/user/profile/create/salon
router.post('/afroturf/user/profile/create/salon', async ctx => {
  console.log(ctx.request.body);
  const res = await salonOps.createSalon(ctx);
  ctx.body = res === 200 ? "successfully created salon " : "Failed to add salon";
});

//edit salon details /afroturf/user/profile/edit/salon/dashboard
router.post('/afroturf/user/profile/edit/salon/dashboard', async ctx => {
  console.log(ctx.request.body);
  const res = await salonOps.updateSalonContent(ctx);
  ctx.body = res;
});
//favourite salon /afroturf/user/profile/salon/id/favorite
router.post('/afroturf/user/profile/salon/:id/follow', async ctx => {
  
  const res = await userOps.followSalon(ctx);
  ctx.body = res;
});


//write review /afroturf/user/profile/salon/id/favorite
router.post('/afroturf/user/profile/salon/:id/review', async ctx => {
  console.log(ctx.request.body);
  const res = await userOps.sendReview(ctx);
  ctx.body = res;
});


//write message /afroturf/user/profile/messages/room'
router.post('/afroturf/user/profile/messages/room', async ctx => {
  console.log(ctx.request.body);
  const res = await userOps.sendMessage(ctx);
  ctx.body = res;
});
//apply to a salon as stylist api/afroturf/user/apply/salon
router.post('/afroturf/user/profile/salon/apply', async ctx => {
  console.log(ctx.request.body);
  const res = await stylistOps.applyAsStylist(ctx);
  ctx.body = res;
});
//respond to application api/afroturf/user/profile/applications/status
router.post('/afroturf/user/profile/salon/dashboard/applications/status', async ctx => {
  const res = await salonOps.acceptStylistRequest(ctx);
  ctx.body = res;
});

//book a salon /afroturf/user/profile/bookings/salon/id (geneic booking)
router.post('/afroturf/user/profile/salon/service/bookings', async ctx => {
  console.log(ctx.request.body);
  const res = await salonOps.addtosalonOrders(ctx);
  ctx.body = res;
});
//book a stylist api/afroturf/user/book/service/salon/stylist  (specific booking)
router.post('/afroturf/user/profile/salon/service/stylist/bookings', async ctx => {
  console.log(ctx.request.body);
  const res = await salonOps.addtostylistOrders(ctx);
  ctx.body = res;
});
//respond to booking api/afroturf/salon/salon/dashboard/bookings/status
router.post('/afroturf/user/profile/salon/dashboard/bookings/status', async ctx => {
  console.log(ctx.request.body);
  const res = await salonOps.acceptOrder(ctx);
  ctx.body = res;
});


//not added to table

//get available time slots /afroturf/user/profile/salon/bookings/available
router.get('/afroturf/user/profile/salon/bookings/unavailable', async ctx => {
  console.log(ctx.request.body);
  const res = await salonOps.getBookedTimeSlotForSalon(ctx);
  ctx.body = res;
});

//get available orders after /afroturf/user/profile/salon/bookings/available
router.get('/afroturf/user/profile/salon/bookings/stylist/unavailable', async ctx => {
  console.log(ctx.request.body);
  const res = await salonOps.getBookedTimeSlotForStylist(ctx);
  ctx.body = res;
});

//get available orders after /afroturf/user/profile/salon/bookings/available
router.get('/afroturf/user/profile/salon/bookings/stylist/duration/unavailable-btwn', async ctx => {
  console.log(ctx.request.body);
  const res = await salonOps.getStylistOrdersByDateBetween(ctx);
  ctx.body = res;
});
//get available orders after /afroturf/user/profile/salon/bookings/available
router.get('/afroturf/user/profile/salon/bookings/duration/unavailable-btwn', async ctx => {
  console.log(ctx.request.body);
  const res = await salonOps.getSalonOrdersByDateBetween(ctx);
  ctx.body = res;
});

//get available orders after /afroturf/user/profile/salon/bookings/available
router.get('/afroturf/user/profile/salon/bookings/stylist/duration/unavailable-b', async ctx => {
  console.log(ctx.request.body);
  const res = await salonOps.getStylistOrdersByDateBefore(ctx);
  ctx.body = res;
});

//get available orders after /afroturf/user/profile/salon/bookings/available
router.get('/afroturf/user/profile/salon/bookings/duration/unavailable-b', async ctx => {
  console.log(ctx.request.body);
  const res = await salonOps.getSalonOrdersByDateBefore(ctx);
  ctx.body = res;
});

//get available orders after /afroturf/user/profile/salon/bookings/available
router.get('/afroturf/user/profile/salon/bookings/:orderNumber', async ctx => {
  console.log(ctx.request.body);
  const res = await salonOps.getOrderByOrderNumber(ctx);
  ctx.body = res;
});


//get bookings doc /afroturf/user/profile/salon/bookings/available
router.get('/afroturf/user/profile/salon/bookings', async ctx => {
  console.log(ctx.request.body);
  const res = await salonOps.getSalonOrdersDoc(ctx);
  ctx.body = res;
});



//crud salon content

//add subservice To Salon Services /afroturf/user/profile/edit/salon/dashboard
router.put('/afroturf/user/profile/edit/salon/dashboard/subservices', async ctx => {
  console.log(ctx.request.body);
  const res = await salonOps.addsubserviceToSalonServices(ctx);
  ctx.body = res;
});

//add service To Salon Services /afroturf/user/profile/edit/salon/dashboard
router.put('/afroturf/user/profile/edit/salon/dashboard/services', async ctx => {
  console.log(ctx.request.body);
  const res = await salonOps.addServicesToSalon(ctx);
  ctx.body = res;
});
//add service avatar To a Salon service  /afroturf/user/profile/edit/salon/dashboard
router.put('/afroturf/user/profile/edit/salon/dashboard/services/avatar', async ctx => {
  console.log(ctx.request.body);
  const res = await salonOps.addServiceAvatar(ctx);
  ctx.body = res;
});

//update service name for a salon /afroturf/user/profile/edit/salon/dashboard
router.patch('/afroturf/user/profile/edit/salon/dashboard/services', async ctx => {
  console.log(ctx.request.body);
  const res = await salonOps.updateServiceName(ctx);
  ctx.body = res;
});

//update service name for a salon /afroturf/user/profile/edit/salon/dashboard
router.patch('/afroturf/user/profile/edit/salon/dashboard/subservices', async ctx => {
  console.log(ctx.request.body);
  const res = await salonOps.updateSubservice(ctx);
  ctx.body = res;
});













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