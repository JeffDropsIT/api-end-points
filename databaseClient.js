const mongodb = require("mongodb");


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

    await collection.ensureIndex({"location.coordinates" : "2dsphere"});
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
const getSalonByName = async (name, userlocation, radius, limit) => {
  
   try{
      const db = await getDatabaseByName("afroturf");
      const salonCursor = await db.db.collection("salons").aggregate([ {
        $geoNear: {
          near: { coordinates :userlocation}, 
          distanceField: "distance.calculated",
          maxDistance: radius,
          query: {name: name},
        
          num: limit,
          spherical: true

        }
      }]);
      const salon = await salonCursor.toArray();

      console.log("INSIDE connect", JSON.stringify(salon));
      db.connection.close();
      return JSON.stringify(salon);
      


   }catch(err){
    throw new Error(err);
   }   
  };
  
  //get salon by salonId
const getSalonBySalonId = async (salonId, userlocation, radius) => {
  
  try{
     const db = await getDatabaseByName("afroturf");
     const salonCursor = await db.db.collection("salons").aggregate([ {
       $geoNear: {
         near: { coordinates :userlocation}, 
         distanceField: "distance.calculated",
         maxDistance: radius,
         query: {salonId: salonId},
         spherical: true

       }
     }]);
     const salon = await salonCursor.toArray();

     console.log("INSIDE connect", JSON.stringify(salon));
     db.connection.close();
     return JSON.stringify(salon);
     


  }catch(err){
   throw new Error(err);
  }   
 };
  // get salon by salonId shallow getSalonBySalonIdShallow
  const getSalonBySalonIdShallow = async (salonId, Userlocation, radius) => {
    
    try{
       const db = await getDatabaseByName("afroturf");
       await db.db.collection("salons").ensureIndex({"location.coordinates" : "2dsphere"});
       const salonCursor = await db.db.collection("salons").aggregate([ {
         $geoNear: {
           near: { coordinates :Userlocation}, 
           distanceField: "distance.calculated",
           maxDistance: radius,
           query: {salonId: salonId},
           spherical: true
 
         }
       }, 
       {
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

  //get salon by Name shallow
  const getSalonByNameShallow = async (salonname, Userlocation, radius, limit) => {
    
     try{
        const db = await getDatabaseByName("afroturf");
        await db.db.collection("salons").ensureIndex({"location.coordinates" : "2dsphere"});
        const salonCursor = await db.db.collection("salons").aggregate([ {
          $geoNear: {
            near: { coordinates :Userlocation}, 
            distanceField: "distance.calculated",
            maxDistance: radius,
            query: {name: salonname},
            num: limit,
            spherical: true
  
          }
        }, 
        {
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
const getSalonByStylistRatingGender = async(userlocation, radius, limit, rating, gender) => {

  const db = await getDatabaseByName("afroturf");
  await db.db.collection("salons").ensureIndex({"location.coordinates" : "2dsphere"});
  const stylistCursor = await db.db.collection("salons").aggregate([
    {
      $geoNear:{
        near: {coordinates: userlocation},
        distanceField: "distance.calculated",
        maxDistance: radius,
        num: limit,
        spherical: true
      }

    },
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
// get stylist by name and other

const getSalonByStylistNameRatingGender = async(userlocation, radius, name,limit, rating, gender) => {

  const db = await getDatabaseByName("afroturf");
  await db.db.collection("salons").ensureIndex({"location.coordinates" : "2dsphere"});
  const stylistCursor = await db.db.collection("salons").aggregate([
    {
      $geoNear:{
        near: {coordinates: userlocation},
        distanceField: "distance.calculated",
        maxDistance: radius,
        num: limit,
        spherical: true
      }

    },
    {
      $project: { stylists: 
  
    
        {
          $filter: {
            input: "$stylists", 
            as: "this", 
            cond: {$and: [{$gte : ["$$this.rating", rating]}, {$eq : ["$$this.gender", gender]}, {$eq : ["$$this.name", name]}] }
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
const getSalonByStylistRating = async(userlocation, radius, limit, rating) => {

  const db = await getDatabaseByName("afroturf");
  await db.db.collection("salons").ensureIndex({"location.coordinates" : "2dsphere"});
  const stylistCursor = await db.db.collection("salons").aggregate([



    {
      $geoNear:{
        near: {coordinates: userlocation},
        distanceField: "distance.calculated",
        maxDistance: radius,
        num: limit,
        spherical: true
      }

    },

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



//get salons nearest shallow query
const getAllNearestSalonsShallow = async (Userlocation, radius) => {
  
  try{
     const db = await getDatabaseByName("afroturf");
     await db.db.collection("salons").ensureIndex({"location.coordinates" : "2dsphere"});
     const salonCursor = await db.db.collection("salons").aggregate([
      
        {
          $geoNear : {
            near: {coordinates :Userlocation}, 
            distanceField: "dist.calculated",
            maxDistance: radius,
            spherical: true
  
          }
        }, 

      {
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
const getAllSalons =  async () => {
  
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


// const data = getDatabaseByName("afroturf");
// getSalonByName("HeartBeauty");
// getAllSalon();
//getAllSalonShallow("HeartBeaty").then(k => {console.log(k)});
const cor1 =  [ -21.067155,  23.977487 ];

console.log("************************************************************");
//getNearestSalons(cor1, 211, 10).then(k => console.log(k));
//getAllNearestSalonsShallow(cor1, 211, 10).then(k => console.log(k));
//getSalonByStylistRating(cor1, 211, 10,5).then(k => console.log(k));
//getSalonByStylistRatingGender(cor1, 211, 10,4,"male").then(k => console.log(k));
//getSalonByNameShallow("YoungNBold",cor1, 211, 10).then(k => console.log(k));


/* TESTS      END    */
module.exports = {
  getSalonByName, 
  getSalonByNameShallow, 
  getSalonByStylistRating, 
  getSalonByStylistRatingGender, 
  getAllNearestSalonsShallow, 
  getAllSalons, 
  getNearestSalons,
  getDatabaseByName,
  getSalonByStylistNameRatingGender,
  getSalonBySalonId,
  getSalonBySalonIdShallow,
};


















































