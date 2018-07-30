const mongodb = require("mongodb");

let mongodbClient = mongodb.MongoClient;
let url = 'mongodb://admin:password123@ds153841.mlab.com:53841/afroturf';


//get salon by Name

const getSalonByName = async (name) => {
  
   try{
      const db = await getDatabaseByName("afroturf");
      const salonCursor = await db.db.collection("salons").find({name:name});
      const salon = await salonCursor.toArray();

      console.log("INSIDE connect", JSON.stringify(salon[0].name));
      db.connection.close();
      return JSON.stringify(salon[0]);
      


   }catch(err){
    throw new Error(err);
   }
      
    };

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

//get all salons
const getAllSalon =  async () => {
  
  try{
     const db = await getDatabaseByName("afroturf");
     const salonCursor = await db.db.collection("salons").find({});
     const salon = await salonCursor.toArray();

     console.log("INSIDE connect", JSON.stringify(salon));
     db.connection.close();
     return JSON.stringify(salon);
     


  }catch(err){
   throw new Error(err);
  }
     
   };
// const data = getDatabaseByName("afroturf");

//getSalonByName("HeartBeauty");
getAllSalon();

