const schema = require("../db/schema/schema");
const mongodb = require("mongodb");
const ObjectId = require('mongodb').ObjectID;
const authentication = require("../db/authentication")
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
        const user = await {fname: fname, lname: lname, password:await authentication.hashPassword(password), username: username, phone: phone, email:"afroturf@gmail.com"};
    
        const result = await insertIntoCollection("afroturf", "users",user)
        console.log("ok: "+result.ok, "_id "+ result._id +" type: "+typeof(result._id));
        let _id;
        _id = result.ok == 1 ?  result._id: null;
        if(_id !==null){
            console.log("Creating users chat room. . .and reviewsDoc")
            createNewUsersPrivateChatRoom(_id, username);
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
    db.connection.close();
    console.log("ok: "+result.result.ok, "modified: "+ result.result.nModified);
    return  result.ok, result.modified;
};


const getUser = async (userId)=>{
    try{
        const db = await getDatabaseByName("afroturf");
        const result = await db.db.collection("users").aggregate([{$match: {_id:ObjectId(userId)} }, {$project: {username:1, fname:1, reviewsDocId:1, gender:1}}]).toArray();
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
    let stylistId = await getNextStylistInCount(salonObjId);
    stylistId = stylistId.toString();

    if(stylist == "[]"){
        console.log("NO SUCH USER "+stylist)
        return -1;
    }
    console.log("SUCH USER")
    try{
        const db = await getDatabaseByName("afroturf");
        const result = await db.db.collection("salons").update({
            $and:[{_id: ObjectId(salonObjId)}, {"stylists.userId": {$ne: ObjectId(stylist[0]._id)}}]},
            {$addToSet: {stylists:schema.stylistJSON(stylist[0], stylistId)}}
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
//addStylistToSalon("5b72a32fc2352417f49992f8", "5b5a37b3fb6fc07c4c24d80d").then(p => console.log(p))
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
            createNewUsersPrivateChatRoom(_id, username);
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

const updateSalon = async (salonObjId, salonData) =>{
    //put object to update in a salon
    try{
        const db = await getDatabaseByName("afroturf");
        const result = await db.db.collection("salons").update(
            {"_id": ObjectId(salonObjId)},
            {salonData} 
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
        const count = JSON.parse(JSON.stringify(result[0]));
        console.log(count.count + 1);
        db.connection.close();
        return count.count + 1;
    } catch (error) {
        console.log("failed to getNextReviewInCount Count")
        throw new Error(error);
    }
    
}

const getNextStylistInCount = async(salonId) =>{
    try {
        const db = await getDatabaseByName("afroturf");
        let result = await db.db.collection("salons").aggregate([
            { $match: { _id: salonId } },
            {$project:{count:{$size: "$stylists"}}}
        ]);
        result = await result.toArray();
        const count = JSON.parse(JSON.stringify(result[0]));
        console.log(count.count + 1);
        db.connection.close();
        return count.count + 1;
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
        const count = JSON.parse(JSON.stringify(result[0]));
        console.log(count.count + 1);
        db.connection.close();
        return count.count + 1;
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
        const count = JSON.parse(JSON.stringify(result[0]));
        console.log(count.count + 1);
        db.connection.close();
        return count.count + 1;
    } catch (error) {
        console.log("failed to getNextMessageCount Count")
        throw new Error(error);
    }
    
}
//getNextMessageCount("5b75591bcdd59c569872c135");
//sendMessage("I LOVE THIS SALON IT IS SO AWESOME WOW THE PASSION.", "5b75697a2cdfe55c7858a842", 0,"5b75694638a96a6f201c8ddc")
//sendReview("I LOVE THIS SALON IT IS SO AWESOME WOW THE PASSION.","5b75697a2cdfe55c7858a842", 1, "5b75694438a96a6f201c8ddb" )


followSalon("5b75697a2cdfe55c7858a842", "5b5a37b3fb6fc07c4c24d80d")


//createSalon("5b72a32fc2352417f49992f7", "Overflow", "Mandeni, 4491", "Thokoza Road", [-29.135888, 31.402572], "hairstyles", 1);
// addServicesToSalon("5b74167ded4ae581304ec740", "manicures");
// console.log("------")
// addsubserviceToSalonServices("5b74167ded4ae581304ec740", "manicures", "colorful", "M1F", 150, "beautiful darkgrey nails that are amazing for summer")
//createAnyCollection("afroturf", "reviews", schema.reviews);
//createAnyCollection("afroturf", "rooms", schema.rooms);

//createUser("Jamly", "Cole", "password123", "JamJamCole", "+2778645284"); //remove multiple username
