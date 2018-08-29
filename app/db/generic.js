const mongodb = require("mongodb");
const empty = require("is-empty");
let mongodbClient = mongodb.MongoClient;
const ObjectId = require('mongodb').ObjectID;
const schema = require("./schema/schema");


//get database by Name
const getDatabaseByName = async(name) =>{
    let url = 'mongodb://admin:password123@ds153841.mlab.com:53841/afroturf';
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

const checkIfUserNameEmailPhoneExist = async (username) =>{
    try {
        const db = await getDatabaseByName("afroturf");
        const result = await db.db.collection("users").find({$or : [{username:username}, {email:username}, {phone:username}]});
        const arrResult = await result.toArray();
        const json = JSON.parse(JSON.stringify(arrResult));
        const status = empty(json) ? 0 : 1;
        console.log("status: "+status);
        db.connection.close();
        //console.log(json);
        return status;
    } catch (error) {
        throw new Error(error);
    }
}

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




const createNewUsersPrivateChatRoom = async (userId, username, collectionName) => {

        
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
            addRoomToUserAccount(userId, _id, collectionName);
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

const createReviewsDoc = async (userId, collectionName) =>{
    try {
        const reviewDoc = await schema.createNewReviewDocForm(userId);
        console.log("--createReviewsDoc--");
    
        let _id;
        
        const addedReviewDoc = await insertIntoCollection("afroturf", "reviews",reviewDoc);
        _id = addedReviewDoc.ok == 1 ?  addedReviewDoc._id: null;
        //if successful
        if(_id !== null){
            addReviewsDocIdToUserAccount(userId, _id, collectionName);
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

const addRoomToUserAccount = async (userId, roomId, collectionName) =>{
    try {
        const db = await getDatabaseByName("afroturf");
        const result = await db.db.collection(collectionName).update(
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

const addReviewsDocIdToUserAccount = async (userId, reviewsDocId, collectionName) =>{
    try {
        const db = await getDatabaseByName("afroturf");
        const result = await db.db.collection(collectionName).update(
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




//checkIfUserNameEmailPhoneExist("blaldeX", "afrotlurf@gmail.com", "+27716454l72"); //test passed



module.exports = {
    insertIntoCollection,
    createNewUsersPrivateChatRoom,
    createReviewsDoc,
    updateCollectionDocument,
    getDatabaseByName,
    checkIfUserNameEmailPhoneExist
}