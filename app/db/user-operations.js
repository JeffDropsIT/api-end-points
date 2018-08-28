const auth = require("./authentication");
const awsHandler = require('../../aws/aws-handler');
const generic = require("./generic");
const counters = require("./counters");
const schema = require("./schema/schema");
const ObjectId = require('mongodb').ObjectID;




const createUser = async (fname, lname, password, username, phone, email) =>{
    email = "afroturf@gmail.com"; //default
    
    try {
        console.log("--createusers--");
        const status = await generic.checkIfUserNameEmailPhoneExist(username) ;
        if(status === 1){ 
            console.log("username or phone number already exist, 409: "+ username);
            return 409 //conflict;
        }
        const hash = await auth.hashPassword(password);
        await console.log("HASH: ",hash)
        const user = await {fname: fname, lname: lname, password:hash, username: username, phone: phone, email:email, created: new Date(), avatar:[]};
    
        const result = await generic.insertIntoCollection("afroturf", "users",user)
        console.log("ok: "+result.ok, "_id "+ result._id +" type: "+typeof(result._id));
        let _id;
        _id = result.ok == 1 ?  result._id: null;
        if(_id !==null){
            console.log("Creating users chat room. . .and reviewsDoc :id "+_id)
            generic.createNewUsersPrivateChatRoom(_id, username, "users");
            awsHandler.createUserDefaultBucket(fname).then(p => updateUser({bucketName: p}, _id));
            generic.createReviewsDoc(_id, "users");
        }else{
            return -1;
        }
        
        return  await result.ok === 1 ? 200: 401;
    } catch (error) {
        throw new Error(error);
    }
};



const updateUser = async (userData, userId) =>{

    console.log("--updateUser--");
    const result = await generic.updateCollectionDocument("afroturf", "users",userData,userId).then(p => console.log("success "+p));
    console.log("ok: "+result, "modified: "+ result);
    return  1;
};



const followSalon = async (ctx) =>{
    try {
        const userId = ctx.query.userId, salonObjId = ctx.query.salonObjId;
        const db = await generic.getDatabaseByName("afroturf");
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
const sendMessage = async (ctx) =>{
    const payload = ctx.query.payload, from = ctx.query.from, roomDocId = ctx.query.roomDocId, type = parseInt(ctx.query.type);
    let messageId = await counters.getNextMessageCount(roomDocId);
    messageId = messageId.toString();
    try {
        const message = await schema.createNewMessageForm(messageId, payload, from, type);
        const db = await generic.getDatabaseByName("afroturf");
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

const sendReview = async (ctx) =>{
    console.log("sendReview")
    const payload = ctx.query.payload, from = ctx.query.from, to = ctx.query.to, rating = parseInt(ctx.query.rating);
    let reviewIdIn = await counters.getNextReviewInCount(to);
    reviewIdIn = reviewIdIn.toString();
    let reviewIdOut = await counters.getNextReviewOutCount(from);
    reviewIdOut = reviewIdOut.toString();
    try {
        const reviewIn = await schema.createNewReviewInForm(from, payload, rating, reviewIdIn);
        const db = await generic.getDatabaseByName("afroturf");
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


module.exports = {
    createUser,
    updateUser,
    followSalon,
    sendReview,
    sendMessage,
}