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









router.post("/avatar/salon", async function(ctx) {
  // ignore non-POSTs
  //   if ('POST' != ctx.method) return await next();
  

  const file = ctx.request.files.file;
  console.log(" Tot: "+file.length)
  if(file.length !== undefined){
    for (let i = 0 ; i < file.length; i++){
      const pathF = file[i].path;
      const reader = await fs.createReadStream(pathF);
      console.log("file[i].path) "+file[i].path+ " ");
      const key = await uuid.v4()+"name="+file[i].name.replace(" ", "");
      //awsHandler.uploadFile(key, "123bucket-err-2/testDir", pathF);
      admin.addToSalonAvatar("5b7d240bb22b4e2390677e3c", key, pathF);
      const stream = await fs.createWriteStream(path.join(__dirname+"/uploads/profiles", Math.random().toString() + "."+file[i].name.split(".")[1]));
      reader.pipe(stream);
      
    }
  }else{
    const pathF = file.path;
    const reader = await fs.createReadStream(pathF);
    console.log("file[i].path) "+file.path+ " ");
    const key = await uuid.v4()+"name="+file.name.replace(" ", "");
    //awsHandler.uploadFile(key, "123bucket-err-2/testDir", pathF);
    admin.addToSalonAvatar("5b7d240bb22b4e2390677e3c", key, pathF);
    const stream = await fs.createWriteStream(path.join(__dirname+"/uploads/profiles/", Math.random().toString() + "."+file.name.split(".")[1]));
    reader.pipe(stream);
    console.log("DONE")
  }
  
  

  ctx.redirect('/');
});







app.use(serve(path.join(__dirname, '/public')));

// handle uploads
router.post("/gallery/stylist", async function(ctx) {
  // ignore non-POSTs
  //   if ('POST' != ctx.method) return await next();
  

  const file = ctx.request.files.file;
  console.log(" Tot: "+file.length)
  if(file.length !== undefined){
    for (let i = 0 ; i < file.length; i++){
      const pathF = file[i].path;
      const reader = await fs.createReadStream(pathF);
      console.log("file[i].path) "+file[i].path+ " ");
      const key = await uuid.v4()+"name="+file[i].name.replace(" ", "");
      //awsHandler.uploadFile(key, "123bucket-err-2/testDir", pathF);
      admin.addToStylistGallery("5b7d187730d4801a6891ffde","5b7d240bb22b4e2390677e3c", key, pathF);
      const stream = await fs.createWriteStream(path.join(__dirname+"/uploads/profiles", Math.random().toString() + "."+file[i].name.split(".")[1]));
      reader.pipe(stream);
      
    }
  }else{
    const pathF = file.path;
    const reader = await fs.createReadStream(pathF);
    console.log("file[i].path) "+file.path+ " ");
    const key = await uuid.v4()+"name="+file.name.replace(" ", "");
    //awsHandler.uploadFile(key, "123bucket-err-2/testDir", pathF);
    admin.addToStylistGallery("5b7d187730d4801a6891ffde","5b7d240bb22b4e2390677e3c", key, pathF);
    const stream = await fs.createWriteStream(path.join(__dirname+"/uploads/profiles", Math.random().toString() + "."+file.name.split(".")[1]));
    reader.pipe(stream);
    console.log("DONE")
  }
  
  

  ctx.redirect('/');
});


router.post("/avatar/user", async function(ctx) {
  // ignore non-POSTs
  //   if ('POST' != ctx.method) return await next();
  

  const file = ctx.request.files.file;
  console.log(" Tot: "+file.length)
  if(file.length !== undefined){
    for (let i = 0 ; i < file.length; i++){
      const pathF = file[i].path;
      const reader = await fs.createReadStream(pathF);
      console.log("file[i].path) "+file[i].path+ " ");
      const key = await uuid.v4()+"name="+file[i].name.replace(" ", "");
      //awsHandler.uploadFile(key, "123bucket-err-2/testDir", pathF);
      admin.addToUserAvatar("5b7d187730d4801a6891ffde", key, pathF);
      const stream = await fs.createWriteStream(path.join(__dirname+"/uploads/profiles", Math.random().toString() + "."+file[i].name.split(".")[1]));
      reader.pipe(stream);
      
    }
  }else{
    const pathF = file.path;
    const reader = await fs.createReadStream(pathF);
    console.log("file[i].path) "+file.path+ " ");
    const key = await uuid.v4()+"name="+file.name.replace(" ", "");
    //awsHandler.uploadFile(key, "123bucket-err-2/testDir", pathF);
    admin.addToUserAvatar("5b7d187730d4801a6891ffde", key, pathF);
    const stream = await fs.createWriteStream(path.join(__dirname+"/uploads/profiles/", Math.random().toString() + "."+file.name.split(".")[1]));
    reader.pipe(stream);
    console.log("DONE")
  }
  
  

  ctx.redirect('/');
});


router.post("/gallery", async function(ctx) {
  // ignore non-POSTs
  //   if ('POST' != ctx.method) return await next();
  

  const file = ctx.request.files.file;
  console.log(" Tot: "+file.length)
  if(file.length !== undefined){
    for (let i = 0 ; i < file.length; i++){
      const pathF = file[i].path;
      const reader = await fs.createReadStream(pathF);
      console.log("file[i].path) "+file[i].path+ " ");
      const key = await uuid.v4()+"name="+file[i].name.replace(" ", "");
      //awsHandler.uploadFile(key, "123bucket-err-2/testDir", pathF);
      admin.addToSalonGallery("5b7d240bb22b4e2390677e3c", key, pathF);
      const stream = await fs.createWriteStream(path.join(__dirname+"/uploads/", Math.random().toString() + "."+file[i].name.split(".")[1]));
      reader.pipe(stream);
      
    }
  }else{
    const pathF = file.path;
    const reader = await fs.createReadStream(pathF);
    console.log("file[i].path) "+file.path+ " ");
      const key = await uuid.v4()+"name="+file.name.replace(" ", "");
      //awsHandler.uploadFile(key, "123bucket-err-2/testDir", pathF);
      admin.addToSalonGallery("5b7d240bb22b4e2390677e3c", key, pathF);
      const stream = await fs.createWriteStream(path.join(__dirname+"/uploads/", Math.random().toString() + "."+file.name.split(".")[1]));
      reader.pipe(stream);
      console.log("DONE")
  }
  
  

  ctx.redirect('/');
});

app.use(router.routes());
app.use(router.allowedMethods());
app.listen(3000);
console.log('listening on port 3000');