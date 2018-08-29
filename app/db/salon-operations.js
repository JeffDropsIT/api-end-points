const auth = require("./authentication");
const awsHandler = require('../../aws/aws-handler');
const generic = require("./generic");
const counters = require("./counters");
const schema = require("./schema/schema");
const ObjectId = require('mongodb').ObjectID;





// CRUD  salon 
//at least one services is required to create a salon
const createSalon = async (userId, name, address, street, coordinates, sName, hiring) =>{
    try {
            //add this to users db
        console.log("--createSalon--");
        const salonId = await counters.getNextSequenceValue("salonId", "salonIndexes")
        const salon = await schema.createNewSalonForm(salonId,name, address, street, coordinates, sName);
        let _id;
        
        const addedSalon = await generic.insertIntoCollection("afroturf", "salons",salon);
        _id = addedSalon.ok == 1 ?  addedSalon._id: null;


        //if successful
        if(_id !== null){
            addSalonToUserAccount(userId, _id, hiring, salonId);
            console.log("Creating users chat room. . .and reviewsDoc");
            createOrderDoc(userId, _id)
            generic.createNewUsersPrivateChatRoom(_id, name, "salons");
            awsHandler.createUserDefaultBucket(name).then(p => updateSalon({bucketName: p}, _id));
            generic.createReviewsDoc(_id, "salons");
            console.log("--added to owner account-- "+_id);
            return 200;
        }else{
            console.log("--failed to add owner account--");
            return -1
    }
    } catch (error) {
        throw new Error(error);
    }


    
 

}
//addtosalonOrders
//addtostylistOrders
const createOrderDoc = async (userId, salonObjId) => {
    //get currect user
   
    console.log("--createOrderDoc--");
    const data = await schema.createNewOrder(salonObjId);
    console.log(data);

        //add this to users db
    console.log("--createOrderDoc--");

    let _id;
    
    const addedSalon = await generic.insertIntoCollection("afroturf", "orders",data);
    _id = addedSalon.ok == 1 ?  addedSalon._id: null;


    //if successful
    if(_id !== null){
        addOrderDocToUserAccount(userId, _id);
        return 200;
    }else{
        console.log("--failed to add owner account orders Doc--");
        return -1
    }
    
}
const addOrderDocToUserAccount = async (userId, orderDocId) => {
    //get currect user
    console.log("--addOrderDocToUserAccount--");
    try{
        const db = await generic.getDatabaseByName("afroturf");
        const result = await db.db.collection("users").update(
            {"_id": ObjectId(userId)},
            {$set: {orderDoc:orderDocId}}, 
        );
        db.connection.close();
        console.log(result.result.ok, result.result.nModified);
    return  result.result.ok, result.result.nModified;
    }catch(err){
        throw new Error(err);
    }
}

const addSalonToUserAccount = async (userId, salonObjId, hiring, salonId) => {
    //get currect user
    console.log("--addSalonToUserAccount--");
    const data = schema.getActiveSalonsJsonForm(salonId,salonObjId, hiring);
    try{
        const db = await generic.getDatabaseByName("afroturf");
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
        const salonObjId = ctx.request.salonObjId, salonData = ctx.request.body;
        const db = await generic.getDatabaseByName("afroturf");
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
        const db = await generic.getDatabaseByName("afroturf");
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
        const db = await generic.getDatabaseByName("afroturf");
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
const deleteService = async (serviceName) => {
    //later use $unset
}

const addServicesToSalon = async (salonObjId, serviceName) => {
    //check if service already exist if not proceed
    //get currect user
    console.log("--addServicesToSalon--");
    const data = await schema.createNewServicesForm(serviceName);
    try{
        const db = await generic.getDatabaseByName("afroturf");
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
        const db = await generic.getDatabaseByName("afroturf");
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

const acceptStylistRequest = async (ctx) => {
    try{
        const userId = ctx.query.userId, 
        salonObjId = ctx.query.salonObjId,
        status = ctx.query.status,
        permissions = ctx.query.permissions;
        if(status == undefined || permissions === undefined){return 401 + "status: null or permission: null"}

        const db = await generic.getDatabaseByName("afroturf");
        const result = await db.db.collection("users").update({
            $and:[{"salons.salonObjId": salonObjId}, {"salons.role": "salonOwner"}]},
            {$set: {"stylistRequests.$[stylist].status":status, "stylistRequests.$[stylist].stylistAccess":[permissions]}},
            {arrayFilters: [{$and: [{"stylist.salonObjId": salonObjId}, {"stylist.userId": userId}]}], multi : true } 
        );
        db.connection.close();
        console.log("ok: "+result.result.ok, "modified: "+ result.result.nModified);
        if(result.result.ok === 1 && result.result.nModified === 1){
            const res = await addStylistToSalon(userId, salonObjId);
            return  res.ok,res.nModified;
        }else{
            return  401 + " error accepting";
        }
        
    }catch(err){
        throw new Error(err);
    }
}



const addStylistToSalon = async (userId, salonObjId) => {
    const stylist = await getUser(userId);
    //console.log()
    let stylistId = await counters.getNextStylistInCount(salonObjId);
    stylistId = stylistId;

    if(stylist == "[]"){
        console.log("   NO SUCH USER "+stylist)
        return -1;
    }
    console.log(" SUCH USER "+stylist[0]._id)
    try{
        const db = await generic.getDatabaseByName("afroturf");
        const result = await db.db.collection("salons").update({
            $and:[{_id: ObjectId(salonObjId)}, {"stylists.userId": {$ne: stylist[0]._id}}]},
            {$addToSet: {stylists:schema.stylistJSON(stylist[0], stylistId, stylist[0]._id )}}
        );
        db.connection.close();
        console.log("ok: "+result.result.ok, "modified: "+ result.result.nModified);
        return  {ok : result.result.ok, nModified:  result.result.nModified}
    }catch(err){
        throw new Error(err);
    }
}

const getUser = async (userId)=>{
    try{
        const db = await generic.getDatabaseByName("afroturf");
        const result = await db.db.collection("users").aggregate([{$match: {_id:ObjectId(userId)} }, {$project: {username:1, fname:1, reviewsDocId:1, gender:1, avatar:1}}]).toArray();
        db.connection.close();
       
        return  JSON.parse(JSON.stringify(result));
    }catch(err){
        throw new Error(err);
    }
}

createSalon("5b7dd26c21a41857ccfcd7a2", "JEFFDOWNTOWN", "Pretoria, 0083, The Red Street", "The red Street", [32.212121,21.12313], "Haircuts", 1)
module.exports ={
    createSalon,
    updateSalon,
    acceptStylistRequest
}