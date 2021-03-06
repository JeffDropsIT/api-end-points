const auth = require("./authentication");
const awsHandler = require('../../aws/aws-handler');
const generic = require("./generic");
const counters = require("./counters");
const schema = require("./schema/schema");
const ObjectId = require('mongodb').ObjectID;
const notify = require("..//push-notification/notification");
const empty = require("is-empty");



const createUser = async (ctx) =>{
    email = "afroturf@gmail.com"; //default

    const username = ctx.request.body.username;
    const password = ctx.request.body.password;
    const fname = ctx.request.body.fname;
    //try {
        console.log("--createusers--");
        console.log(ctx)
        const status = await generic.checkIfUserNameEmailPhoneExist(username) ;
        if(status === 1){ 
            console.log("username or phone number already exist, 409: "+ username);
            ctx.status = 409
            ctx.body = {}
            return 409 //conflict;
        }
        const hash = await auth.hashPassword(password);
        await console.log("HASH: ",hash)
        let lname = "", phone = "";
        const user = await {fname: fname, lname: lname, password:hash, username: username, phone: phone, email:email, created: new Date(), avatar:[]};
    
        const result = await generic.insertIntoCollection("afroturf", "users",user)
        console.log("ok: "+result.ok, "_id "+ result._id +" type: "+typeof(result._id));
        let _id;
        _id = result.ok == 1 ?  result._id: null;
        if(_id !==null){
            console.log("Creating users chat room. . .and reviewsDoc :id "+_id)
            //generic.createNewUsersPrivateChatRoom(_id, username, "users");
            awsHandler.createUserDefaultBucket(fname).then(p => updateUser({bucketName: p}, _id));
            generic.createReviewsDoc(_id, "users");
        }else{
            ctx.status = 401
            ctx.body =  {};
        }
        let data = result.ok === 1 ? {res: 200,  message: "successfully performed operation"} : {res:401,  message: "Ops something went wrong, username already exist"};
        ctx.status = data.res
        delete user["password"];
        user["_id"] = _id;
        ctx.status = 200;
        let userData = await auth.getUserAuth(username);
        delete userData.data["password"];
        let token = {token: await auth.generateToken()}
        ctx.body =  {userData:userData.data, token};
    // } catch (error) {
    //     throw new Error(error);
    // }
};



const updateUser = async (ctx) =>{
    let userData = ctx.request.body, userId = ctx.request.body._id;
    delete userData._id;
    console.log("--updateUser--");
    const result = await generic.updateCollectionDocument("afroturf", "users",userData,userId);
    console.log("ok: "+result.ok, "modified: "+ result.modified);
    let data =  result.modified === 1 && result.ok === 1 ? {res: 200,  message: "successfully performed operation"} : {res:401,  message: "Ops something went wrong, failed to update user"};
    ctx.status = data.res;
    ctx.body = {}
    
};



const followSalon = async (ctx) =>{
    try {
        console.log(ctx.request.body);
        const userId = ctx.request.body._id, salonObjId = ctx.request.body.salonObjId;
        const id = ctx.params.id;
        console.log("ID: ", id);
        const db = await generic.getDatabaseByName("afroturf");
        const result = await db.db.collection("users").update(
            {$and: [{"_id": ObjectId(userId)}, {"following.salonObjId":{$ne:salonObjId}}]},
            {$addToSet: {following:{salonObjId:salonObjId}}},
        );
        if(result.result.ok === 1 && result.result.nModified === 1){
            console.log("Adding to followers")
            const result = await db.db.collection("salons").update(
                {$and: [{"salonId": parseInt(id)}, {"_id": ObjectId(salonObjId)}]},
                {$addToSet: {followers:{userId:userId}}},
            );
        }
        db.connection.close();
        console.log(result.result.ok, result.result.nModified);
        if(result.result.nModified === 0 && result.result.ok === 1){
            console.log("failed to insert possible causes salon already following");
            //handle error accordingly
        }
        
        const res =  result.result.ok && result.result.nModified === 1 ?  {res: 200,  message: "successfully performed operation"} : {res: 401,  message: "failed to perform operation"};

        if(res.res == 200){
            const clientId = await generic.getClientId(salonObjId);
            notify.notifyUser("followed", clientId, {userId:userId, message:"booking from user: "+userId});
            //notify all stylist that the is a booking
        }else{
            //notify user unsuccessful
        }
        ctx.status = res.res
        ctx.body = {};
    

    } catch (error) {
        console.log("failed to followSalon. . .\n salonObjId: "+salonObjId)
        throw new Error(error);
    }
}
const getUsersRoomDocId = async (members) =>{
    try {
        console.log("getUsersRoomDocId");
        const db = await generic.getDatabaseByName("afroturf");
        const result = await db.db.collection("rooms").aggregate([
            {$match: {$and : [ {"members": { $all: members}}, {"roomType": "private"}]}},
            {
            $project: {
                messages:1, _id: 1
             }
            }
        ]);
        const resultArray = await result.toArray();
        const resultJson =  JSON.parse(JSON.stringify(resultArray));
       // console.log(resultJson[0]);
        if(!empty(resultJson)){
            return resultJson;
        }else{
            //create room for members
            console.log("Room for users does not exist");
            
            const res = await generic.createNewUsersPrivateChatRoom("users",members);
            if(res === 1){
                return await getUsersRoomDocId(members);
            }
        }
        
    } catch (error) {
        throw new Error(error);
    }
}


//test
//getUsersRoomDocId(["5b8f7f7b0e22dc20a4588e27", "5b8f75f4de5f7e1964ca5137" ]);

const sendMessage = async (ctx) =>{
     try {
        const payload = ctx.request.body.payload, from = ctx.request.body.from, to = ctx.request.body.to, type = ctx.request.body.type;
        let roomDocId = await getUsersRoomDocId([from, to]);
        console.log("roomDocId 1: ",roomDocId[0]._id);
        roomDocId = roomDocId[0]._id;
        let messageId = await counters.getNextMessageCount(roomDocId);
        messageId = messageId.toString();
        
        console.log("roomDocId 2: ",roomDocId);
        const message = await schema.createNewMessageForm(messageId, payload, from, to, type);
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
        let res2 = result.result.ok && result.result.nModified === 1 ?  {res: 200,  message: "successfully performed operation"} : {res: 401,  message: "failed to perform operation"};

        if(res2.res == 200){
            const clientId = await generic.getClientId(to);
            notify.notifyUser("messaged", clientId, {userId:from, message:"review from user: "+from});
            //notify all stylist that the is a booking
        }else{
            //notify user unsuccessful
        }
        ctx.status = res2.res;
        ctx.body = {}; // 


    } catch (error) {
        console.log("failed to sendMessge. . .\n messageId: "+messageId.toString()+" payload: "+payload)
        throw new Error(error);
    }
   

}

const sendReview = async (ctx) =>{
    console.log("sendReview")
    const payload = ctx.request.body.payload, reviewer = ctx.request.body.reviewerId,reviewerName = ctx.request.body.reviewerName, to = ctx.request.body.to, rating = ctx.request.body.rating;
    let reviewIdIn = await counters.getNextReviewInCount(to);
    reviewIdIn = reviewIdIn.toString();
    let reviewIdOut = await counters.getNextReviewOutCount(reviewer);
    reviewIdOut = reviewIdOut.toString();
    console.log("sendReview: ",reviewer)
    //try {
        const reviewIn = await schema.createNewReviewInForm(reviewer, payload, rating, reviewIdIn, reviewerName);
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
        const reviewOut = await schema.createNewReviewOutForm(to, payload, rating, reviewIdOut, reviewerName);
        const result = await db.db.collection("reviews").update(
            {$and: [{"userId": reviewer}, {"reviewsOut.reviewId" :{$ne: reviewIdOut}} ]},
            {$addToSet: {reviewsOut:reviewOut}},
        );
        db.connection.close();
        console.log(result.result.ok, result.result.nModified);
        if(result.result.nModified === 0 && result.result.ok ===1){
            console.log("duplicate id present");
            //handle error accordingly
        }
        const res =  { ok: result.result.ok, modified: result.result.nModified, ok2: resultOne.result.ok, modified2: resultOne.result.nModified};

        const res2 =  res.ok && res.ok2 && res.modified && res.modified2 === 1 ?  {res: 200,  message: "successfully performed operation"} : {res: 401,  message: "failed to perform operation"};
        if(res2.res == 200){
            const clientId = await generic.getClientId(salonObjId);
            notify.notifyUser("reviewed", clientId, {userId:userId, message:"review from user: "+userId});
            //notify all stylist that the is a booking
        }else{
            //notify user unsuccessful
        }
        ctx.status = res2.res;
        ctx.body = {}; // 

    // } catch (error) {
    //     console.log("failed to sendReview. . .\n sendReview: "+reviewOut.toString())
    //     throw new Error(error);
    // }
   

}




module.exports = {
    createUser,
    updateUser,
    followSalon,
    sendReview,
    sendMessage,
}