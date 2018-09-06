const bcrypt = require('bcryptjs');
const generic = require("./generic");
const salt = bcrypt.genSaltSync(10);
const ObjectId = require('mongodb').ObjectID;
const empty = require("is-empty");

const getUserAuth = async (username)=>{
    try{
        const status = await generic.checkIfUserNameEmailPhoneExist(username);
        if( status === 0){ 
            console.log("username or phone number does not exit"+ username);
            return 404; //user not found
        }
        const db = await generic.getDatabaseByName("afroturf");
        const result = await db.db.collection("users").aggregate([{$match: {$or:[{username:username}, {email:username}, {phone:username}]}}])
        const arrResults = await result.toArray();
        db.connection.close();
        //console.log(JSON.parse(JSON.stringify(arrResults[0])))
        return  JSON.parse(JSON.stringify(arrResults[0]));
    }catch(err){
        throw new Error(err);
    }
}

const hashPassword = async (password) =>{
    console.log("hashPassword. . .begin")
    const hash = await bcrypt.hashSync(password, salt);
    //const hash = await crypto.createHash("sha256").update(password).digest("hex");
    console.log("hashPassword. . .done")
    return hash;
};


const getUserProfile = async (user) => {
    try{
        let profile = [];
        if( status === 0){ 
            console.log("username or phone number does not exit"+ username);
            return 404; //user not found
        }
        const review = await getReview(user._id.$oid, user.reviewsDocId);
        const rooms  = await getUsersRooms(user._id.$oid, user.roomDocIdList);
        profile.push(review);
        profile.push(rooms);
        db.connection.close();
        console.log(profile)
        return  profile;
    }catch(err){
        throw new Error(err);
    }
}
const getReview = async (userId, reviewsDocId) => {
    try{
        console.log("getReview")
        const db = await generic.getDatabaseByName("afroturf");
        const result = await db.db.collection("reviews").aggregate([{$match: {$or:[{"userId":userId}, {"_id":reviewsDocId}]}}]) //user reviews doc
        const arrResults = await result.toArray();
        const review  = await JSON.parse(JSON.stringify(arrResults));
        console.log(review)
        db.connection.close();
        return review;
    }catch(err){
        throw new Error(err);
    }
}
//test
//getReview("5b8fb94ad012570a1c7f0848", "5b8fb94bd012570a1c7f084a");

const getRoom = async (userId, roomDocId) => {
    try{
        
        console.log("getRoom")
        const db = await generic.getDatabaseByName("afroturf");
        const result = await db.db.collection("rooms").aggregate([{$match:{$and : [{"_id":ObjectId(roomDocId)}, {"members": { $in: [userId, "members"]}}]}}]) //user reviews doc
        const arrResults = await result.toArray();
        db.connection.close();
        if(!empty(arrResults)){
                
            await console.log(JSON.parse(JSON.stringify(arrResults[0])))
            return  await JSON.parse(JSON.stringify(arrResults[0]));
        }else{
            
            console.log("No document found")
            return -1;
        }
    }catch(err){
        throw new Error(err);
    }
}

//test 
//getRoom("5b8f75f4de5f7e1964ca5137","5b8fa0604d811e307ce3f646");

const getUsersRooms = async (userId, roomDocIdList) => {

    try{
        let roomsCollection = [];
        roomDocIdList.forEach( async element => {
            let roomObj = await getRoom(userId, element.roomDocId);
            console.log(roomObj);
            roomsCollection.push(roomObj);

        });
        console.log("DONE")
        return roomsCollection;
    }catch(err){
        throw new Error(err);
    }

}

//test
// getUsersRooms("5b8f75f4de5f7e1964ca5137",[{
//     "roomDocId": "5b8fa0604d811e307ce3f646"
// },{ "roomDocId":"5b7e8e23d59eae1de05d6985"}] )
const authenticateUser = async (ctx) =>{
    
    const username = ctx.request.body.username;
    const password = ctx.request.body.password;
    const user = await getUserAuth(username);
    const isPassword = await bcrypt.compareSync(password, user.password);
    if(isPassword){
        console.log("password correct"); //ok
        delete user.password
        const userData = await getUserProfile(user);
        return JSON.parse(JSON.stringify({res: 200, user:user, userData:userData}));
    }else{
        console.log("password incorrect "+password);
        return JSON.parse(JSON.stringify({res: 401, user:[]})) //unauthorized 
    }


}

//simple tests
//getUserAuth("JamJamCole").then( user  => {console.log("password: "+user.password + " username: "+user.username)});

//authenticateUser("JamJamCole", "", "", "password123")


module.exports = {
    hashPassword, 
    authenticateUser,
}