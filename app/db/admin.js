const schema = require("../db/schema/schema");
const mongodb = require("mongodb");
const ObjectId = require('mongodb').ObjectID;
const authentication = require("../db/authentication")
let mongodbClient = mongodb.MongoClient;
let url = 'mongodb://admin:password123@ds153841.mlab.com:53841/afroturf';


const usersSchema = schema.users;
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
      console.log("ok: "+result.result.ok, "modified: "+ result.result.nModified);
      return  result.result.ok, result.result.nModified;
    }catch(err){
        throw new Error(err);
    }
    
};


const insertIntoCollection = async (dbName, collectionName, user) =>{
    
    try{
        const db = await getDatabaseByName(dbName);
        const result = await db.db.collection(collectionName).insert(user)
        db.connection.close();
        console.log("ok: "+result.result.ok, "_id"+ result.ops[0]._id);
        return  result.result.ok, result.ops[0]._id;
    }catch(err){
        throw new Error(err);
    }
    
};
const updateCollectionDocument = async (dbName, collectionName, data, id) =>{
    
    try{
        const db = await getDatabaseByName(dbName);
        const result = await db.db.collection(collectionName).update({"_id": ObjectId(id)}, {$set: data});
        db.connection.close();
        console.log("ok: "+result.result.ok, "modified: "+ result.result.nModified);
        return  result.result.ok, result.result.nModified;
    }catch(err){
        throw new Error(err);
    }
    
};
const createUser = async (fname, lname, password, email, phone) =>{

    console.log("--createusers--");
    const user = await {fname: fname, lname: lname, password:await authentication.hashPassword(password), email: email, phone: phone};
   
    const result = await insertIntoCollection("afroturf", "users",user).then(p => console.log("success "+p));
    db.connection.close();
    console.log("ok: "+result.result.ok, "_id"+ result.ops[0]._id);
    return  result.result.ok, result.ops[0]._id;
};
const updateUser = async (userData, userid) =>{

    console.log("--updateUser--");
    const result = await updateCollectionDocument("afroturf", "users",userData,userid).then(p => console.log("success "+p));
    db.connection.close();
    console.log("ok: "+result.result.ok, "modified: "+ result.result.nModified);
    return  result.result.ok, result.result.nModified;
};


const getUser = async (userId)=>{
    try{
        const db = await getDatabaseByName("afroturf");
        const result = await db.db.collection("users").aggregate([{$match: {_id:ObjectId(userId)} }, {$project: {fname:1, gender:1}}]).toArray();
        db.connection.close();
        console.log("ok: "+result.result.ok, "modified: "+ result.result.nModified);
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
    const stylistId = await getNextSequenceValue("stylistId", "stylistIndexes");

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
        addedSalon.result.ok == 1 ?  _id = addedSalon.ops[0]._id: _id = null;
        //if successful
        if(_id !== null){
            addSalonToUserAccount(userId, _id, hiring, salonId);
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


const createReview = async (serviceName, serviceData) =>{

}

const updateReview = async (serviceName, serviceData) =>{

}
const deleteReview = async ( serviceName) => {

}

//createSalon("5b72a32fc2352417f49992f7", "Overflow", "Mandeni, 4491", "Thokoza Road", [-29.135888, 31.402572], "hairstyles", 1);
addServicesToSalon("5b74167ded4ae581304ec740", "manicures");
console.log("------")
addsubserviceToSalonServices("5b74167ded4ae581304ec740", "manicures", "colorful", "M1F", 150, "beautiful darkgrey nails that are amazing for summer")