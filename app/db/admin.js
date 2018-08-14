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
const modifyRequestJson =  (userId, salonObjId, status, permissions)=>{
    const application = {
        "userId": ObjectId(userId),
        "salonObjId": ObjectId(salonObjId),
        "status": status,
        "stylistAccess": permissions
    }
    return application;
}
const applyAsStylist = async (userId, salonObjId) =>{
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
const acceptStylistRequest = async (userId, salonObjId, status, permissions) =>{
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
//const user =  {fname: "Afroturf", lname: "v1", lie: "email@gmail.com", phone: "+2771008456895"};

applyAsStylist("5b72a32fc2352417f49992e8", "5b5a37b3fb6fc07c4c24d80d").then(p => console.log(p));
//updateUser(updatesalons, "5b72a32fc2352417f49992f7");
acceptStylistRequest("5b72a32fc2352417f49992f8", "5b5a37b3fb6fc07c4c24d80d", "active", ["GU"]).then(p => console.log(p))
acceptStylistRequest("5b72a32fc2352417f49992e8", "5b5a37b3fb6fc07c4c24d80d", "active", ["null"]).then(p => console.log(p))
// createUser( "Afroturf", "v1", "password", "email@email.com", "+2771008456895");
// createUser( "Jeff", "v2", "jeff123", "jeff@email.com", "+277789845496");
// createUser( "Jane", "Lane", "jane123", "jabe@email.com", "+2771008526842");
/////////////////////////console.log("--createCollection--");
/////////////////createAnyCollection("afroturf", "users", usersSchema).then(p => console.log("done "+p));



//authentication.hashPassword("password").then(p => console.log(p))