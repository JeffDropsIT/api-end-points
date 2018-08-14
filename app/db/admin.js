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

const usersSchema = schema.users;
const createAnyCollection = async (dbName, collectionName, schema) =>{
    
    try{
        const db = await getDatabaseByName(dbName);
        const result = await db.db.createCollection(collectionName, {validator: {
        
            $jsonSchema: schema
    
        }
      });
        db.connection.close();
    return  result;
    }catch(err){
        throw new Error(err);
    }
    
};


const insertIntoCollection = async (dbName, collectionName, user) =>{
    
    try{
        const db = await getDatabaseByName(dbName);
        const result = await db.db.collection(collectionName).insert(user)
        db.connection.close();
    return  result;
    }catch(err){
        throw new Error(err);
    }
    
};
const updateCollectionDocument = async (dbName, collectionName, data, id) =>{
    
    try{
        const db = await getDatabaseByName(dbName);
        const result = await db.db.collection(collectionName).update({"_id": ObjectId(id)}, {$set: data});
        db.connection.close();
    return  result;
    }catch(err){
        throw new Error(err);
    }
    
};
const createUser = async (fname, lname, password, email, phone) =>{

    console.log("--createusers--");
    const user = await {fname: fname, lname: lname, password:await authentication.hashPassword(password), email: email, phone: phone};
   
    insertIntoCollection("afroturf", "users",user).then(p => console.log("success "+p));
};
const updateUser = async (user, id) =>{

    console.log("--updateUser--");
    updateCollectionDocument("afroturf", "users",user,id ).then(p => console.log("success "+p));
};



const getApplicationJson =  (userId, salonObjId)=>{
    const application = {
        "userId": ObjectId(userId),
        "salonObjId": ObjectId(salonObjId),
        "status": "pending",
        "stylistAccess": [
            "GU"
        ]
    }
    return application;
}
const stylistJSON =  (stylist, stylistId)=>{
    const application = {
        "userId": ObjectId(stylist._id),
        "stylistId": stylistId,
        "name": stylist.fname,
        "gender": stylist.gender,
        "reviews":[],
        "rating": 1,
    }
    return application;
}

const getUser = async (userId)=>{
    try{
        const db = await getDatabaseByName("afroturf");
        const result = await db.db.collection("users").aggregate([{$match: {_id:ObjectId(userId)} }, {$project: {fname:1, gender:1}}]).toArray();
        db.connection.close();
    return  JSON.parse(JSON.stringify(result));
    }catch(err){
        throw new Error(err);
    }
}
const applyAsStylist = async (userId, salonObjId) => {
    //get currect user
    console.log("--applyAsStylist--");
    const data = getApplicationJson(userId,salonObjId);
    try{
        const db = await getDatabaseByName("afroturf");
        const result = await db.db.collection("users").update({
            $and:[{"salons.salonObjId": ObjectId(salonObjId)}, {"salons.role": "salonOwner"}, { "salons.hiring": 1 }, {"stylistRequests.userId": {$ne: ObjectId(userId)}}]},
            {$addToSet: {stylistRequests:data}}, 
        );
        db.connection.close();
    return  result.result;
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
    return  result.result;
    }catch(err){
        throw new Error(err);
    }
}


const getNextSequenceValue = async (sequenceName) => {
    try {
        const db = await getDatabaseByName("afroturf");
        const sequenceDocument = await db.db.collection("stylistIndexes").findAndModify(
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
    const stylistId = await getNextSequenceValue("stylistId");

    if(stylist == "[]"){
        console.log("NO SUCH USER "+stylist)
        return -1;
    }
    console.log("SUCH USER")
    try{
        const db = await getDatabaseByName("afroturf");
        const result = await db.db.collection("salons").update({
            $and:[{_id: ObjectId(salonObjId)}, {"stylists.userId": {$ne: ObjectId(stylist[0]._id)}}]},
            {$addToSet: {stylists:stylistJSON(stylist[0], stylistId)}}
        );
        db.connection.close();
    return  result.result;
    }catch(err){
        throw new Error(err);
    }
}
//const user =  {fname: "Afroturf", lname: "v1", lie: "email@gmail.com", phone: "+2771008456895"};

//applyAsStylist("5b72a32fc2352417f49992e8", "5b5a37b3fb6fc07c4c24d80d").then(p => console.log(p));
//updateUser(updatesalons, "5b72a32fc2352417f49992f7");
//acceptStylistRequest("5b72a32fc2352417f49992f8", "5b5a37b3fb6fc07c4c24d80d", "active", ["GU"]).then(p => console.log(p))
//acceptStylistRequest("5b72a32fc2352417f49992e8", "5b5a37b3fb6fc07c4c24d80d", "active", ["null"]).then(p => console.log(p))
addStylistToSalon("5b72a32fc2352417f49992f8", "5b5a37b3fb6fc07c4c24d80d").then(p => console.log(p))
//getNextSequenceValue("stylistId").then(p => console.log(p))
//getUser("5b72a32fc2352417f49992f8").then(p => console.log(p[0].fname))
// createUser( "Afroturf", "v1", "password", "email@email.com", "+2771008456895");
// createUser( "Jeff", "v2", "jeff123", "jeff@email.com", "+277789845496");
// createUser( "Jane", "Lane", "jane123", "jabe@email.com", "+2771008526842");
/////////////////////////console.log("--createCollection--");
/////////////////createAnyCollection("afroturf", "users", usersSchema).then(p => console.log("done "+p));



//authentication.hashPassword("password").then(p => console.log(p))