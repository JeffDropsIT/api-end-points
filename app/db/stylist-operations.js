const auth = require("./authentication");
const awsHandler = require('../../aws/aws-handler');
const generic = require("./generic");
const counters = require("./counters");
const schema = require("./schema/schema");
const ObjectId = require('mongodb').ObjectID;
const METERS_TO_KM = 1000;
const empty = require("is-empty");





















const getSalonByStylistNameRatingGenderAndSalonId = async(userlocation, radius, name,limit, rating, gender, salonId) => {
    console.log("getSalonByStylistNameRatingGenderAndSalonId server "+salonId)
    
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
                cond: {$and: [{$gte : ["$$this.rating", parseInt(rating)]}, {$eq : ["$$this.gender", gender]}, {$eq : ["$$this.name", { $regex: new RegExp("/" + name.toLowerCase()+"/", "i") }]}] }
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
              cond: {$and: [{$gte : ["$$this.rating", parseInt(rating)]}, {$eq : ["$$this.gender", gender]}, {$eq : ["$$this.name", { $regex: new RegExp("^" + name.toLowerCase()+"$", "i") }]}] }
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
 




  
  
const getSalonByStylistNameRatingGender = async(userlocation, radius, name,limit, rating, gender) => {
  
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
                cond: {$and: [{$gte : ["$$this.rating", parseInt(rating)]}, {$eq : ["$$this.gender", gender]}, {$eq : ["$$this.name", { $regex: new RegExp("/" + name.toLowerCase()+"/", "i") }]}] }
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
              cond: {$and: [{$gte : ["$$this.rating", parseInt(rating)]}, {$eq : ["$$this.gender", gender]}, {$eq : ["$$this.name", { $regex: new RegExp("/" + name.toLowerCase()+"/", "i") }]}] }
            }
          }
  
        }
      }
    ]);
    const stylist = await stylistCursor.toArray();
    db.connection.close();
    return JSON.parse(JSON.stringify(stylist));
  
  };


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
  




  

const applyAsStylist = async (ctx) => {
    //get currect user
    const userId = ctx.request.body.userId, salonObjId = ctx.request.body.salonObjId;
    console.log("--applyAsStylist--");
    const data = schema.getApplicationJson(userId,salonObjId);
    console.log(data);
    try{
        const db = await generic.getDatabaseByName("afroturf");
        const result = await db.db.collection("users").update({
            $and:[{"salons.salonObjId": salonObjId}, {"salons.role": "salonOwner"}, { "salons.hiring": 1 }, {"stylistRequests.salonObjId": {$ne: salonObjId}}]},
            {$addToSet: {stylistRequests:data}}, 
        );
        console.log("ok: "+result.result.ok, "modified: "+ result.result.nModified);
        const res = result.result.ok && result.result.nModified === 1 ? {res:200, message: "successfully performed operation"} : {res:401, message: "failed to perform operation"};
        if(res === 200){
    
            console.log("--applyAsStylist updating my profile--");
            const result2 = await db.db.collection("users").update({
                $and:[{"_id": ObjectId(userId)}, {"EmploymentStatus.salonObjId": {$ne: salonObjId}}]},
                {$addToSet: {EmploymentStatus:data}}, 
            );
            console.log("ok: "+result2.result.ok, "modified: "+ result2.result.nModified);
        }
        
        db.connection.close();
        ctx.body =  res;
    }catch(err){
        throw new Error(err);
    }
}
//applyAsStylist("5b7e9b1495e2e31ef888b64d", "5b8f7f7b0e22dc20a4588e27");
module.exports = {
    applyAsStylist,
    getStylistById,
    getSalonStylistBySalonId,
    getSalonByStylistRatingGenderAndSalonId,
    getSalonByStylistRatingAndSalonId,
    getSalonAllStylist,
    getSalonByStylistNameRatingGenderAndSalonId,
    getSalonByStylistGenderAndSalonId,
    getSalonByStylistGenderAndSalonId2,
    getSalonByStylistRating, 
    getSalonByStylistRatingGender, 
    getSalonByStylistNameRatingGender,
}