const mongodb = require("mongodb");
const computation = require("./computations");

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
// get nearest salons

const getNearestSalons = async (Userlocation, radius, limit) => {

  try {
    
    const db = await getDatabaseByName("afroturf");
    const collection = await db.db.collection("salons");

    await collection.ensureIndex({"location.coordinates" : "2dsphere"})
    const nearestSalonsCursor = await collection.aggregate([

      {
        $geoNear: {
          near: {coordinates :Userlocation}, 
          distanceField: "dist.calculated",
          maxDistance: radius,
          includeLocs: "distance.location",
          num: limit,
          spherical: true

        }
      }

    ]);
    const nearestSalons = await nearestSalonsCursor.toArray();
    db.connection.close();
    return JSON.stringify(nearestSalons);
  } catch(err){
    throw new Error(err);
    db.connection.close();
  } 

}
//get salon by Name
const getSalonByName = async (name) => {
  
   try{
      const db = await getDatabaseByName("afroturf");
      const salonCursor = await db.db.collection("salons").find({name:name});
      const salon = await salonCursor.toArray();

      console.log("INSIDE connect", JSON.stringify(salon));
      db.connection.close();
      return JSON.stringify(salon);
      


   }catch(err){
    throw new Error(err);
   }   
  };//get salon by Name shallow
  const getSalonByNameShallow = async (name) => {
    
     try{
        const db = await getDatabaseByName("afroturf");
        const salonCursor = await db.db.collection("salons").aggregate([{
          $project: {name: 1, location:1, rating: 1}
        }]);
        const salon = await salonCursor.toArray();
  
        //console.log("INSIDE connect", JSON.stringify(salon));
        db.connection.close();
        return JSON.stringify(salon);
        
  
  
     }catch(err){
      throw new Error(err);
     }   
    };

  // //Eg 2). {Baseurl}/salons?location=25,25&
  // //radius=5&filters{ “gender”: “male”, “rating”:”>3”}&limit10
const getSalonByStylistRatingGender = async(rating, gender) => {

  const db = await getDatabaseByName("afroturf");
  const stylistCursor = await db.db.collection("salons").aggregate([
    {
      $project: { stylists: 
  
    
        {
          $filter: {
            input: "$stylists", 
            as: "this", 
            cond: {$and: [{$gte : ["$$this.rating", rating]}, {$eq : ["$$this.gender", gender]}] }
          }
        }

      }
    }
  ]);
  const stylist = await stylistCursor.toArray();
  db.connection.close();
  return JSON.stringify(stylist);

};

//return salon_id and list of stylist with the input rating
const getSalonByStylistRating = async(rating) => {

  const db = await getDatabaseByName("afroturf");
  const stylistCursor = await db.db.collection("salons").aggregate([
    {
      $project: { stylists: 
  
    
        {
          $filter: {
            input: "$stylists", 
            as: "this", 
            cond: {$gte : ["$$this.rating", rating]}
          }
        }

      }
    }
  ]);
  const stylist = await stylistCursor.toArray();
  db.connection.close();
  return JSON.stringify(stylist);

};



//get salon by Name shallow query
const getAllSalonShallow = async () => {
  
  try{
     const db = await getDatabaseByName("afroturf");
     const salonCursor = await db.db.collection("salons").aggregate([{
       $project: {name: 1, location:1, rating: 1}
     }])
     const salon = await salonCursor.toArray();

     //console.log("INSIDE connect", JSON.stringify(salon));
     db.connection.close();
     return JSON.stringify(salon);
     


  }catch(err){
   throw new Error(err);
  }
     
   };

//get all salons
const getAllSalon =  async () => {
  
  try{
     const db = await getDatabaseByName("afroturf");
     const salonCursor = await db.db.collection("salons").find({});
     const salon = await salonCursor.toArray();

     //console.log("INSIDE connect", JSON.stringify(salon));
     db.connection.close();
     return JSON.stringify(salon);
     


  }catch(err){
   throw new Error(err);
  }
     
   };



  

  
/* TESTS      START    */

// getAllSalonShallowQuery().then(k => {console.log(k)});
// getSalonByStylistRatingGender(5, "female").then(k => {console.log(k)});
// const data = getDatabaseByName("afroturf");
// getSalonByName("HeartBeauty");
// getAllSalon();\
//getAllSalonShallow("HeartBeaty").then(k => {console.log(k)});
const cor1 =  [ -21.067155,  23.977487 ];
getNearestSalons(cor1, 211, 10).then(k => console.log(k));

/* TESTS      END    */



















































