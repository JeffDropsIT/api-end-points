const uuid = require("uuid");
const admin = require("../../app/db/admin")



const uploadSalonAvatar = async (ctx) =>{
    try {
      const binary = ctx.request.body.binary;
      const salonObjId = ctx.request.body.salonObjId;
      const name = ctx.request.body.name;
      console.log(" Tot: "+binary)
      
      const key = await uuid.v4()+"-"+name.replace(" ", "")+".jpeg";
      //awsHandler.uploadFile(key, "123bucket-err-2/testDir", pathF);
      admin.addToSalonAvatar(salonObjId, key, binary);
      
      ctx.body = {res: 200, message: "uploaded"}
      console.log("DONE")
        
      
    } catch (error) {
        console.log("uploadSalonAvatar --- failed to find upload to avatar: ")
        throw new Error(error)
    }
}



const  addSubserviceAvatar = async (ctx) => {
   //console.log(ctx)
   const binary = ctx.request.body.binary;
   const salonObjId = ctx.request.body.salonObjId;
   const name = ctx.request.body.name;
   const code = ctx.request.body.code;
   const serviceName = ctx.request.body.serviceName;
   console.log(" Tot: "+binary)
   
   const key = await uuid.v4()+"-"+name.replace(" ", "")+".jpeg";
   //awsHandler.uploadFile(key, "123bucket-err-2/testDir", pathF);
   admin.addSubserviceAvatar(salonObjId, code, serviceName, binary, key);
   
   ctx.body = {res: 200, message: "uploaded"}
   console.log("DONE")

}
const uploadToUserAvatar = async (ctx) =>{
  //console.log(ctx)
  const binary = ctx.request.body.binary;
  const userId = ctx.request.body.userId;
  const name = ctx.request.body.name;
  console.log(" Tot: "+binary)
  
  const key = await uuid.v4()+"-"+name.replace(" ", "")+".jpeg";
  //awsHandler.uploadFile(key, "123bucket-err-2/testDir", pathF);
  admin.addToUserAvatar(userId, key, binary);
  
  ctx.body = {res: 200, message: "uploaded"}
  console.log("DONE")
  
  
  
}

//uploadToUserAvatar()
const uploadToStylistGallary = async (ctx) =>{
    
  const binary = ctx.request.body.binary;
  const userId = ctx.request.body.userId;
  const name = ctx.request.body.name;
  const salonObjId = ctx.request.body.salonObjId;

  const key = await uuid.v4()+"-"+name.replace(" ", "")+".jpeg";
  //awsHandler.uploadFile(key, "123bucket-err-2/testDir", pathF);
  admin.addToStylistGallery(userId,salonObjId, key, binary);
  console.log("DONE")
  
  ctx.body = {res: 200, message: "uploaded"}

  
}
const uploadToSalonGallary = async (ctx) =>{

  const binary = ctx.request.body.binary;
  const salonObjId = ctx.request.body.salonObjId;
  const name = ctx.request.body.name;

  const key = await uuid.v4()+"-"+name.replace(" ", "")+".jpeg";
  //awsHandler.uploadFile(key, "123bucket-err-2/testDir", pathF);
  admin.addToSalonGallery(salonObjId, key, binary);
  console.log("DONE")
  
  ctx.body = {res: 200, message: "uploaded"}

  
}

module.exports = {
    uploadToSalonGallary,
    uploadToStylistGallary,
    uploadToUserAvatar,
    uploadSalonAvatar,
    addSubserviceAvatar,

}