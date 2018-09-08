const mongodb = require("mongodb");
const METERS_TO_KM = 1000;
const empty = require("is-empty");

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
    return JSON.parse(JSON.stringify(nearestSalons));
  } catch(err){
    throw new Error(err);
    db.connection.close();
  } 

}
//get salon by Name
const getSalonByName = async (name, userlocation, radius, limit) => {

  console.log("-- getSalonByName-- ")
  console.log("userLocation: "+typeof(userlocation)+"- content -"+empty(userlocation))
   try{
      const db = await getDatabaseByName("afroturf");
      if(empty(userlocation)){
        console.log("userLocation: "+userlocation === null || undefined || "NaN")
        console.log("NO location: "+userlocation+", radius, limit null")
        const salonCursor = await db.db.collection("salons").aggregate([ {
          $match: {name: { $regex: new RegExp("^" + name.toLowerCase()+"$", "i") }}
  
          }
        ]);
        const salon = await salonCursor.toArray();
  
        
        db.connection.close();
        return JSON.parse(JSON.stringify(salon));
      }
//0763724601 Jes
      const salonCursor = await db.db.collection("salons").aggregate([ {
        $geoNear: {
          near: { coordinates :userlocation}, 
          distanceField: "distance.calculated",
          maxDistance: parseInt(radius)*METERS_TO_KM,
          num: parseInt(limit),
          query: {name: {name: { $regex: new RegExp("^" + name.toLowerCase()+"$", "i")} }},
          spherical: true

        }
      }]);
      const salon = await salonCursor.toArray();

      
      db.connection.close();
      return JSON.parse(JSON.stringify(salon));
      


   }catch(err){
    throw new Error(err);
   }   
};

//get salon by tot rating

const getSalonByRating = async (rating, userlocation, radius, limit) => {
 console.log("getSalonByRating --- rating: "+rating)
  try{
    console.log("Location: "+userlocation+" radius: "+radius )
     const db = await getDatabaseByName("afroturf");
     if(empty(userlocation)){
      console.log("NO location, radius, limit null")
      const salonCursor = await db.db.collection("salons").aggregate([ {
        $match: {rating: parseInt(rating)}

        }
      ]);
      const salon = await salonCursor.toArray();

      
      db.connection.close();
      return JSON.parse(JSON.stringify(salon));
    }

     const salonCursor = await db.db.collection("salons").aggregate([ 
       {
       $geoNear: {
         near: { coordinates :userlocation}, 
         distanceField: "distance.calculated",
         maxDistance: parseInt(radius)*METERS_TO_KM,
         num: parseInt(limit),
         spherical: true

       }
     },
    {
      $project: {salonId: 1, name:1, location:1, rating:1 }
    },
    {$match : {rating:parseInt(rating)}}
  ]);
     const salon = await salonCursor.toArray();

     
     db.connection.close();
     return JSON.parse(JSON.stringify(salon));
     


  }catch(err){
   throw new Error(err);
  }   
};

const getStylistById = async(salonId, stylistId, userlocation, radius) => {
  
    console.log("getStylistById server: ")
    console.log(userlocation)
      const db = await getDatabaseByName("afroturf");
      await db.db.collection("salons").ensureIndex({"location.coordinates" : "2dsphere"});
      if(empty(userlocation)){
        console.log("NO location, radius, limit null")
        const stylistCursor = await db.db.collection("salons").aggregate([
          {
            $match:{salonId: parseInt(salonId)}
      
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
        return JSON.parse(JSON.stringify(stylist));
      }
      const stylistCursor = await db.db.collection("salons").aggregate([
        {
          $geoNear:{
            near: { coordinates: userlocation},
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
      return JSON.parse(JSON.stringify(stylist));
    
};
 
  //get salon by salonId
const getSalonBySalonId = async (salonId, userlocation, radius) => {
  
  try{
     const db = await getDatabaseByName("afroturf");
     if(empty(userlocation)){
      console.log("NO location, radius null")
      const salonCursor = await db.db.collection("salons").aggregate([ {
        $match:{salonId: parseInt(salonId)}
      }]);
      const salon = await salonCursor.toArray();
 
      //console.log("INSIDE connect", JSON.parse(JSON.stringify(salon));
      db.connection.close();
      return JSON.parse(JSON.stringify(salon));
      
    }
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

     //console.log("INSIDE connect", JSON.parse(JSON.stringify(salon));
     db.connection.close();
     return JSON.parse(JSON.stringify(salon));
     


  }catch(err){
   throw new Error(err);
  }   
 };
  // get salon by salonId shallow getSalonBySalonIdShallow
const getSalonBySalonIdShallow = async (salonId, userlocation, radius) => {
  
    try{
       const db = await getDatabaseByName("afroturf");
       await db.db.collection("salons").ensureIndex({"location.coordinates" : "2dsphere"});
       if(empty(userlocation)){
        console.log("NO location, radius, limit null")
        const salonCursor = await db.db.collection("salons").aggregate([ {
          $match:  {salonId: parseInt(salonId)}
        }, 
        {
          $project: {name: 1, location:1, rating: 1, salonId: 1}
        }]);
        const salon = await salonCursor.toArray();
  
        //console.log("INSIDE connect", JSON.stringify(salon));
        db.connection.close();
        return JSON.parse(JSON.stringify(salon));
      }
       const salonCursor = await db.db.collection("salons").aggregate([ {
         $geoNear: {
           near: { coordinates :userlocation}, 
           distanceField: "distance.calculated",
           maxDistance: parseInt(radius)*METERS_TO_KM,
           query: {salonId: parseInt(salonId)},
           spherical: true
 
         }
       }, 
       {
         $project: {name: 1, location:1, rating: 1, salonId: 1}
       }]);
       const salon = await salonCursor.toArray();
 
       //console.log("INSIDE connect", JSON.stringify(salon));
       db.connection.close();
       return JSON.parse(JSON.stringify(salon));
       
 
 
    }catch(err){
     throw new Error(err);
    }   
   };

  //get salon by Name shallow
const getSalonByNameShallow = async (salonname, userlocation, radius, limit) => {
  
    console.log("getSalonByNameShallow hhhhh");
     try{

        const db = await getDatabaseByName("afroturf");
        await db.db.collection("salons").ensureIndex({"location.coordinates" : "2dsphere"});
        if(empty(userlocation)){
          console.log("NO location, radius, limit null")
          const salonCursor = await db.db.collection("salons").aggregate([ {
            $match: {name: { $regex: new RegExp("^" + salonname.toLowerCase()+"$", "i") } }
          }, 
          {
            $project: {name: 1, location:1, rating: 1, salonId: 1}
          }]);
          const salon = await salonCursor.toArray();
    
          //console.log("INSIDE connect", JSON.stringify(salon));
          db.connection.close();
          return JSON.parse(JSON.stringify(salon));
        }
        const salonCursor = await db.db.collection("salons").aggregate([ {
          $geoNear: {
            near: { coordinates :userlocation}, 
            distanceField: "distance.calculated",
            maxDistance: parseInt(radius)*METERS_TO_KM,
            num: parseInt(limit),
            query: {name: { $regex: new RegExp("^" + salonname.toLowerCase()+"$", "i") } },
            spherical: true
  
          }
        }, 
        {
          $project: {name: 1, location:1, rating: 1, salonId: 1}
        }]);
        const salon = await salonCursor.toArray();
  
        //console.log("INSIDE connect", JSON.stringify(salon));
        db.connection.close();
        return JSON.parse(JSON.stringify(salon));
        
  
  
     }catch(err){
      throw new Error(err);
     }   
    };
//return salon_id and list of stylist with the input rating
const getSalonAllStylist = async(userlocation, radius) => {
  
  const db = await getDatabaseByName("afroturf");
  await db.db.collection("salons").ensureIndex({"location.coordinates" : "2dsphere"});
  if(empty(userlocation)){
    console.log("NO location, radius, limit null")
    const stylistCursor = await db.db.collection("salons").find().project({ stylists: 1, salonId: 1})
    const stylist = await stylistCursor.toArray();
    db.connection.close();
    return JSON.parse(JSON.stringify(stylist));
  }
  const stylistCursor = await db.db.collection("salons").aggregate([



    {
      $geoNear:{
        near: {coordinates: userlocation},
        distanceField: "distance.calculated",
        maxDistance: parseInt(radius)*METERS_TO_KM,
        spherical: true
      }

    },

    {
      $project: { stylists: 1, salonId: 1}
    }
  ]);
  const stylist = await stylistCursor.toArray();
  db.connection.close();
  return JSON.parse(JSON.stringify(stylist));

};

//return salon_id and list of stylist with the input rating
const getSalonStylistBySalonId = async(userlocation, radius,salonId) => {
  
  const db = await getDatabaseByName("afroturf");
  await db.db.collection("salons").ensureIndex({"location.coordinates" : "2dsphere"});
  if(empty(userlocation)){
    console.log("userLocation is null,radius is null")
    const stylistCursor = await db.db.collection("salons").aggregate([
      {
        $match: {salonId: parseInt(salonId)}
  
      },
  
      {
        $project: { stylists: 1, salonId: 1}
      }
    ]);
    const stylist = await stylistCursor.toArray();
    db.connection.close();
    return JSON.parse(JSON.stringify(stylist));
  }
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
      $project: { stylists: 1, salonId: 1}
    }
  ]);
  const stylist = await stylistCursor.toArray();
  db.connection.close();
  return JSON.parse(JSON.stringify(stylist));

};


const getSalonByStylistRatingAndSalonId = async(userlocation, radius, limit, rating, gender, salonId) => {
      console.log("getSalonByStylistRatingAndSalonId - server")
      
      
      const db = await getDatabaseByName("afroturf");
      await db.db.collection("salons").ensureIndex({"location.coordinates" : "2dsphere"});
      if(empty(userlocation)){
        console.log("NO location, radius, limit null")
        const stylistCursor = await db.db.collection("salons").aggregate([
          {
            $match:{salonId: parseInt(salonId)}
      
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
        return JSON.parse(JSON.stringify(stylist));
      }
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
      return JSON.parse(JSON.stringify(stylist));
    
    };
    const getSalonByStylistGenderAndSalonId = async(userlocation, radius, limit, gender, salonId) => {
      console.log("getSalonByStylistGenderAndSalonId - server")
      
      
      const db = await getDatabaseByName("afroturf");
      await db.db.collection("salons").ensureIndex({"location.coordinates" : "2dsphere"});
      if(empty(userlocation)){
        console.log("NO location, radius, limit null")
        const stylistCursor = await db.db.collection("salons").aggregate([
          {
            $match:{salonId: parseInt(salonId)}
      
          },
          {
            $project: { stylists: 
        
          
              {
                $filter: {
                  input: "$stylists", 
                  as: "this", 
                  cond: {$gte : ["$$this.gender", gender]}
                }
              }
      
            }
          }
        ]);
        const stylist = await stylistCursor.toArray();
        db.connection.close();
        return JSON.parse(JSON.stringify(stylist));
      }
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
      return JSON.parse(JSON.stringify(stylist));
    
    };
    const getSalonByStylistGenderAndSalonId2 = async(userlocation, radius, limit, gender) => {
      console.log("getSalonByStylistGenderAndSalonId - server")
      
      
      const db = await getDatabaseByName("afroturf");
      await db.db.collection("salons").ensureIndex({"location.coordinates" : "2dsphere"});
      if(empty(userlocation)){
        console.log("NO location, radius, limit null")
        const stylistCursor = await db.db.collection("salons").aggregate([
          {
            $project: { stylists: 
        
          
              {
                $filter: {
                  input: "$stylists", 
                  as: "this", 
                  cond: {$gte : ["$$this.gender", gender]}
                }
              }
      
            }
          }
        ]);
        const stylist = await stylistCursor.toArray();
        db.connection.close();
        return JSON.parse(JSON.stringify(stylist));
      }
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
      return JSON.parse(JSON.stringify(stylist));
    
    };
//return salon_id and list of stylist with the input rating
const getSalonByStylistRating = async(userlocation, radius, limit, rating) => {
  
  console.log("getSalonByStylistRating - server")
  const db = await getDatabaseByName("afroturf");
  await db.db.collection("salons").ensureIndex({"location.coordinates" : "2dsphere"});
  if(empty(userlocation)){
    console.log("NO location, radius, limit null")
    const stylistCursor = await db.db.collection("salons").aggregate([
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
    return JSON.parse(JSON.stringify(stylist));
  
  }
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
  return JSON.parse(JSON.stringify(stylist));

};
const getSalonByStylistRatingGenderAndSalonId = async(userlocation, radius,limit, rating, gender, salonId) => {
  
  const db = await getDatabaseByName("afroturf");
  await db.db.collection("salons").ensureIndex({"location.coordinates" : "2dsphere"});
  if(empty(userlocation)){
    console.log("NO location, radius, limit null")
    const stylistCursor = await db.db.collection("salons").aggregate([
      {
        $match:{salonId: parseInt(salonId)}
  
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
    return JSON.parse(JSON.stringify(stylist));
  
  }
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
            cond: {$and: [{$gte : ["$$this.rating", parseInt(rating)]}, {$eq : ["$$this.gender", gender]}] }
          }
        }

      }
    }
  ]);
  const stylist = await stylistCursor.toArray();
  db.connection.close();
  return JSON.parse(JSON.stringify(stylist));

};
    
  // //Eg 2). {Baseurl}/salons?location=25,25&
  // //radius=5&filters{ “gender”: “male”, “rating”:”>3”}&limit10
const getSalonByStylistRatingGender = async(userlocation, radius, limit, rating, gender) => {
    console.log("getSalonByStylistRatingGender - server")
    
    const db = await getDatabaseByName("afroturf");
    await db.db.collection("salons").ensureIndex({"location.coordinates" : "2dsphere"});
    if(empty(userlocation)){
      console.log("NO location, radius, limit null")
      const stylistCursor = await db.db.collection("salons").aggregate([
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
      return JSON.parse(JSON.stringify(stylist));
    }
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
    return JSON.parse(JSON.stringify(stylist));
  
  };
  
// get stylist by name and other

const getSalonByStylistNameRatingGender = async(userlocation, radius, name,limit, rating, gender) => {
  if(empty(userlocation)){
    console.log("NO location, radius, limit null")
    return;
  }
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
  return JSON.parse(JSON.stringify(stylist));

};

const getSalonByStylistNameRatingGenderAndSalonId = async(userlocation, radius, name,limit, rating, gender, salonId) => {
  console.log("getSalonByStylistNameRatingGenderAndSalonId server "+salonId)
  if(empty(userlocation)){
    console.log("NO location, radius, limit null")
    return;
  }
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
  return JSON.parse(JSON.stringify(stylist));

};




//get salons nearest shallow query
const getAllNearestSalonsShallow = async (userlocation, radius) => {
  if(empty(userlocation)){
    console.log("NO location, radius, limit null")
    return;
  }
  console.log("get salons nearest shallow query");
  try{
     const db = await getDatabaseByName("afroturf");
     await db.db.collection("salons").ensureIndex({"location.coordinates" : "2dsphere"});
     const salonCursor = await db.db.collection("salons").aggregate([
      
        {
          $geoNear : {
            near: {coordinates :userlocation}, 
            distanceField: "dist.calculated",
            maxDistance: parseInt(radius)*METERS_TO_KM,
            spherical: true
  
          }
        }, 

      {
       $project: {name: 1, location:1, rating: 1, salonId: 1}
     }])
     const salon = await salonCursor.toArray();

     //console.log("INSIDE connect", JSON.stringify(salon));
     db.connection.close();
     return JSON.parse(JSON.stringify(salon));
     


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
     return JSON.parse(JSON.stringify(salon));
     


  }catch(err){
   throw new Error(err);
  }
     
};

// console.log("**************************services queries**********************************");
const getServicesByNameTypePriceRangeCodeAndSalonId = async (userlocation, radius, limit, serviceName, servicetype, price_gte, price_lte, code,salonId) =>{
        console.log("getServicesByNameTypePriceRangeCodeAndSalonId server "+userlocation)
        if(empty(userlocation)){
          console.log("NO location, radius, limit null")
          return;
        }
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
      
          },{
             $unwind :'$services'
          
          },{
            $unwind :'$services.'+serviceName
         
          }
          ,{
            $project: {services: 1,matchCode: { $eq: [ '$services.'+serviceName+'.code', code ] }, match: { $eq: [ '$services.'+serviceName+'.type', servicetype ] }, matchPrice : {$and :[{$gte: ['$services.'+serviceName+'.price', parseInt(price_gte)]}, {$lte: ['$services.'+serviceName+'.price', parseInt(price_lte)]}]}}
          }, 
          {
            "$match": { "match": true , "matchPrice":true, "matchCode":true}
          },
          {
            $project: {services: 1 }
          },
        
        ]);
        const stylist = await stylistCursor.toArray();
        db.connection.close();
        return JSON.parse(JSON.stringify(stylist));               

};

//global
const getServicesByNameTypePriceRangeCode = async (userlocation, radius, limit, serviceName, servicetype, price_gte, price_lte, code) =>{
  console.log("getServicesByNameTypePriceRangeCode ---346 ");
  if(empty(userlocation)){
    console.log("NO location, radius, limit null")
    return;
  }
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

    },{
       $unwind :'$services'
    
    },{
      $unwind :'$services.'+serviceName
   
    }
    ,{
      $project: {services: 1,matchCode: { $eq: [ '$services.'+serviceName+'.code', code ] }, match: { $eq: [ '$services.'+serviceName+'.type', servicetype ] }, matchPrice : {$and :[{$gte: ['$services.'+serviceName+'.price', parseInt(price_gte)]}, {$lte: ['$services.'+serviceName+'.price', parseInt(price_lte)]}]}}
    }, 
    {
      "$match": { "match": true , "matchPrice":true, "matchCode":true}
    },
    {
      $project: {services: 1 }
    },
  
  ]);
  const stylist = await stylistCursor.toArray();
  db.connection.close();
  return JSON.parse(JSON.stringify(stylist));               

};


const getServicesByNameTypePriceRangeAndSalonId = async (userlocation, radius, limit, serviceName, servicetype, price_gte, price_lte,salonId) =>{
  console.log("getServicesByNameTypePriceRangeAndSalonId server "+userlocation)
  if(empty(userlocation)){
    console.log("NO location, radius, limit null")
    return;
  }
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

    },{
       $unwind :'$services'
    
    },{
      $unwind :'$services.'+serviceName
   
    }
    ,{
      $project: {services: 1, match: { $eq: [ '$services.'+serviceName+'.type', servicetype ] }, matchPrice : {$and :[{$gte: ['$services.'+serviceName+'.price', parseInt(price_gte)]}, {$lte: ['$services.'+serviceName+'.price', parseInt(price_lte)]}]}}
    }, 
    {
      "$match": { "match": true , "matchPrice":true}
    },
    {
      $project: {services: 1 }
    },
  
  ]);
  const stylist = await stylistCursor.toArray();
  db.connection.close();
  return JSON.parse(JSON.stringify(stylist));               

};


//gobal


const getServicesByNameTypePriceRange = async (userlocation, radius, limit, serviceName, servicetype, price_gte, price_lte) =>{
  console.log("getServicesByNameTypePriceRange server "+userlocation)
  if(empty(userlocation)){
    console.log("NO location, radius, limit null")
    return;
  }
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

    },{
       $unwind :'$services'
    
    },{
      $unwind :'$services.'+serviceName
   
    }
    ,{
      $project: {services: 1, match: { $eq: [ '$services.'+serviceName+'.type', servicetype ] }, matchPrice : {$and :[{$gte: ['$services.'+serviceName+'.price', parseInt(price_gte)]}, {$lte: ['$services.'+serviceName+'.price', parseInt(price_lte)]}]}}
    }, 
    {
      "$match": { "match": true , "matchPrice":true}
    },
    {
      $project: {services: 1 }
    },
  
  ]);
  const stylist = await stylistCursor.toArray();
  db.connection.close();
  return JSON.parse(JSON.stringify(stylist));               

};

 
const  getServicesByNamePriceRangeAndSalonId = async (userlocation, radius, limit, serviceName, price_gte, price_lte,salonId) =>{
  console.log("getServicesByNamePriceRangeAndSalonId server "+userlocation)
  if(empty(userlocation)){
    console.log("NO location, radius, limit null")
    //return;
  }
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

    },{
       $unwind :'$services'
    
    },{
      $unwind :'$services.'+serviceName
   
    }
    ,{
      $project: {services: 1, matchPrice : {$and :[{$gte: ['$services.'+serviceName+'.price', parseInt(price_gte)]}, {$lte: ['$services.'+serviceName+'.price', parseInt(price_lte)]}]}}
    }, 
    {
      "$match": {"matchPrice":true}
    },
    {
      $project: {services: 1 }
    },
  
  ]);
  const stylist = await stylistCursor.toArray();
  db.connection.close();
  return JSON.parse(JSON.stringify(stylist)); 
};

// global

const  getServicesByNamePriceRange = async (userlocation, radius, limit, serviceName, price_gte, price_lte) =>{
  console.log("getServicesByNamePriceRange server "+userlocation)
  
  const db = await getDatabaseByName("afroturf");
  await db.db.collection("salons").ensureIndex({"location.coordinates" : "2dsphere"});
  
  if(empty(userlocation)){
    console.log("NO location, radius, limit null")
    const stylistCursor = await db.db.collection("salons").aggregate([{
         $unwind :'$services'
      
      },{
        $unwind :'$services.'+serviceName
     
      }
      ,{
        $project: {services: 1, matchPrice : {$and :[{$gte: ['$services.'+serviceName+'.price', parseInt(price_gte)]}, {$lte: ['$services.'+serviceName+'.price', parseInt(price_lte)]}]}}
      }, 
      {
        "$match": {"matchPrice":true}
      },
      {
        $project: {services: 1 }
      },
    
    ]);
    const stylist = await stylistCursor.toArray();
    db.connection.close();
    return JSON.parse(JSON.stringify(stylist)); 
    
  }
  const stylistCursor = await db.db.collection("salons").aggregate([
    {
      $geoNear:{
        near: {coordinates: userlocation},
        distanceField: "distance.calculated",
        maxDistance: parseInt(radius)*METERS_TO_KM,
        num: parseInt(limit),
        spherical: true
      }

    },{
       $unwind :'$services'
    
    },{
      $unwind :'$services.'+serviceName
   
    }
    ,{
      $project: {services: 1, matchPrice : {$and :[{$gte: ['$services.'+serviceName+'.price', parseInt(price_gte)]}, {$lte: ['$services.'+serviceName+'.price', parseInt(price_lte)]}]}}
    }, 
    {
      "$match": {"matchPrice":true}
    },
    {
      $project: {services: 1 }
    },
  
  ]);
  const stylist = await stylistCursor.toArray();
  db.connection.close();
  return JSON.parse(JSON.stringify(stylist)); 
};



const getServicesByNameTypeSalonId = async (userlocation, radius, limit, serviceName, servicetype, salonId) =>{
  console.log("getServicesByNameTypeSalonId server "+userlocation)
  
  const db = await getDatabaseByName("afroturf");
  await db.db.collection("salons").ensureIndex({"location.coordinates" : "2dsphere"});
  
  if(empty(userlocation)){
    console.log("NO location, radius, limit null")
    const stylistCursor = await db.db.collection("salons").aggregate([
      {
        $match:{salonId: parseInt(salonId)}
  
      },{
         $unwind :'$services'
      
      },{
        $unwind :'$services.'+serviceName
     
      }
      ,{
        $project: {services: 1, match: { $eq: [ '$services.'+serviceName+'.type', servicetype ] }}
      }, 
      {
        "$match": { "match": true }
      },
      {
        $project: {services: 1 }
      },
    
    ]);
    const stylist = await stylistCursor.toArray();
    db.connection.close();
    return JSON.parse(JSON.stringify(stylist));            
    
  }
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

    },{
       $unwind :'$services'
    
    },{
      $unwind :'$services.'+serviceName
   
    }
    ,{
      $project: {services: 1, match: { $eq: [ '$services.'+serviceName+'.type', servicetype ] }}
    }, 
    {
      "$match": { "match": true }
    },
    {
      $project: {services: 1 }
    },
  
  ]);
  const stylist = await stylistCursor.toArray();
  db.connection.close();
  return JSON.parse(JSON.stringify(stylist));               

};



const getServicesByNameType = async (userlocation, radius, limit, serviceName, servicetype) =>{
  console.log("getServicesByNameType server ---- 350 "+userlocation)
  
  const db = await getDatabaseByName("afroturf");
  await db.db.collection("salons").ensureIndex({"location.coordinates" : "2dsphere"});
  if(empty(userlocation)){
    console.log("NO location, radius, limit null")
    const stylistCursor = await db.db.collection("salons").aggregate([{
         $unwind :'$services'
      
      },{
        $unwind :'$services.'+serviceName
     
      }
      ,{
        $project: {services: 1, match: { $eq: [ '$services.'+serviceName+'.type', servicetype ] }}
      }, 
      {
        "$match": { "match": true }
      },
      {
        $project: {services: 1 }
      },
    
    ]);
    const stylist = await stylistCursor.toArray();
    db.connection.close();
    return JSON.parse(JSON.stringify(stylist));               
  }
  const stylistCursor = await db.db.collection("salons").aggregate([
    {
      $geoNear:{
        near: {coordinates: userlocation},
        distanceField: "distance.calculated",
        maxDistance: parseInt(radius)*METERS_TO_KM,
        num: parseInt(limit),
        spherical: true
      }

    },{
       $unwind :'$services'
    
    },{
      $unwind :'$services.'+serviceName
   
    }
    ,{
      $project: {services: 1, match: { $eq: [ '$services.'+serviceName+'.type', servicetype ] }}
    }, 
    {
      "$match": { "match": true }
    },
    {
      $project: {services: 1 }
    },
  
  ]);
  const stylist = await stylistCursor.toArray();
  db.connection.close();
  return JSON.parse(JSON.stringify(stylist));               

};



const getServicesByNameSalonId = async (userlocation, radius, limit,serviceName, salonId) =>{
  console.log("getServicesByNameSalonId server "+userlocation)
  
  const db = await getDatabaseByName("afroturf");
  await db.db.collection("salons").ensureIndex({"location.coordinates" : "2dsphere"});
  if(empty(userlocation)){
    console.log("NO location, radius, limit null")
    const stylistCursor = await db.db.collection("salons").aggregate([
      {
        $match:{salonId: parseInt(salonId)}
  
      },{
         $unwind :'$services'
      
      },{
        $unwind :'$services.'+serviceName
     
     }
      ,{
        $project: {services: 1}
      }
    
    ]);
    const stylist = await stylistCursor.toArray();
    db.connection.close();
    return JSON.parse(JSON.stringify(stylist));               
  
  }
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

    },{
       $unwind :'$services'
    
    },{
      $unwind :'$services.'+serviceName
   
   }
    ,{
      $project: {services: 1}
    }
  
  ]);
  const stylist = await stylistCursor.toArray();
  db.connection.close();
  return JSON.parse(JSON.stringify(stylist));               

};
  
//global

const getServicesByName = async (userlocation, radius, limit,serviceName) =>{
  console.log("getServicesByName server ---3453 "+userlocation)
  
  const db = await getDatabaseByName("afroturf");
  await db.db.collection("salons").ensureIndex({"location.coordinates" : "2dsphere"});
  if(empty(userlocation)){
    console.log("NO location, radius, limit null")
    const stylistCursor = await db.db.collection("salons").aggregate([{
         $unwind :'$services'
      
      },{
        $unwind :'$services.'+serviceName
     
     }
      ,{
        $project: {services: 1}
      }
    
    ]);
    const stylist = await stylistCursor.toArray();
    db.connection.close();
    return JSON.parse(JSON.stringify(stylist));               
  
  }
  const stylistCursor = await db.db.collection("salons").aggregate([
    {
      $geoNear:{
        near: {coordinates: userlocation},
        distanceField: "distance.calculated",
        maxDistance: parseInt(radius)*METERS_TO_KM,
        num: parseInt(limit),
        spherical: true
      }

    },{
       $unwind :'$services'
    
    },{
      $unwind :'$services.'+serviceName
   
   }
    ,{
      $project: {services: 1}
    }
  
  ]);
  const stylist = await stylistCursor.toArray();
  db.connection.close();
  return JSON.parse(JSON.stringify(stylist));               

};
  


const getServicesSalonId = async (userlocation, radius, limit, salonId) =>{

  console.log("getServicesSalonId server "+userlocation)
  
  const db = await getDatabaseByName("afroturf");
  await db.db.collection("salons").ensureIndex({"location.coordinates" : "2dsphere"});
  if(empty(userlocation)){
    console.log("NO location, radius, limit null")
    
    const stylistCursor = await db.db.collection("salons").aggregate([
      {
        $match:{salonId: parseInt(salonId)}
  
      },{
         $unwind :'$services'
      
      }
      ,{
        $project: {services: 1}
      }
    
    ]);
    const stylist = await stylistCursor.toArray();
    db.connection.close();
    return JSON.parse(JSON.stringify(stylist)); 
  }
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

    },{
       $unwind :'$services'
    
    }
    ,{
      $project: {services: 1}
    }
  
  ]);
  const stylist = await stylistCursor.toArray();
  db.connection.close();
  return JSON.parse(JSON.stringify(stylist));               

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
  getSalonAllStylist,
  getSalonByStylistNameRatingGenderAndSalonId,
  getSalonByStylistGenderAndSalonId,
  getSalonByStylistGenderAndSalonId2,

  //salons
  getSalonByRating,

  //services
  getServicesByNameTypePriceRangeCodeAndSalonId,
  getServicesByNameTypePriceRangeAndSalonId,
  getServicesByNamePriceRangeAndSalonId,
  getServicesByNameTypeSalonId,
  getServicesByNameSalonId,
  getServicesSalonId, 

  //global search
  getServicesByNameTypePriceRangeCode,
  getServicesByNameTypePriceRange,
  getServicesByNamePriceRange,
  getServicesByNameType,
  getServicesByName,

  

};


















































