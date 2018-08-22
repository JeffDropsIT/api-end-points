const AWS = require("aws-sdk");

AWS.config.loadFromPath('../../aws/AwsConfig.json'); 
const s3 = new AWS.S3({apiVersion: '2006-03-01'});
const uuid = require("uuid");
const fs = require('fs');

const deleteObject = async(key, name) =>{
    try {
        const params = {
            Bucket: name, 
            Key: key
        }
        
        s3.deleteObject(params, async (err, data) =>{ callBack(err, data)});
        
        
    } catch (error) {
        console.log("FAILED TO DELETE OBJECT " + key + " AT" + name)
        throw new Error(error)
    }
}

const getAllObjects = async (basePath, name) =>{
    try {
        const params = {
            Bucket: name, /* required */
            Prefix: basePath == "all" ? "" : basePath 

          };
        
        await s3.listObjects(params, async (err, data) =>{ callBack(err, data)});

    } catch (error) {
        throw new Error(error)
    }
}
const createUserDefaultBucket = async (username) => {
    const genUsername = username.trim().replace(/\s/g,'').toLowerCase().replace("@","_")+"-id-"+uuid.v4().split("-")[0];
    console.log("user/salon bucketName : "+genUsername+ "count : "+genUsername.length)
    const params = {
        Bucket: genUsername
    }
    try {
        await s3.createBucket(params, async (err, data) =>{ if(err) console.log(err); else {await createDir("accounts/user/data/public/files/.data",genUsername);
        await createDir("accounts/user/data/public/photos/.data",genUsername);
        await createDir("accounts/user/data/public/videos/.data",genUsername);
    
        await createDir("accounts/user/data/private/files/.data",genUsername);
        await createDir("accounts/user/data/private/photos/.data",genUsername);
        await createDir("accounts/user/data/private/videos/.data",genUsername);}});
        return genUsername;
    } catch (error) {
        console.log("FAILED TO createBucket name" + username)
        throw new Error(error)
    }
}
const createBucket = async (username) => {
    const genUsername = username.toLowerCase().replace("@","_")+"-id-"+uuid.v4();
    console.log("user/salon bucketName : "+genUsername)
    const params = {
        Bucket: genUsername
    }
    try {
        await s3.createBucket(params, async (err, data) =>{ callBack(err, data)});
        return genUsername;
    } catch (error) {
        console.log("FAILED TO createBucket name" + username)
        throw new Error(error)
    }
}
const getObjectTagging = async (key, name) =>{
    try {
        const params = {
            Bucket: name, 
            Key: key
        }
        
        s3.getObjectTagging(params, async (err, data) =>{ callBack(err, data)});
        
        
    } catch (error) {
        console.log("FAILED TO getObjectTagging " + key + " AT" + name)
        throw new Error(error)
    }
}
const getObject = async (key, name) => {
    try {
        const params = {
            Bucket: name, 
            Key: key
        }
        
        await s3.getObject(params, async (err, data) =>{ callBack(err, data)});
        
    } catch (error) {
        console.log("FAILED TO getObject " + key + " AT" + name)
        throw new Error(error)
    }
}

const checkIfBucketExist = async (name) =>{
    try {
        const params = {
            Bucket: name
           };
           s3.headBucket(params, callBack(err, data));
    } catch (error) {
        console.log("FAILED TO checkIfBucketExist " + key + " AT" + name)
        throw new Error(error)
    }
}
const getObjectHead = async (key, name) => {
    try {
        const params = {
            Bucket: name, 
            Key: key
        }
        
        await s3.headObject(params, async (err, data) =>{ callBack(err, data)});
      
        
    } catch (error) {
        console.log("FAILED TO getObjectHead " + key + " AT" + name)
        throw new Error(error)
    }
}


const uploadFile = async (key, name, path) => {
    try {
        const stream = await fs.createReadStream(path);
        const params =  {Bucket: name, Key: key, Body: stream};
    
        //await console.log(stream)
        await s3.upload(params, async (err, data) =>{ callBack(err, data)});
    } catch (error) {
        throw new Error(error)
    }
}

const uploadFileWithCallBack = async (key, name, path, func, salonObjId, userId) => {
    try {
        const stream = await fs.createReadStream(path);
        const params =  {Bucket: name, Key: key, Body: stream};
    
        //await console.log(stream)
        await s3.upload(params, async (err, data) =>{ data["comments"] = []; delete data["key"] ; data["created"] = new Date(); func(err, data, salonObjId, userId)});
    } catch (error) {
        throw new Error(error)
    }
}

const createDir = async (path, name) => {
    try {
        const params = {
            Bucket: name,
            Key: path
        }
        
    await s3.putObject(params, (err, data) => callBack(err, data))
    } catch (error) {
        throw new Error(error)
    }
}
const callBack = async(err, data) => {
    if (err) console.log(err, err.stack); // an error occurred
    else await console.log(data); return await data; // successful response
}

//getObject("testDir/download.jpg", "123bucket-err-2");
//deleteObject("testDir/download (1).jpg", "123bucket-err-2");


//deleteObject("rose_red_flower_bud_119651_1920x1080.jpg", "123bucket-err-2" );
//getObjectTagging("img.jpg", "123bucket-err-2");
//createBucket("JEFF");
//getAllObjects("testDir/", "123bucket-err-2");
//checkIfBucketExist("123bucket-erfr-2");
//getObjectHead("testDir/24779362-ac97-464b-8796-66406a701eb6name=39099533_220411258637412_6843874040776491008_n.jpg", "123bucket-err-2")
// createBucket("allen")
// const createUserDir = async (username)=> {
//     const genUsername = await createBucket(username)
    
// }
//createUserDefaultBucket("I HATE LASE AND I LOVE SUXIE SESY LUMP BACK").then(p =>{ name = p; console.log(name)});

module.exports = {
    uploadFile,
    createUserDefaultBucket,
    uploadFileWithCallBack
}