const schema = require("../db/schema/schema");
const ObjectId = require('mongodb').ObjectID;
const awsHandler = require('../../aws/aws-handler');
const empty = require("is-empty");
const generic = require("./generic")
/*

CONTENT RELATED QUERIES FOR SALON AND STYLISTS


*/



const addSubserviceAvatar = async (salonObjId, code, serviceName, binary, key) => {
 
    console.log("--addServicesToSalon--");
   // try{
        const db = await generic.getDatabaseByName("afroturf");
        let  result = await db.db.collection("salons").aggregate([{ $match: { _id: ObjectId(salonObjId) } }, {$project: {bucketName: 1}}])
        let resultArr = await result.toArray();
        let bucketName, count;
        if(!empty(result)){
            console.log("--not empty--");
            count = JSON.parse(JSON.stringify(resultArr[0]));
            bucketName = await count.bucketName;
        }else{
            bucketName = undefined;
        }
        if(bucketName === undefined) {
            console.log("failed to find bucketName: ") ;
                bucketName = await awsHandler.createUserDefaultBucket('salon');
                db.db.collection("salons").update({$and : [{"_id": ObjectId(salonObjId)}]}, {$set: {bucketName: bucketName}});
        }
        console.log(count);

    
        bucketName = bucketName + "/accounts/user/data/public/photos/profiles/subservices"
        //upload to public
        awsHandler.uploadFileWithCallBackSubservices(key, bucketName, binary, addSubserviceAvatarOnSuccessListner,salonObjId,serviceName, code)
        db.connection.close();

    
    // }catch(err){
    //     throw new Error(err);
    // }
  }
const addToSalonGalleryOnSuccessListner = async (err, data, salonObjId, userId) =>{
    if (err){ console.log(err, err.stack); return -1;}
    try{
        console.log(data)
        const db = await generic.getDatabaseByName("afroturf");
        const result = await db.db.collection("salons").update(
            {$and: [{"_id": ObjectId(salonObjId)}]},
            {$addToSet: {gallery:data}}, 
        );
        db.connection.close();
        console.log("ok: "+result.result.ok, "modified: "+ result.result.nModified);
    return  result.result.ok, result.result.nModified;
    }catch(err){
        throw new Error(err);
    }
}
const addToSalonGallery = async (salonObjId, key, binary) =>{
    console.log("--addToSalonGallery--");
    try {
        //get salon bucketId from salon
        const db = await generic.getDatabaseByName("afroturf");
        let  result = await db.db.collection("salons").aggregate([{ $match: { _id: ObjectId(salonObjId) } }, {$project: {bucketName: 1}}])
        result = await result.toArray();
        let bucketName, count;
        if(!empty(result)){
            count = JSON.parse(JSON.stringify(result[0]));
            bucketName = await count.bucketName;
        }else{
            bucketName = undefined;
        }
        if(bucketName === undefined) {
            console.log("failed to find bucketName: ") ; 
            bucketName = await awsHandler.createUserDefaultBucket('salon');
            db.db.collection("salons").update(  {$and : [{"_id": ObjectId(salonObjId)}]}, {$set: {bucketName: bucketName}});
        } //and store id in useraccoun
        console.log(count);
        db.connection.close();
        bucketName = bucketName + "/accounts/user/data/public/photos/salon"
        //upload to public
        awsHandler.uploadFileWithCallBack(key, bucketName, binary, addToSalonGalleryOnSuccessListner, salonObjId, "",)
    } catch (error) {

        console.log("addToSalonGallery --- failed to find add to gallery: ")
        throw new Error(error)
    }
   
}

const addToStylistGallery = async (userId, salonObjId, key, binary) => {
    console.log("--addToStylistGallery--");
    try {
        //get salon bucketId from salon

        const db = await generic.getDatabaseByName("afroturf");
        let  result = await db.db.collection("salons").aggregate([{ $match: { _id: ObjectId(salonObjId) } }, {$project: {bucketName: 1}}]);
        let id = "stylist"
        result = await result.toArray();
        let bucketName, count;
        if(!empty(result)){
            count = JSON.parse(JSON.stringify(result[0]));
            bucketName = await count.bucketName;
        }else{
            bucketName = undefined;
        }
        if(bucketName === undefined) {
            console.log("failed to find bucketName: ") ; 
            bucketName = await awsHandler.createUserDefaultBucket(id);
            db.db.collection("salons").update(  {$and : [{"_id": ObjectId(salonObjId)}]}, {$set: {bucketName: bucketName}});
        } //and store id in useraccoun
        console.log(count);
        db.connection.close();

        bucketName = bucketName + "/accounts/user/data/public/photos/stylists"
        //upload to public
        awsHandler.uploadFileWithCallBack(key, bucketName, binary, addToStylistGalleryOnSuccessListner, salonObjId, userId)
    } catch (error) {

        console.log("addToSalonGallery --- failed to find add to gallery: ")
        throw new Error(error)
    }
}



const addToStylistGalleryOnSuccessListner = async (err, data, salonObjId, userId) =>{
    if (err){ console.log(err, err.stack); return -1;}
    console.log("--addToStylistGalleryOnSuccessListner--");
    try{
        console.log(data)
        const db = await generic.getDatabaseByName("afroturf");
        const result = await db.db.collection("salons").update(
            {$and : [{"_id": ObjectId(salonObjId)}]},
            {$addToSet: {"stylists.$[stylist].gallery":data}},
            {arrayFilters: [{$and: [{"stylist.userId":userId}]}]}
        );
        db.connection.close();
        console.log("ok: "+result.result.ok, "modified: "+ result.result.nModified);
    return  result.result.ok, result.result.nModified;
    }catch(err){
        db.connection.close();
        throw new Error(err);
    }
}







const addToUserAvatar = async (userId,key, binary) => {
    console.log("--addToUserAvatar--");
    try {
        //get salon bucketId from salon

        const db = await generic.getDatabaseByName("afroturf");
        let  result = await db.db.collection("users").aggregate([{ $match: { _id: ObjectId(userId) } }, {$project: {bucketName: 1, fname:1}}])
        result = await result.toArray();
        console.log(result);
        let bucketName, count;
        if(!empty(result)){
            count = JSON.parse(JSON.stringify(result[0]));
            bucketName = await count.bucketName;
        }else{
            bucketName = undefined;
        }
        if(bucketName === undefined) {
            console.log("failed to find bucketName: ") ;
            bucketName = await awsHandler.createUserDefaultBucket(count.fname);
            db.db.collection("users").update( {$and : [{"_id": ObjectId(userId)}]}, {$set: {bucketName:bucketName}})
        }
        console.log(count);
        db.connection.close();

        bucketName = bucketName + "/accounts/user/data/public/photos/profiles"
        //upload to public
        awsHandler.uploadFileWithCallBack(key, bucketName, binary, addToUserAvatarOnSuccessListner,"", userId)
    } catch (error) {

        console.log("addToUserAvatar --- failed to find add to avatar: ")
        throw new Error(error)
    }
}


const addSubserviceAvatarOnSuccessListner = async (err, data, salonObjId, serviceName, code) =>{
    console.log("--addSubserviceAvatarOnSuccessListner--");
    if (err){ console.log(err, err.stack); return console.log(err);}

    try{
        const db = await generic.getDatabaseByName("afroturf");
        const result = await db.db.collection("salons").update(
        {$and : [{"_id": ObjectId(salonObjId)}]},
        {$set: {"services.$[subservice].subservices.$[service].url":data.url}},
        {arrayFilters: [{$and: [{"subservice._id":serviceName},{"subservice.subservices.code": {$eq:code}}]},{"service.code": code}]}
        );
        console.log({res:result.result.ok, modified: result.result.nModified });
    return  ;
    }catch(err){

        throw new Error(err);
    }

}
const addToUserAvatarOnSuccessListner = async (err, data, salonObjId, userId) =>{
    if (err){ console.log(err, err.stack); return -1;}
    console.log("--addToUserAvatarOnSuccessListner--");
    try{
        console.log(data)
        const db = await generic.getDatabaseByName("afroturf");
        const result = await db.db.collection("users").update(
            {$and : [{"_id": ObjectId(userId)}]},
            {$set: {avatar:data}}
        );
        db.connection.close();
        console.log("ok: "+result.result.ok, "modified: "+ result.result.nModified);
    return  result.result.ok, result.result.nModified;
    }catch(err){
        db.connection.close();
        throw new Error(err);
    }
}


const addToSalonAvatar = async (salonObjId,key, binary) => {
    console.log("--addToSalonAvatar--");
    try {
        //get salon bucketId from salon

        const db = await generic.getDatabaseByName("afroturf");
        let  result = await db.db.collection("salons").aggregate([{ $match: { _id: ObjectId(salonObjId) } }, {$project: {bucketName: 1}}])
        result = await result.toArray();
        let bucketName, count;
        if(!empty(result)){
            count = JSON.parse(JSON.stringify(result[0]));
            bucketName = await count.bucketName;
        }else{
            bucketName = undefined;
        }
        console.log(count)
        console.log(bucketName);
        if(bucketName === undefined) {
            console.log("failed to find bucketName: ") ; 
            bucketName = await awsHandler.createUserDefaultBucket('salon');
            db.db.collection("salons").update({$and : [{"_id": ObjectId(salonObjId)}]}, {$set: {bucketName: bucketName}});
        } //and store id in useraccoun

        bucketName = bucketName + "/accounts/user/data/public/photos/profiles"
        //upload to public
        awsHandler.uploadFileWithCallBack(key, bucketName, binary, addToSalonAvatarOnSuccessListner,salonObjId, "")
    } catch (error) {

        console.log("addToUserAvatar --- failed to find add to avatar: ")
        throw new Error(error)
    }
}
const addToSalonAvatarOnSuccessListner = async (err, data, salonObjId, userId) =>{
    if (err){ console.log(err, err.stack); return -1;}
    console.log("--addToSalonAvatarOnSuccessListner--");
    try{
        console.log(data)
        const db = await generic.getDatabaseByName("afroturf");
        const result = await db.db.collection("salons").update(
            {$and : [{"_id": ObjectId(salonObjId)}]},
            {$addToSet: {avatar:data}}
        );
        db.connection.close();
        console.log("ok: "+result.result.ok, "modified: "+ result.result.nModified);
    return  result.result.ok, result.result.nModified;
    }catch(err){
        db.connection.close();
        throw new Error(err);
    }
}


/*

ADD COMMENTS TO SALON AND STYLIST GALARY


*/

const commentOnStylistGalleryObject = async (ETag, from, userId,salonObjId, comment) =>{
    try{
        const data = schema.commentEntry(from, comment);
        console.log("commentOnStylistGalleryObject")
        const db = await generic.getDatabaseByName("afroturf");
        const result = await db.db.collection("salons").update(
            {$and : [{"_id": ObjectId(salonObjId)}]},
            {$addToSet: {"stylists.$[st].gallery.$[c].comments":data}},
            {arrayFilters: [{$or:[ {"c.ETag":ETag}]}, {"st.userId":userId}]}
        );
        db.connection.close();
        console.log("ok: "+result.result.ok, "modified: "+ result.result.nModified);
    return  result.result.ok, result.result.nModified;
    }catch(err){
        throw new Error(err);
    }
}
const commentOnSalonGalleryObject = async (ETag,from,salonObjId, comment) =>{
    try{
        const data = schema.commentEntry(from, comment);
        console.log("commentOnSalonGalleryObject")
        const db = await generic.getDatabaseByName("afroturf");
        const result = await db.db.collection("salons").update(
            {$and : [{"_id": ObjectId(salonObjId)}]},
            {$addToSet: {"gallery.$[c].comments":data}},
            {arrayFilters: [{$or:[ {"c.ETag":ETag}]}]}
        );
        db.connection.close();
        console.log("ok: "+result.result.ok, "modified: "+ result.result.nModified);
    return  result.result.ok, result.result.nModified;
    }catch(err){
        throw new Error(err);
    }
}





module.exports = {
    addToSalonGallery,
    addToStylistGallery,
    addToUserAvatar,
    addToSalonAvatar,
    commentOnSalonGalleryObject,
    commentOnStylistGalleryObject,
    addSubserviceAvatar,
}

