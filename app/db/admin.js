const schema = require("../db/schema/schema");
const mongodb = require("mongodb");
const ObjectId = require('mongodb').ObjectID;
const authentication = require("../db/authentication");
const awsHandler = require('../../aws/aws-handler');
const uuid = require("uuid");
const empty = require("is-empty");

/*

CONTENT RELATED QUERIES FOR SALON AND STYLISTS


*/
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
const addToSalonGallery = async (salonObjId, key, pathF) =>{
    console.log("--addToSalonGallery--");
    try {
        //get salon bucketId from salon
        const db = await generic.getDatabaseByName("afroturf");
        let  result = await db.db.collection("salons").aggregate([{ $match: { _id: ObjectId(salonObjId) } }, {$project: {bucketName: 1}}])
        result = await result.toArray();
        const count = JSON.parse(JSON.stringify(result[0]));
        let bucketName = await count.bucketName;
        db.connection.close();
        if(bucketName === undefined) {console.log("failed to find bucketName: ") ;return -1;}
        bucketName = bucketName + "/accounts/user/data/public/photos/salon"
        //upload to public
        awsHandler.uploadFileWithCallBack(key, bucketName, pathF, addToSalonGalleryOnSuccessListner, salonObjId, "",)
    } catch (error) {

        console.log("addToSalonGallery --- failed to find add to gallery: ")
        throw new Error(error)
    }
   
}

const addToStylistGallery = async (userId, salonObjId, key, pathF) => {
    console.log("--addToStylistGallery--");
    try {
        //get salon bucketId from salon

        const db = await generic.getDatabaseByName("afroturf");
        let  result = await db.db.collection("salons").aggregate([{ $match: { _id: ObjectId(salonObjId) } }, {$project: {bucketName: 1}}])
        result = await result.toArray();
        const count = JSON.parse(JSON.stringify(result[0]));
        let bucketName = await count.bucketName;
        db.connection.close();
        if(bucketName === undefined) {console.log("failed to find bucketName: ") ;return -1;}
        bucketName = bucketName + "/accounts/user/data/public/photos/stylists"
        //upload to public
        awsHandler.uploadFileWithCallBack(key, bucketName, pathF, addToStylistGalleryOnSuccessListner, salonObjId, userId)
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







const addToUserAvatar = async (userId,key, pathF) => {
    console.log("--addToUserAvatar--");
    try {
        //get salon bucketId from salon

        const db = await generic.getDatabaseByName("afroturf");
        let  result = await db.db.collection("users").aggregate([{ $match: { _id: ObjectId(userId) } }, {$project: {bucketName: 1}}])
        result = await result.toArray();
        const count = JSON.parse(JSON.stringify(result[0]));
        let bucketName = await count.bucketName;
        db.connection.close();
        if(bucketName === undefined) {console.log("failed to find bucketName: ") ;return -1;}
        bucketName = bucketName + "/accounts/user/data/public/photos/profiles"
        //upload to public
        awsHandler.uploadFileWithCallBack(key, bucketName, pathF, addToUserAvatarOnSuccessListner,"", userId)
    } catch (error) {

        console.log("addToUserAvatar --- failed to find add to avatar: ")
        throw new Error(error)
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


const addToSalonAvatar = async (salonObjId,key, pathF) => {
    console.log("--addToSalonAvatar--");
    try {
        //get salon bucketId from salon

        const db = await generic.getDatabaseByName("afroturf");
        let  result = await db.db.collection("salons").aggregate([{ $match: { _id: ObjectId(salonObjId) } }, {$project: {bucketName: 1}}])
        result = await result.toArray();
        const count = JSON.parse(JSON.stringify(result[0]));
        let bucketName = await count.bucketName;
        db.connection.close();
        if(bucketName === undefined) {console.log("failed to find bucketName: ") ;return -1;}
        bucketName = bucketName + "/accounts/user/data/public/photos/profiles"
        //upload to public
        awsHandler.uploadFileWithCallBack(key, bucketName, pathF, addToSalonAvatarOnSuccessListner,salonObjId, "")
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

const commentOnStylistGalleryObject = async (ETag, key, from, userId,salonObjId, comment) =>{
    try{
        const data = schema.commentEntry(from, comment);
        console.log("commentOnStylistGalleryObject")
        const db = await generic.getDatabaseByName("afroturf");
        const result = await db.db.collection("salons").update(
            {$and : [{"_id": ObjectId(salonObjId)}]},
            {$addToSet: {"stylists.$[st].gallery.$[c].comments":data}},
            {arrayFilters: [{$or:[{"c.Key":key}, {"c.ETag":ETag}]}, {"st.userId":userId}]}
        );
        db.connection.close();
        console.log("ok: "+result.result.ok, "modified: "+ result.result.nModified);
    return  result.result.ok, result.result.nModified;
    }catch(err){
        throw new Error(err);
    }
}
const commentOnSalonGalleryObject = async (ETag, key, from,salonObjId, comment) =>{
    try{
        const data = schema.commentEntry(from, comment);
        console.log("commentOnSalonGalleryObject")
        const db = await generic.getDatabaseByName("afroturf");
        const result = await db.db.collection("salons").update(
            {$and : [{"_id": ObjectId(salonObjId)}]},
            {$addToSet: {"gallery.$[c].comments":data}},
            {arrayFilters: [{$or:[{"c.Key":key}, {"c.ETag":ETag}]}]}
        );
        db.connection.close();
        console.log("ok: "+result.result.ok, "modified: "+ result.result.nModified);
    return  result.result.ok, result.result.nModified;
    }catch(err){
        throw new Error(err);
    }
}




/*

ADD SHARED MEDIA QUERIES


*/
















//commentOnStylistGalleryObject("\"a812ce71a5f6b5ed3bb11b8660ab3fae\"", "","5b7d187730d4801a6891ffde","5b7d187730d4801a6891ffde","5b7d240bb22b4e2390677e3c", "DAMN WOW REALLY" )
//commentOnSalonGalleryObject("\"d41d8cd98f00b204e9800998ecf8427e\"","", "5b7d187730d4801a6891ffde","5b7d240bb22b4e2390677e3c", "I HATE THIS PICTURE LOOK AT HIS HAIR")

//addToSalonGallery("5b7d240bb22b4e2390677e3c", "", "");




//getNextMessageCount("5b75591bcdd59c569872c135");
//sendMessage("I LOVE THIS SALON IT IS SO AWESOME WOW THE PASSION.", "5b75697a2cdfe55c7858a842", 0,"5b75694638a96a6f201c8ddc")
//sendReview("I LOVE THIS SALON IT IS SO AWESOME WOW THE PASSION.","5b75697a2cdfe55c7858a842", 1, "5b75694438a96a6f201c8ddb" )


//followSalon("5b75697a2cdfe55c7858a842", "5b5a37b3fb6fc07c4c24d80d")


//createSalon("5b7dd26c21a41857ccfcd7a2", "THE LAB", "GYUB, 1542", "QWERTY Road", [-30.135888, 31.402572], "makeup", 1);
// addServicesToSalon("5b74167ded4ae581304ec740", "manicures");
// console.log("------")
// addsubserviceToSalonServices("5b74167ded4ae581304ec740", "manicures", "colorful", "M1F", 150, "beautiful darkgrey nails that are amazing for summer")
//createAnyCollection("afroturf", "reviews", schema.reviews);
//createAnyCollection("afroturf", "rooms", schema.rooms);

//createUser("Alex", "Blade", "password123", "bladeX", "+2771645472"); //remove multiple username

module.exports = {
    addToSalonGallery,
    addToStylistGallery,
    addToUserAvatar,
    addToSalonAvatar,
}

