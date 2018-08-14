const mongodb = require("mongodb");
const METERS_TO_KM = 1000;

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





