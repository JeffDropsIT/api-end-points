const bcrypt = require('bcryptjs');
const generic = require("./generic");
const salt = bcrypt.genSaltSync(10);
const ObjectId = require('mongodb').ObjectID;
const empty = require("is-empty");
const TokenGenerator = require('uuid-token-generator');




const isUser = async (ctx) => {
    const username = ctx.query.username;
    if(!username){
        ctx.status = 422;
        ctx.message = "missing parameter"
        ctx.body = {};
        return;
    }
    const status = await generic.checkIfUserNameEmailPhoneExist(ctx.query.username);
    if( status === 0){ 
        console.log("username or phone number does not exit"+ username);
        ctx.message = "username or phone number does not exit"+ username;
        ctx.status = 401
        ctx.body = {status:0};
    }else{
        ctx.status = 200;
        ctx.body = {status:1}
    }
}
const getUserAuth = async (username)=>{
    try{
        const status = await generic.checkIfUserNameEmailPhoneExist(username);
        if( status === 0){ 
            console.log("username or phone number does not exit"+ username);
            return {res:401}; //user not found
        }
        const db = await generic.getDatabaseByName("afroturf");
        const result = await db.db.collection("users").aggregate([{$match: {$or:[{username:username}, {email:username}, {phone:username}]}}])
        const arrResults = await result.toArray();
        db.connection.close();
        //console.log(JSON.parse(JSON.stringify(arrResults[0])))
        return  {res:200, data:JSON.parse(JSON.stringify(arrResults[0]))};
    }catch(err){
        throw new Error(err);
    }
}

const generateToken = async () => {
    const tokgen2 = new TokenGenerator(256, TokenGenerator.BASE62);
    let token = await tokgen2.generate();
    console.log(token);
    let date = new Date();
    let month = date.getMonth();
    date.setMonth(month + 1 )
    return token+":"+date;
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
    //try{
        let salonProfile = [];
        let res = await isUserSalonOwner(userId);
        if(!res.bool){ 
            return 404; //user not found
        }
        const salonList = await res.result.salons;
        const salons  = await getSalons(salonList);
        await salonProfile.push(salons);
        await console.log("----- getSalonProfile data ----")
        await console.log(salonProfile)
        return  await salonProfile;
    // }catch(err){
    //     throw new Error(err);
    // }
}
//test
//getSalonProfile("5b8f75f4de5f7e1964ca5137");

const getUserProfile = async (user) => {
    //try{
        console.log("getUserProfile ")
        let profile = [];
        profile.push(user)
        const status = await generic.checkIfUserNameEmailPhoneExist(user.username);
        if( status === 0){ 
            console.log("username or phone number does not exit"+ user.username);
            return {res:404}; //user not found
        }
        const review = await getReview(user._id, user.reviewsDocId);
        profile.push(review);
        if(!user.roomDocIdList){
            return  {res:200, data:profile};
        }
        const rooms  = await getUsersRooms(user._id, user.roomDocIdList);
        profile.push(rooms);
        console.log("profile ", profile)
        return  {res:200, data:profile};
    // }catch(err){
    //     throw new Error(err);
    // }
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
    console.log("roomDocIdList ", roomDocIdList)
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
    console.log("password", password)
    const user = await getUserAuth(username);
    console.log(user)
    if(user.res === 401){
        ctx.status = 401;
        ctx.body = {};
        return;
    }
    console.log("user info",user.data["password"])
    const isPassword = await bcrypt.compareSync(password, user.data.password);
    if(isPassword){
        console.log("password correct"); //ok
        delete user.password
        ctx.status = 200;
        ctx.body =  user.data;
    }else{
        console.log("password incorrect "+password);
        ctx.status = 401;
        ctx.message = "unauthorized/creds incorrect"
    }


}

const getAllUserData = async (ctx) =>{
    console.log("getAllUserData");
    const username = ctx.request.body.username;
    const password = ctx.request.body.password;
    const user = await getUserAuth(username);
    if(user.res === 401){
        ctx.status = 401;
        ctx.body = {};
        return;
    }
    const isPassword = await bcrypt.compareSync(password, user.data.password);
    if(isPassword){
        console.log("password correct"); //ok
        const res = await getUserProfile(user.data);
      
        if(res.res === 401 ){
            ctx.status = 401
            ctx.message = "unauthorized/creds incorrect"
            ctx.body =  {} //unauthorized 
            return;
        }
        const salonData = await getSalonProfile(user.data._id);
        if(salonData === 404){
            ctx.status = 200;
            let token = {token: await generateToken()}
            ctx.body =  {userData:res.data, salonData:[], token};
            return;
        }
        ctx.status = 200;
        let token = {token: await generateToken()}
        ctx.body =  {userData:res.data, salonData:salonData, token};
    }else{
        console.log("password incorrect "+password);
        ctx.status = 401
        ctx.message = "unauthorized/creds incorrect"
        ctx.body =  {} //unauthorized 
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
    getRoom,
    getUserAuth,
    generateToken,
    isUser
}