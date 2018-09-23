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

const isUserSalonOwner = async (userId) => {
    //check if userhas salon
    try{
        
        console.log("isUserSalonOwner")
        const db = await generic.getDatabaseByName("afroturf");
        const result = await db.db.collection("users").aggregate([{$match:{$and : [{"_id":ObjectId(userId)}, {"salons.role": "salonOwner"}]}}, 
        {$project : {salons: 1}}
    
    ]) //user reviews doc
        const arrResults = await result.toArray();
        db.connection.close();
        if(!empty(arrResults)){
                
            await console.log(JSON.parse(JSON.stringify(arrResults[0])));
            let res = {bool: true, result: await JSON.parse(JSON.stringify(arrResults[0]))};
            return  res;
        }else{
            
            console.log("No document found no salons for user")
            let res = {bool: false, result:[]};
            return res;
        }
    }catch(err){
        throw new Error(err);
    }
}

const getSalon = async (salonObjId) => {
    try{
        
        console.log("getSalon")
        const db = await generic.getDatabaseByName("afroturf");
        const result = await db.db.collection("salons").aggregate([{$match:{$and : [{"_id":ObjectId(salonObjId)}]}}]) //user reviews doc
        const arrResults = await result.toArray();
        db.connection.close();
        if(!empty(arrResults)){
                
            await console.log(JSON.parse(JSON.stringify(arrResults[0])));
            let res = await JSON.parse(JSON.stringify(arrResults[0]));
            return res;
        }else{
            
            console.log("No document found getSalon")
            let res = [];
            return res;
        }
    }catch(err){
        throw new Error(err);
    }
}


//test
//isUserSalonOwner("5b8f75f4de5f7e1964ca5137");
const getSalons = async (salonList) =>{
    console.log("getSalons")
    try{
        let salonCollection = [];
        for ( let element of salonList){
            let salon = await [ await getSalon(element.salonObjId)];
            let reviews = await [await getReview(salon[0]._id, salon[0].reviewsDocId)];
            let rooms  = await getUsersRooms(salon[0]._id, salon[0].roomDocIdList);
            await salon.push(rooms)
            await salon.push(reviews)
            await console.log(salon);
            await salonCollection.push(salon);
        }
        console.log("DONE")
        return await salonCollection;
    }catch(err){
        throw new Error(err);
    }
}

//test
//getSalon("5b8f7f7b0e22dc20a4588e27").roomDocIdList
const getSalonProfile = async(userId) =>{
    try{
        let salonProfile = [];
        let res = await isUserSalonOwner(userId);
        if(!res.bool){ 
            console.log("Not salon owner"+ user.username);
            return 404; //user not found
        }
        const salonList = await res.result.salons;
        const salons  = await getSalons(salonList);
        await salonProfile.push(salons);
        await console.log("----- getSalonProfile data ----")
        await console.log(salonProfile)
        return  await salonProfile;
    }catch(err){
        throw new Error(err);
    }
}
//test
//getSalonProfile("5b8f75f4de5f7e1964ca5137");

const getUserProfile = async (user) => {
    try{
        let profile = [];
        
        const status = await generic.checkIfUserNameEmailPhoneExist(user.username);
        if( status === 0){ 
            console.log("username or phone number does not exit"+ user.username);
            return 404; //user not found
        }
        const review = await getReview(user._id, user.reviewsDocId);
        const rooms  = await getUsersRooms(user._id, user.roomDocIdList);
        profile.push(review);
        profile.push(rooms);
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
        const result =  db.db.collection("reviews").aggregate([{$match: {$or:[{"userId":userId}, {"_id":reviewsDocId}]}}]) //user reviews doc
        const arrResults =  result.toArray();
        const review  =  JSON.parse(JSON.stringify(await arrResults));
        console.log(review)
        db.connection.close();
        return review;
    }catch(err){
        throw new Error(err);
    }
}
//test
//getReview("5b95231903d3825174322a50", "5b95231c03d3825174322a53");

const getRoom = async (userId, roomDocId) => {
    try{
        
        console.log("getRoom")
        const db = await generic.getDatabaseByName("afroturf");
        const result =  db.db.collection("rooms").aggregate([{$match:{$and : [{"_id":ObjectId(roomDocId)}, {"members": { $in: [userId, "members"]}}]}}]) //user reviews doc
        const arrResults = result.toArray();
        db.connection.close();
        if(!empty(arrResults)){
                
            //console.log(JSON.parse(JSON.stringify( await arrResults)))
            return  JSON.parse(JSON.stringify(await arrResults));
        }else{
            
            console.log("No document found getRoom")
            return -1;
        }
    }catch(err){
        throw new Error(err);
    }
}

//test 
//getRoom("5b95231903d3825174322a50","5b95231b03d3825174322a51");

const getUsersRooms = async (userId, roomDocIdList) => {

    try{
        let roomsCollection = [];
    
        for(let element of roomDocIdList){
            let roomObj = await getRoom(userId, element.roomDocId);
            console.log(roomObj);
            roomsCollection.push(roomObj);
        }
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
        ctx.body =  JSON.parse(JSON.stringify({res: 200, message:"successfully performed operation ", data:[user]}));
    }else{
        console.log("password incorrect "+password);
        ctx.body = JSON.parse(JSON.stringify({res: 401, message:"successfully performed operation ", data:[] })) //unauthorized 
    }


}

const getAllUserData = async (ctx) =>{
    console.log("getAllUserData");
    const username = ctx.request.body.username;
    const password = ctx.request.body.password;
    const user = await getUserAuth(username);
    const isPassword = await bcrypt.compareSync(password, user.password);
    if(isPassword){
        console.log("password correct"); //ok
        delete user.password
        const userData = await getUserProfile(user);
        const salonData = await getSalonProfile(user._id)
        ctx.body =  JSON.parse(JSON.stringify({res: 200, message:"successfully performed operation ", data:[userData, salonData]}));
    }else{
        console.log("password incorrect "+password);
        ctx.body =  JSON.parse(JSON.stringify({res: 401, user:[]})) //unauthorized 
    }


}

//simple tests
//getUserAuth("JamJamCole").then( user  => {console.log("password: "+user.password + " username: "+user.username)});

//authenticateUser("JamJamCole", "", "", "password123")


module.exports = {
    hashPassword, 
    authenticateUser,
    getAllUserData,
    getReview,
    getRoom
}