const uuid = require("uuid");
const admin = require("../../app/db/admin")
const fs = require('fs');
const path = require('path');


const uploadSalonAvatar = async (ctx) =>{
    try {
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
            
            ctx.body = {res: 200, message: "uploaded"}
            
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
          
      ctx.body = {res: 200, message: "uploaded"}
        }
    } catch (error) {

        console.log("uploadSalonAvatar --- failed to find upload to avatar: ")
        throw new Error(error)
    }
}

const uploadToUserAvatar = async (ctx) =>{
    
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
      
      ctx.body = {res: 200, message: "uploaded"}
      
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
    
    ctx.body = {res: 200, message: "uploaded"}
    console.log("DONE")
  }
  
  
}
const uploadToStylistGallary = async (ctx) =>{
    
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
      
      ctx.body = {res: 200, message: "uploaded"}
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
    
    ctx.body = {res: 200, message: "uploaded"}
  }
  
}
const uploadToSalonGallary = async (ctx) =>{
    
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
      
      ctx.body = {res: 200, message: "uploaded"}
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

      ctx.body = {res: 200, message: "uploaded"}
  }
  
  
}

module.exports = {
    uploadToSalonGallary,
    uploadToStylistGallary,
    uploadToUserAvatar,
    uploadSalonAvatar,

}