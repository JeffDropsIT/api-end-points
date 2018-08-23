const bcrypt = require('bcryptjs');
const generic = require("./generic");
const salt = bcrypt.genSaltSync(10);


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

const authenticateUser = async (username,password) =>{
    const user = await getUserAuth(username);
    const isPassword = await bcrypt.compareSync(password, user.password);
    if(isPassword){
        console.log("password correct"); //ok
        delete user.password
        return JSON.parse(JSON.stringify({res: 200, user:user}));
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