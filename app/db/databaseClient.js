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
          maxDistance: parseInt(radius)*METERS_TO_KM,
          num: parseInt(limit),
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
          maxDistance: parseInt(radius)*METERS_TO_KM,
          num: parseInt(limit),
          query: {name: name},
          spherical: true

        }
      }]);
      const salon = await salonCursor.toArray();

      
      db.connection.close();
      return JSON.stringify(salon);
      


   }catch(err){
    throw new Error(err);
   }   
};
const getStylistById = async(salonId, stylistId, userLocation, radius) => {
    console.log("getStylistById server")
      const db = await getDatabaseByName("afroturf");
      await db.db.collection("salons").ensureIndex({"location.coordinates" : "2dsphere"});
      const stylistCursor = await db.db.collection("salons").aggregate([
        {
          $geoNear:{
            near: { coordinates: userLocation},
            distanceField: "distance.calculated",
            maxDistance: parseInt(radius)*METERS_TO_KM,
            query: {salonId: parseInt(salonId)},
            spherical: true
          }
    
        },
        {
          $project: { stylists: 
      
        
            {
              $filter: {
                input: "$stylists", 
                as: "this", 
                cond: {$eq : [ "$$this.stylistId", parseInt(stylistId)]}, 
              }
            }
    
          }
        }
      ]);
      
      const stylist = await stylistCursor.toArray();
      db.connection.close();
      return JSON.stringify(stylist);
    
};
 
  //get salon by salonId
const getSalonBySalonId = async (salonId, userlocation, radius) => {
  
  try{
     const db = await getDatabaseByName("afroturf");
     const salonCursor = await db.db.collection("salons").aggregate([ {
       $geoNear: {
         near: { coordinates :userlocation}, 
         distanceField: "distance.calculated",
         maxDistance: parseInt(radius)*METERS_TO_KM,
         query: {salonId: parseInt(salonId)},
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
           maxDistance: parseInt(radius)*METERS_TO_KM,
           query: {salonId: parseInt(salonId)},
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
    console.log("getSalonByNameShallow hhhhh");
     try{
        const db = await getDatabaseByName("afroturf");
        await db.db.collection("salons").ensureIndex({"location.coordinates" : "2dsphere"});
        const salonCursor = await db.db.collection("salons").aggregate([ {
          $geoNear: {
            near: { coordinates :Userlocation}, 
            distanceField: "distance.calculated",
            maxDistance: parseInt(radius)*METERS_TO_KM,
            num: parseInt(limit),
            query: {name: salonname},
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

//return salon_id and list of stylist with the input rating
const getSalonStylistBySalonId = async(userlocation, radius,salonId) => {

  const db = await getDatabaseByName("afroturf");
  await db.db.collection("salons").ensureIndex({"location.coordinates" : "2dsphere"});
  const stylistCursor = await db.db.collection("salons").aggregate([



    {
      $geoNear:{
        near: {coordinates: userlocation},
        distanceField: "distance.calculated",
        maxDistance: parseInt(radius)*METERS_TO_KM,
        query: {salonId: parseInt(salonId)},
        spherical: true
      }

    },

    {
      $project: { stylists: 1}
    }
  ]);
  const stylist = await stylistCursor.toArray();
  db.connection.close();
  return JSON.stringify(stylist);

};


const getSalonByStylistRatingAndSalonId = async(userlocation, radius, limit, rating, gender, salonId) => {
      console.log("getSalonByStylistRatingAndSalonId - server")
      const db = await getDatabaseByName("afroturf");
      await db.db.collection("salons").ensureIndex({"location.coordinates" : "2dsphere"});
      const stylistCursor = await db.db.collection("salons").aggregate([
        {
          $geoNear:{
            near: {coordinates: userlocation},
            distanceField: "distance.calculated",
            maxDistance: parseInt(radius)*METERS_TO_KM,
            num: parseInt(limit),
            query: {salonId: parseInt(salonId)},
            spherical: true
          }
    
        },
        {
          $project: { stylists: 
      
        
            {
              $filter: {
                input: "$stylists", 
                as: "this", 
                cond: {$gte : ["$$this.rating", parseInt(rating)]}
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
        maxDistance: parseInt(radius)*METERS_TO_KM,
        num: parseInt(limit),
        spherical: true
      }

    },

    {
      $project: { stylists: 
  
    
        {
          $filter: {
            input: "$stylists", 
            as: "this", 
            cond: {$gte : ["$$this.rating", parseInt(rating)]}
          }
        }

      }
    }
  ]);
  const stylist = await stylistCursor.toArray();
  db.connection.close();
  return JSON.stringify(stylist);

};
const getSalonByStylistRatingGenderAndSalonId = async(userlocation, radius, name,limit, rating, gender, salonId) => {

  const db = await getDatabaseByName("afroturf");
  await db.db.collection("salons").ensureIndex({"location.coordinates" : "2dsphere"});
  const stylistCursor = await db.db.collection("salons").aggregate([
    {
      $geoNear:{
        near: {coordinates: userlocation},
        distanceField: "distance.calculated",
        maxDistance: parseInt(radius)*METERS_TO_KM,
        num: parseInt(limit),
        query: {salonId: parseInt(salonId)},
        spherical: true
      }

    },
    {
      $project: { stylists: 
  
    
        {
          $filter: {
            input: "$stylists", 
            as: "this", 
            cond: {$and: [{$gte : ["$$this.rating", parseInt(rating)]}, {$eq : ["$$this.gender", gender]}, {$eq : ["$$this.name", name]}] }
          }
        }

      }
    }
  ]);
  const stylist = await stylistCursor.toArray();
  db.connection.close();
  return JSON.stringify(stylist);

};
    
  // //Eg 2). {Baseurl}/salons?location=25,25&
  // //radius=5&filters{ “gender”: “male”, “rating”:”>3”}&limit10
const getSalonByStylistRatingGender = async(userlocation, radius, limit, rating, gender) => {
    console.log("getSalonByStylistRatingGender - server")
    const db = await getDatabaseByName("afroturf");
    await db.db.collection("salons").ensureIndex({"location.coordinates" : "2dsphere"});
    const stylistCursor = await db.db.collection("salons").aggregate([
      {
        $geoNear:{
          near: {coordinates: userlocation},
          distanceField: "distance.calculated",
          maxDistance: parseInt(radius)*METERS_TO_KM,
          num: parseInt(limit),
          spherical: true
        }
  
      },
      {
        $project: { stylists: 
    
      
          {
            $filter: {
              input: "$stylists", 
              as: "this", 
              cond: {$and: [{$gte : ["$$this.rating", parseInt(rating)]}, {$eq : ["$$this.gender", gender]}] }
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
        maxDistance: parseInt(radius)*METERS_TO_KM,
        num: parseInt(limit),
        spherical: true
      }

    },
    {
      $project: { stylists: 
  
    
        {
          $filter: {
            input: "$stylists", 
            as: "this", 
            cond: {$and: [{$gte : ["$$this.rating", parseInt(rating)]}, {$eq : ["$$this.gender", gender]}, {$eq : ["$$this.name", name]}] }
          }
        }

      }
    }
  ]);
  const stylist = await stylistCursor.toArray();
  db.connection.close();
  return JSON.stringify(stylist);

};

const getSalonByStylistNameRatingGenderAndSalonId = async(userlocation, radius, name,limit, rating, gender, salonId) => {
  console.log("getSalonByStylistNameRatingGenderAndSalonId server "+salonId)
  const db = await getDatabaseByName("afroturf");
  await db.db.collection("salons").ensureIndex({"location.coordinates" : "2dsphere"});
  const stylistCursor = await db.db.collection("salons").aggregate([
    {
      $geoNear:{
        near: {coordinates: userlocation},
        distanceField: "distance.calculated",
        maxDistance: parseInt(radius)*METERS_TO_KM,
        num: parseInt(limit),
        query: {salonId: parseInt(salonId)},
        spherical: true
      }

    },
    {
      $project: { stylists: 
  
    
        {
          $filter: {
            input: "$stylists", 
            as: "this", 
            cond: {$and: [{$gte : ["$$this.rating", parseInt(rating)]}, {$eq : ["$$this.gender", gender]}, {$eq : ["$$this.name", name]}] }
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
  console.log("get salons nearest shallow query");
  try{
     const db = await getDatabaseByName("afroturf");
     await db.db.collection("salons").ensureIndex({"location.coordinates" : "2dsphere"});
     const salonCursor = await db.db.collection("salons").aggregate([
      
        {
          $geoNear : {
            near: {coordinates :Userlocation}, 
            distanceField: "dist.calculated",
            maxDistance: parseInt(radius)*METERS_TO_KM,
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
  console.log("fwr")
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
  getStylistById,
  getSalonStylistBySalonId,
  getSalonByStylistRatingGenderAndSalonId,
  getSalonByStylistRatingAndSalonId,
  getSalonByStylistNameRatingGenderAndSalonId,
};


















































