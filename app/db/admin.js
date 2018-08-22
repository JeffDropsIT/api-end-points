const schema = require("../db/schema/schema");
const mongodb = require("mongodb");
const ObjectId = require('mongodb').ObjectID;
const authentication = require("../db/authentication");
const awsHandler = require('../../aws/aws-handler');
const uuid = require("uuid");
const empty = require("is-empty");

let mongodbClient = mongodb.MongoClient;

let url = 'mongodb://admin:password123@ds153841.mlab.com:53841/afroturf';



//get database by Name
const getDatabaseByName = async(name) =>{
 
  try{
    
    const db = await mongodbClient.connect(url,{useNewUrlParser : true});
    
    if(db.isConnected){
      console.log("connected");
    }
    
    return { db: db.db(name), connection: db};
  }catch (err) {
    throw new Error(err);
  }
};


const createAnyCollection = async (dbName, collectionName, schema) =>{
    
    try{
        const db = await getDatabaseByName(dbName);
        const result = await db.db.createCollection(collectionName, {validator: {
        
            $jsonSchema: schema
    
        }
      });
      db.connection.close();
      
      return  result.result;
    }catch(err){
        throw new Error(err);
    }
    
};


const insertIntoCollection = async (dbName, collectionName, data) =>{
    console.log("begin Inserting");
    try{
        const db = await getDatabaseByName(dbName);
        const result = await db.db.collection(collectionName).insert(data)
        db.connection.close();
        console.log("ok: "+result.result.ok, "_id"+ result.ops[0]._id);
        console.log("Done Inserting");
        return  {ok: result.result.ok, _id: result.ops[0]._id.toString()};
    }catch(err){
        console.log("insertIntoCollection failed");
        throw new Error(err);
    }
    
};
const updateCollectionDocument = async (dbName, collectionName, data, id) =>{
    
    try{
        const db = await getDatabaseByName(dbName);
        const result = await db.db.collection(collectionName).update({"_id": ObjectId(id)}, {$set: data});
        db.connection.close();
        console.log("ok: "+result.result.ok, "modified: "+ result.result.nModified);
        return  {ok: result.result.ok, modified: result.result.nModified};
    }catch(err){
        throw new Error(err);
    }
    
};

const createUser = async (fname, lname, password, username, phone) =>{

    try {
        console.log("--createusers--");
        const user = await {fname: fname, lname: lname, password:await authentication.hashPassword(password), username: username, phone: phone, email:"afroturf@gmail.com", created: new Date()};
    
        const result = await insertIntoCollection("afroturf", "users",user)
        console.log("ok: "+result.ok, "_id "+ result._id +" type: "+typeof(result._id));
        let _id;
        _id = result.ok == 1 ?  result._id: null;
        if(_id !==null){
            console.log("Creating users chat room. . .and reviewsDoc :id "+_id)
            createNewUsersPrivateChatRoom(_id, username);
            awsHandler.createUserDefaultBucket(fname).then(p => updateUser({bucketName: p}, _id));
            createReviewsDoc(_id);
        }else{
            return -1;
        }
        
        return  result.ok, result._id;
    } catch (error) {
        throw new Error(error);
    }
};
const updateUser = async (userData, userid) =>{

    console.log("--updateUser--");
    const result = await updateCollectionDocument("afroturf", "users",userData,userid).then(p => console.log("success "+p));
    console.log("ok: "+result, "modified: "+ result);
    return  1;
};


const getUser = async (userId)=>{
    try{
        const db = await getDatabaseByName("afroturf");
        const result = await db.db.collection("users").aggregate([{$match: {_id:ObjectId(userId)} }, {$project: {username:1, fname:1, reviewsDocId:1, gender:1, avatar:1}}]).toArray();
        db.connection.close();
       
        return  JSON.parse(JSON.stringify(result));
    }catch(err){
        throw new Error(err);
    }
}
const applyAsStylist = async (userId, salonObjId) => {
    //get currect user
    console.log("--applyAsStylist--");
    const data = schema.getApplicationJson(userId,salonObjId);
    try{
        const db = await getDatabaseByName("afroturf");
        const result = await db.db.collection("users").update({
            $and:[{"salons.salonObjId": ObjectId(salonObjId)}, {"salons.role": "salonOwner"}, { "salons.hiring": 1 }, {"stylistRequests.userId": {$ne: ObjectId(userId)}}]},
            {$addToSet: {stylistRequests:data}}, 
        );
        db.connection.close();
        console.log("ok: "+result.result.ok, "modified: "+ result.result.nModified);
        return  result.result.ok, result.result.nModified;
    }catch(err){
        throw new Error(err);
    }
}

const acceptStylistRequest = async (userId, salonObjId, status, permissions) => {
    try{
        const db = await getDatabaseByName("afroturf");
        const result = await db.db.collection("users").update({
            $and:[{"salons.salonObjId": ObjectId(salonObjId)}, {"salons.role": "salonOwner"}]},
            {$set: {"stylistRequests.$[stylist].status":status, "stylistRequests.$[stylist].stylistAccess":permissions}},
            {arrayFilters: [{$and: [{"stylist.salonObjId": ObjectId(salonObjId)}, {"stylist.userId": ObjectId(userId)}]}], multi : true } 
        );
        db.connection.close();
        console.log("ok: "+result.result.ok, "modified: "+ result.result.nModified);
        return  result.result.ok, result.result.nModified;
    }catch(err){
        throw new Error(err);
    }
}


const getNextSequenceValue = async (sequenceName, collectionIndex) => {
    try {
        const db = await getDatabaseByName("afroturf");
        const sequenceDocument = await db.db.collection(collectionIndex).findAndModify(
            {_id: sequenceName },
            [],
            {$inc:{lastAdded:1}},
            {new:true}
    );
        db.connection.close();
        return await sequenceDocument.value.lastAdded;
        
    } catch (error) {
        throw new Error(error);
    }
    };

const addStylistToSalon = async (userId, salonObjId) => {
    const stylist = await getUser(userId);
    //console.log()
    let stylistId = await getNextStylistInCount(salonObjId);
    stylistId = stylistId;

    if(stylist == "[]"){
        console.log("   NO SUCH USER "+stylist)
        return -1;
    }
    console.log(" SUCH USER "+stylist[0]._id)
    try{
        const db = await getDatabaseByName("afroturf");
        const result = await db.db.collection("salons").update({
            $and:[{_id: ObjectId(salonObjId)}, {"stylists.userId": {$ne: stylist[0]._id}}]},
            {$addToSet: {stylists:schema.stylistJSON(stylist[0], stylistId, stylist[0]._id )}}
        );
        db.connection.close();
        console.log("ok: "+result.result.ok, "modified: "+ result.result.nModified);
        return  result.result.ok, result.result.nModified;
    }catch(err){
        throw new Error(err);
    }
}
//const user =  {fname: "Afroturf", lname: "v1", lie: "email@gmail.com", phone: "+2771008456895"};

//applyAsStylist("5b72a32fc2352417f49992e8", "5b5a37b3fb6fc07c4c24d80d").then(p => console.log(p));
//updateUser(updatesalons, "5b72a32fc2352417f49992f7");
//acceptStylistRequest("5b72a32fc2352417f49992f8", "5b5a37b3fb6fc07c4c24d80d", "active", ["GU"]).then(p => console.log(p))
//acceptStylistRequest("5b72a32fc2352417f49992e8", "5b5a37b3fb6fc07c4c24d80d", "active", ["null"]).then(p => console.log(p))
//addStylistToSalon("5b7d187730d4801a6891ffde", "5b7d240bb22b4e2390677e3c").then(p => console.log(p))
//getNextSequenceValue("stylistId").then(p => console.log(p))
//getUser("5b72a32fc2352417f49992f8").then(p => console.log(p[0].fname))
// createUser( "Afroturf", "v1", "password", "email@email.com", "+2771008456895");
// createUser( "Jeff", "v2", "jeff123", "jeff@email.com", "+277789845496");
// createUser( "Jane", "Lane", "jane123", "jabe@email.com", "+2771008526842");
/////////////////////////console.log("--createCollection--");
/////////////////createAnyCollection("afroturf", "users", usersSchema).then(p => console.log("done "+p));



//authentication.hashPassword("password").then(p => console.log(p))

// CRUD  salon 
//at least one services is required to create a salon
const createSalon = async (userId, name, address, street, coordinates, sName, hiring) =>{
    try {
            //add this to users db
        console.log("--createSalon--");
        const salonId = await getNextSequenceValue("salonId", "salonIndexes")
        const salon = await schema.createNewSalonForm(salonId,name, address, street, coordinates, sName);
        let _id;
        
        const addedSalon = await insertIntoCollection("afroturf", "salons",salon);
        _id = addedSalon.ok == 1 ?  addedSalon._id: null;


        //if successful
        if(_id !== null){
            addSalonToUserAccount(userId, _id, hiring, salonId);
            console.log("Creating users chat room. . .and reviewsDoc")
            createNewUsersPrivateChatRoom(_id, name);
            awsHandler.createUserDefaultBucket(name).then(p => updateSalon({bucketName: p}, _id));
            createReviewsDoc(_id);
            console.log("--added to owner account-- "+_id);
        }else{
            console.log("--failed to add owner account--");
            return -1
    }
    } catch (error) {
        throw new Error(error);
    }


    
 

}

const addSalonToUserAccount = async (userId, salonObjId, hiring, salonId) => {
    //get currect user
    console.log("--addSalonToUserAccount--");
    const data = schema.getActiveSalonsJsonForm(salonId,salonObjId, hiring);
    try{
        const db = await getDatabaseByName("afroturf");
        const result = await db.db.collection("users").update(
            {"_id": ObjectId(userId)},
            {$addToSet: {salons:data}}, 
        );
        db.connection.close();
        console.log(result.result.ok, result.result.nModified);
    return  result.result.ok, result.result.nModified;
    }catch(err){
        throw new Error(err);
    }
}

const updateSalon = async (salonData, salonObjId) =>{
    //put object to update in a salon
    try{
        const db = await getDatabaseByName("afroturf");
        const result = await db.db.collection("salons").update(
            {"_id": ObjectId(salonObjId)},
            {$set: salonData}
        );
        
        db.connection.close();
        console.log(result.result.ok, result.result.nModified);
    return  result.result.ok, result.result.nModified;
    }catch(err){
        throw new Error(err);
    }
}
const changeAccountStatusSalon = async (salonObjId, status) => {
    //change accountStatus to deactivated
    try{
        const db = await getDatabaseByName("afroturf");
        const result = await db.db.collection("salons").update(
            {"_id": ObjectId(salonObjId)},
            {$set: {accountStatus: status}}, 
        );
        db.connection.close();
        console.log(result.result.ok, result.result.nModified);
    return  result.result.ok, result.result.nModified;
    }catch(err){
        throw new Error(err);
    }

}
// CRUD services i.e manicure, pedicure, massages, makeup and hairstyles

const changeServiceName = async (serviceName, name) =>{
    //update service
    try{
        const db = await getDatabaseByName("afroturf");
        const result = await db.db.collection("salons").update(
            {$and: [{"_id": ObjectId(salonObjId)}, {"services._id": serviceName}]},
            {"services.name":name, "services._id":name}
        );
        db.connection.close();
        console.log("ok: "+result.result.ok, "modified: "+ result.result.nModified);
    return  result.result.ok, result.result.nModified;
    }catch(err){
        throw new Error(err);
    }

}
const deleteService = async ( serviceName) => {
    //later use $unset
}

const addServicesToSalon = async (salonObjId, serviceName) => {
    //check if service already exist if not proceed
    //get currect user
    console.log("--addServicesToSalon--");
    const data = await schema.createNewServicesForm(serviceName);
    try{
        const db = await getDatabaseByName("afroturf");
        const result = await db.db.collection("salons").update(
            {$and: [{"_id": ObjectId(salonObjId)}, {"services._id": {$ne: serviceName}}]},
            {$addToSet: {services:data}}, 
        );
        db.connection.close();
        console.log("ok: "+result.result.ok, "modified: "+ result.result.nModified);
    return  result.result.ok, result.result.nModified;
    }catch(err){
        throw new Error(err);
    }
}

const addsubserviceToSalonServices = async (salonObjId, serviceName, type, code, price, description) => {
    //get currect user
    console.log("--addsubserviceToSalonServices--");
    const data = schema.createNewSubserviceForm(type, code, price, description);
    try{
        const db = await getDatabaseByName("afroturf");
        const result = await db.db.collection("salons").update(
            {$and : [{"_id": ObjectId(salonObjId)}]},
            {$addToSet: {"services.$[subservice].subservices":data}},
            {arrayFilters: [{$and: [{"subservice._id":serviceName}, {"subservice.subservices.code": {$ne:data.code}}]}]}
        );
        db.connection.close();
        console.log("ok: "+result.result.ok, "modified: "+ result.result.nModified);
    return  result.result.ok, result.result.nModified;
    }catch(err){
        db.connection.close();
        throw new Error(err);
    }
}


// CRUD reviews salon and stylist


const updateReview = async (serviceName, serviceData) =>{
    //put object to update in a salon
    
}
const deleteReview = async (serviceName) => {

}


//rooms And reviews

const createNewUsersPrivateChatRoom = async (userId, username) => {

        
    try {
        //add this to users db
        //const userData = await getUser(userId);
        const room = await schema.createNewRoomForm(username, "online", "private");
        console.log("--createNewUsersPrivateChatRoom--");
    
        let _id;
        
        const addedRoom = await insertIntoCollection("afroturf", "rooms",room);
        _id = addedRoom.ok == 1 ?  addedRoom._id: null;
        //if successful
        if(_id !== null){
            addRoomToUserAccount(userId, _id);
            console.log("--added to user account-- "+_id);
        }else{
            console.log("--failed to add owner account--");
            return -1
    }
    } catch (error) {
        console.log("--failed to createNewUsersPrivateChatRoom--");
        throw new Error(error);
    }


}

const addRoomToUserAccount = async (userId, roomId) =>{
    try {
        const db = await getDatabaseByName("afroturf");
        const result = await db.db.collection("users").update(
            {"_id": ObjectId(userId)},
            {$addToSet: {roomDocIdList:{roomDocId:roomId}}}, 
        );
        db.connection.close();
        console.log(result.result.ok, result.result.nModified);
    return  result.result.ok, result.result.nModified;
    } catch (error) {
        throw new Error(error);
    }
}
const createReviewsDoc = async (userId) =>{
    try {
        const reviewDoc = await schema.createNewReviewDocForm(userId);
        console.log("--createReviewsDoc--");
    
        let _id;
        
        const addedReviewDoc = await insertIntoCollection("afroturf", "reviews",reviewDoc);
        _id = addedReviewDoc.ok == 1 ?  addedReviewDoc._id: null;
        //if successful
        if(_id !== null){
            addReviewsDocIdToUserAccount(userId, _id);
            console.log("--added to review doc user account-- "+_id);
        }else{
            console.log("--failed to add user account--");
            return -1
        }
    } catch (error) {
        console.log("--failed to createReviewsDoc--");
        throw new Error(error)
    }
}

const addReviewsDocIdToUserAccount = async (userId, reviewsDocId) =>{
    try {
        const db = await getDatabaseByName("afroturf");
        const result = await db.db.collection("users").update(
            {"_id": ObjectId(userId)},
            {$set: {reviewsDocId:reviewsDocId}}, 
        );
        db.connection.close();
        console.log(result.result.ok, result.result.nModified);
       return result.result.ok, result.result.nModified;
    } catch (error) {
        throw new Error(error);
    }
}

const followSalon = async (userId, salonObjId) =>{
    try {
        
        const db = await getDatabaseByName("afroturf");
        const result = await db.db.collection("users").update(
            {$and: [{"_id": ObjectId(userId)}, {"following.salonObjId":{$ne:salonObjId}}]},
            {$addToSet: {following:{salonObjId:salonObjId}}},
        );
        db.connection.close();
        console.log(result.result.ok, result.result.nModified);
        if(result.result.nModified === 0 && result.result.ok ===1){
            console.log("failed to insert possible causes salon already present");
            //handle error accordingly
        }
    return  result.result.ok, result.result.nModified;

    } catch (error) {
        console.log("failed to followSalon. . .\n salonObjId: "+salonObjId)
        throw new Error(error);
    }
}
const sendMessage = async (payload, from, type, roomDocId) =>{
    let messageId = await getNextMessageCount(roomDocId);
    messageId = messageId.toString();
    try {
        const message = await schema.createNewMessageForm(messageId, payload, from, type);
        const db = await getDatabaseByName("afroturf");
        const result = await db.db.collection("rooms").update(
            {$and: [{"_id": ObjectId(roomDocId)}, {"messages.messageId" :{$ne: messageId}} ]},
            {$addToSet: {messages:message}},
        );
        db.connection.close();
        console.log(result.result.ok, result.result.nModified);
        if(result.result.nModified === 0 && result.result.ok ===1){
            console.log("duplicate id present");
            //handle error accordingly
        }
    return  result.result.ok, result.result.nModified;

    } catch (error) {
        console.log("failed to sendMessge. . .\n messageId: "+messageId.toString()+" payload: "+payload)
        throw new Error(error);
    }
   

}

const sendReview = async (payload, from, rating, to) =>{
    let reviewIdIn = await getNextReviewInCount(to);
    reviewIdIn = reviewIdIn.toString();
    let reviewIdOut = await getNextReviewOutCount(from);
    reviewIdOut = reviewIdOut.toString();
    try {
        const reviewIn = await schema.createNewReviewInForm(from, payload, rating, reviewIdIn);
        const db = await getDatabaseByName("afroturf");
        const resultOne = await db.db.collection("reviews").update(
            {$and: [{"userId": to}, {"reviewsIn.reviewId" :{$ne: reviewIdIn}} ]},
            {$addToSet: {reviewsIn:reviewIn}},
        );
      
        console.log(resultOne.result.ok, resultOne.result.nModified);
        if(resultOne.result.nModified === 0 && resultOne.result.ok ===1){
            console.log("duplicate id present");
            //handle error accordingly
        }
        const reviewOut = await schema.createNewReviewOutForm(to, payload, rating, reviewIdOut);
        const result = await db.db.collection("reviews").update(
            {$and: [{"userId": from}, {"reviewsOut.reviewId" :{$ne: reviewIdOut}} ]},
            {$addToSet: {reviewsOut:reviewOut}},
        );
        db.connection.close();
        console.log(result.result.ok, result.result.nModified);
        if(result.result.nModified === 0 && result.result.ok ===1){
            console.log("duplicate id present");
            //handle error accordingly
        }
    return  { ok: result.result.ok, modified: result.result.nModified, ok2: resultOne.result.ok, modified2: resultOne.result.nModified}

    } catch (error) {
        console.log("failed to sendReview. . .\n sendReview: "+reviewOut.toString())
        throw new Error(error);
    }
   

}

const getNextReviewInCount = async(userId) =>{
    try {
        const db = await getDatabaseByName("afroturf");
        let result = await db.db.collection("reviews").aggregate([
            { $match: { "userId": userId } },
            {$project:{count:{$size: "$reviewsIn"}}}
        ]);
        
        result = await result.toArray();
        if(!empty(result)){
            console.log("DATA IS THERE. . . ")
            console.log(result)
            let count = JSON.parse(JSON.stringify(result[0]));
            db.connection.close();
            return count.count + 1;
        }else{
            console.log("NOT STYLIST PRESENT. . .")
            let count = JSON.parse(JSON.stringify(result));
            db.connection.close();
            console.log(count);
            if(count === NaN) {return 1;}else return 1;
        }
    } catch (error) {
        console.log("failed to getNextReviewInCount Count")
        throw new Error(error);
    }
    
}

const getNextStylistInCount = async(salonId) =>{
    try {
        const db = await getDatabaseByName("afroturf");
        let result = await db.db.collection("salons").aggregate([
            { $match: { _id: ObjectId(salonId) } },
            {$project:{count:{$size: "$stylists"}}}
        ]);
       
        result = await result.toArray();
        if(!empty(result)){
            console.log("DATA IS THERE. . .getNextStylistInCount ")
            console.log(result)
            let count = JSON.parse(JSON.stringify(result[0]));
            db.connection.close();
            return count.count + 1;
        }else{
            console.log("NOT STYLIST PRESENT. . .")
            let count = JSON.parse(JSON.stringify(result));
            db.connection.close();
            console.log(count);
            if(count === NaN) {return 1;}else return 1;
        }
        
        
    } catch (error) {
        console.log("failed to getNextStylistInCount Count")
        throw new Error(error);
    }
    
}

const getNextReviewOutCount = async(userId) =>{
    try {
        const db = await getDatabaseByName("afroturf");
        let result = await db.db.collection("reviews").aggregate([
            { $match: { "userId": userId } },
            {$project:{count:{$size: "$reviewsOut"}}}
        ]);
        
        result = await result.toArray();
        if(!empty(result)){
            console.log("DATA IS THERE. . . ")
            console.log(result)
            let count = JSON.parse(JSON.stringify(result[0]));
            db.connection.close();
            return count.count + 1;
        }else{
            console.log("NOT STYLIST PRESENT. . .")
            let count = JSON.parse(JSON.stringify(result));
            db.connection.close();
            console.log(count);
            if(count === NaN) {return 1;}else return 1;
        }
    } catch (error) {
        console.log("failed to getNextReviewOutCount Count")
        throw new Error(error);
    }
    
}

const getNextMessageCount = async(roomDocId) =>{
    try {
        const db = await getDatabaseByName("afroturf");
        let result = await db.db.collection("rooms").aggregate([
            { $match: { _id: ObjectId(roomDocId) } },
            {$project:{count:{$size: "$messages"}}}
        ]);
        
        result = await result.toArray();
        if(!empty(result)){
            console.log("DATA IS THERE. . . ")
            console.log(result)
            let count = JSON.parse(JSON.stringify(result[0]));
            db.connection.close();
            return count.count + 1;
        }else{
            console.log("STYLIST PRESENT. . .")
            let count = JSON.parse(JSON.stringify(result));
            db.connection.close();
            console.log(count);
            if(count === NaN) {return 1;}else return 1;
        }
    } catch (error) {
        console.log("failed to getNextMessageCount Count")
        throw new Error(error);
    }
    
}


/*

CONTENT RELATED QUERIES FOR SALON AND STYLISTS


*/
const addToSalonGalleryOnSuccessListner = async (err, data, salonObjId, userId) =>{
    if (err){ console.log(err, err.stack); return -1;}
    try{
        console.log(data)
        const db = await getDatabaseByName("afroturf");
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
        const db = await getDatabaseByName("afroturf");
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

        const db = await getDatabaseByName("afroturf");
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
        const db = await getDatabaseByName("afroturf");
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

        const db = await getDatabaseByName("afroturf");
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
        const db = await getDatabaseByName("afroturf");
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

        const db = await getDatabaseByName("afroturf");
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
        const db = await getDatabaseByName("afroturf");
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
        const db = await getDatabaseByName("afroturf");
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
        const db = await getDatabaseByName("afroturf");
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
//commentOnStylistGalleryObject("\"a812ce71a5f6b5ed3bb11b8660ab3fae\"", "","5b7d187730d4801a6891ffde","5b7d187730d4801a6891ffde","5b7d240bb22b4e2390677e3c", "DAMN WOW REALLY" )
commentOnSalonGalleryObject("\"d41d8cd98f00b204e9800998ecf8427e\"","", "5b7d187730d4801a6891ffde","5b7d240bb22b4e2390677e3c", "I HATE THIS PICTURE LOOK AT HIS HAIR")

//addToSalonGallery("5b7d240bb22b4e2390677e3c", "", "");




//getNextMessageCount("5b75591bcdd59c569872c135");
//sendMessage("I LOVE THIS SALON IT IS SO AWESOME WOW THE PASSION.", "5b75697a2cdfe55c7858a842", 0,"5b75694638a96a6f201c8ddc")
//sendReview("I LOVE THIS SALON IT IS SO AWESOME WOW THE PASSION.","5b75697a2cdfe55c7858a842", 1, "5b75694438a96a6f201c8ddb" )


//followSalon("5b75697a2cdfe55c7858a842", "5b5a37b3fb6fc07c4c24d80d")


//createSalon("5b7d187730d4801a6891ffde", "THE NEW GRACE", "Mandeni, 4491", "Bhidla Road", [-30.135888, 31.402572], "hairstyles", 1);
// addServicesToSalon("5b74167ded4ae581304ec740", "manicures");
// console.log("------")
// addsubserviceToSalonServices("5b74167ded4ae581304ec740", "manicures", "colorful", "M1F", 150, "beautiful darkgrey nails that are amazing for summer")
//createAnyCollection("afroturf", "reviews", schema.reviews);
//createAnyCollection("afroturf", "rooms", schema.rooms);

//createUser("Cole", "Lane", "password123", "Cole@LaneDi", "+2771645472"); //remove multiple username

module.exports = {
    addToSalonGallery,
    addToStylistGallery,
    addToUserAvatar,
    addToSalonAvatar,
}

