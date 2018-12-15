const auth = require("./authentication");
const awsHandler = require('../../aws/aws-handler');
const generic = require("./generic");
const counters = require("./counters");
const schema = require("./schema/schema");
const ObjectId = require('mongodb').ObjectID;
const empty = require("is-empty");
const notify = require("..//push-notification/notification");
const METERS_TO_KM = 1000;


//get all salons
const getAllSalons =  async () => {
    console.log("fwr")
    try{
       const db = await generic.getDatabaseByName("afroturf");
       const salonCursor = await db.db.collection("salons").find({});
       const salon = await salonCursor.toArray();
  
       //console.log("INSIDE connect", JSON.stringify(salon));
       db.connection.close();
       return JSON.parse(JSON.stringify(salon));
       
  
  
    }catch(err){
     throw new Error(err);
    }
       
  };


 
//get salons nearest shallow query
const getAllNearestSalonsShallow = async (userlocation, radius) => {
  
    console.log("get salons nearest shallow query");
    try{
       const db = await generic.getDatabaseByName("afroturf");
       await db.db.collection("salons").ensureIndex({"location.coordinates" : "2dsphere"});
       if(empty(userlocation)){
        console.log("NO location, radius, limit null")
        const salonCursor = await db.db.collection("salons").aggregate([ 
  
        {
         $project: {name: 1, location:1, rating: 1, salonId: 1}
       }])
       const salon = await salonCursor.toArray();
  
       //console.log("INSIDE connect", JSON.stringify(salon));
       db.connection.close();
       return JSON.parse(JSON.stringify(salon));
       
      }
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
  
  
  //get salon by salonId
  const getSalonBySalonId = async (salonId, userlocation, radius) => {
  
    try{
       const db = await generic.getDatabaseByName("afroturf");
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
const createUserBookmark = async (userId, salonId, info, title) => {
    const bookmark = {
        userId: userId,
        salonId: parseInt(salonId),
        info:info,
        title:title,
        bookmarkId: await counters.getNextSequenceValue("bookmarkId","bookmarksIndex" )
    }
    let bool = await generic.findSalon(salonId);
    if(!bool){
        return   {res:404, message: "salon not found"};
    }
    let bool2 = await generic.findBookmark(bookmark.userId, bookmark.salonId);
    if(bool2){
        return   {res:409, message: "already bookmarked"};
    }

    const result = await generic.insertIntoCollection("afroturf", "bookmarks",bookmark)
    console.log("ok: "+result.ok, "_id "+ result._id +" type: "+typeof(result._id));
    let _id;
    _id = result.ok == 1 ?  result._id: null;
    if(_id !==null){
        console.log("Creating bookmark ....id "+_id)
        return  {res:200, message: "sucessful", data: bookmark};
    }else{
        return  {res:401, message: "Ops something went wrong"};
    }
    
}
const deleteUserBookmark = async (bookmarkId) => {
    const bookmark = {
        bookmarkId: bookmarkId
    }
    const result = await generic.deleteDocument("bookmarks",bookmark)

    if(result !==null){
        console.log("deleting bookmark ....id "+result)
        return  {res:200, message: "sucessful"};
    }else{
        return  {res:401, message: "Ops something went wrong"};
    }
    
}
   //get salon by salonId
  const getUserBookmarksByUserId = async (userId) => {
  
    try{
       const db = await generic.getDatabaseByName("afroturf");
       
        const bookmarkCursor = await db.db.collection("bookmarks").aggregate([ {
          $match:{userId: userId}
        }]);
        const bookmark = await bookmarkCursor.toArray();
        const bookmarkObj = JSON.parse(JSON.stringify(bookmark))

        //bn = await getSalonBookmarked(bookmarkObj);
        //console.log("Bookmarks - ", bn);
        db.connection.close();
        return bookmarkObj;
       
  
    }catch(err){
     throw new Error(err);
    }   
   };
   const deleteAllUserBookmarksByUserId = async (userId) => {
  
    try{
       const db = await generic.getDatabaseByName("afroturf");
       
        const bookmarkCursor = await db.db.collection("bookmarks").aggregate([ {
          $match:{userId: userId}
        }]);
        const bookmark = await bookmarkCursor.toArray();
        const bookmarkObj = JSON.parse(JSON.stringify(bookmark))

        await clearSalonBookmarked(bookmarkObj);
        db.connection.close();
        return  {res:200, message: "sucessful"};
       
  
    }catch(err){
     throw new Error(err);
    }   
   };
   const clearSalonBookmarked = async (obj) =>{



    for(let item of obj){
        await deleteUserBookmark(item.bookmarkId);
    }
    

}
   const getSalonBookmarked = async (obj) =>{


        let salonsBookmarked = [];

        for(let item of obj){
            salonsBookmarked.push(await getSalonBySalonIdShallow(item.salonId));
        }
        salonsBookmarked.push(obj);
        let results =  JSON.parse(JSON.stringify(await salonsBookmarked));

        return results

   }

   //getUserBookmarksByUserId("5b9644aa6fb76e2ed83a25f6");
    // get salon by salonId shallow getSalonBySalonIdShallow
  const getSalonBySalonIdShallow = async (salonId, userlocation, radius) => {
    console.log("getSalonBySalonIdShallow")
      try{
         const db = await generic.getDatabaseByName("afroturf");
         await db.db.collection("salons").ensureIndex({"location.coordinates" : "2dsphere"});
         if(empty(userlocation)){
          console.log(" getSalonBySalonIdShallow NO location, radius, limit null")
          const salonCursor = await db.db.collection("salons").aggregate([ {
            $match:  {salonId: parseInt(salonId)}
          }, 
          {
            $project: {name: 1, location:1, rating: 1, salonId: 1}
          }]);
          let salon = await salonCursor.toArray();

          if(empty(salon)){
            return JSON.parse(JSON.stringify(""));
          }
          //console.log("INSIDE connect", JSON.stringify(salon));
          db.connection.close();
          
          return JSON.parse(JSON.stringify(salon[0]));
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
     const getSalonBySalonObj = async (salonObj, userlocation, radius) => {
        console.log("getSalonBySalonIdShallow")
          try{
             const db = await generic.getDatabaseByName("afroturf");
             await db.db.collection("salons").ensureIndex({"location.coordinates" : "2dsphere"});
             if(empty(userlocation)){
              console.log(" getSalonBySalonIdShallow NO location, radius, limit null")
              const salonCursor = await db.db.collection("salons").aggregate([ {
                $match:  {_id: ObjectId(salonObj)}
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
                 query: {_id: ObjectId(salonObj)},
                 spherical: true
       
               }
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
    
      console.log("getSalonByNameShallow hhhhh "+salonname.toLowerCase());
       try{
  
          const db = await generic.getDatabaseByName("afroturf");
          await db.db.collection("salons").ensureIndex({"location.coordinates" : "2dsphere"});
          if(empty(userlocation)){
            console.log(" getSalonByNameShallow NO location, radius, limit null")
            const salonCursor = await db.db.collection("salons").aggregate([ {
              $match: {name:  { '$regex' : salonname, '$options' : 'i' }}
            }, 
            {
              $project: {name: 1, location:1, rating: 1, salonId: 1}
            }]);
            const salon = await salonCursor.toArray();
      
            console.log("INSIDE connect", JSON.stringify(salon));
            db.connection.close();
            return JSON.parse(JSON.stringify(salon));
          }
          const salonCursor = await db.db.collection("salons").aggregate([ {
            $geoNear: {
              near: { coordinates :userlocation}, 
              distanceField: "distance.calculated",
              maxDistance: parseInt(radius)*METERS_TO_KM,
              num: parseInt(limit),
              query: {name:{ '$regex' : salonname, '$options' : 'i' } },
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


      //test
      //getSalonByNameShallow("chan", [])














const containsInSalons = async (contains, userlocation, radius, limit, salonObj) => {

console.log("getSalonByNameShallow hhhhh "+contains.toLowerCase());
    try{

    const db = await generic.getDatabaseByName("afroturf");
    await db.db.collection("salons").ensureIndex({"location.coordinates" : "2dsphere"});
    if(empty(userlocation)){
        if(!empty(salonObj.rating)){
            let rating = salonObj.rating;
            console.log(" getSalonByNameShallow NO location, radius, limit null: "+rating)
            const salonCursor = await db.db.collection("salons").aggregate([ {
            $match: {name:  { '$regex' : contains, '$options' : 'i' }, 
            $and: [{rating: { $gte: parseInt(rating[0]) } },{rating: { $lte: parseInt(rating[0]) } } ] }
            }, 
            {
            $project: {name: 1, location:1, rating: 1, salonId: 1}
            }]);
            const salon = await salonCursor.toArray();

            console.log("INSIDE connect", JSON.stringify(salon));
            db.connection.close();
            return JSON.parse(JSON.stringify(salon));
        }
    }
    const salonCursor = await db.db.collection("salons").aggregate([ {
        $geoNear: {
        near: { coordinates :userlocation}, 
        distanceField: "distance.calculated",
        maxDistance: parseInt(radius)*METERS_TO_KM,
        num: parseInt(limit),
        query: {name:{ '$regex' : contains, '$options' : 'i' } },
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



      const getSalonByName = async (name, userlocation, radius, limit) => {

        console.log("-- getSalonByName-- ")
        console.log("userLocation: "+typeof(userlocation)+"- content -"+empty(userlocation))
         try{
            const db = await generic.getDatabaseByName("afroturf");
            if(empty(userlocation)){
              console.log("userLocation: "+userlocation === null || undefined || "NaN")
              console.log("NO location: "+userlocation+", radius, limit null")
              const salonCursor = await db.db.collection("salons").aggregate([ {
                $match: {name:{ '$regex' : name, '$options' : 'i' }}
        
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
                query: {name: { '$regex' : name, '$options' : 'i' }},
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
           const db = await generic.getDatabaseByName("afroturf");
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

      

      const getNearestSalons = async (Userlocation, radius, limit) => {
  
        if(empty(Userlocation)){
            return {res: 422, message: "no location in endpoint"}
        }
        try {
          
          const db = await generic.getDatabaseByName("afroturf");
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
        } 
      
      }
// CRUD  salon 
//at least one services is required to create a salon
const createSalon = async (ctx) =>{
    try {
        //add this to users db
        const body = ctx.request.body ;
        const name = body.name, address = body.address, street = address.split(",")[1], coordinates = [parseFloat(body.latitude), parseFloat(body.longitude)], sName = "haircuts", hiring = 1;
        const userId = body.userId; //"5b7e8e21d59eae1de05d6984";
        console.log(name)
        console.log("--createSalon--");
        const salonId = await counters.getNextSequenceValue("salonId", "salonIndex")
        const salon = await schema.createNewSalonForm(salonId,name, address, street, coordinates, sName);
        let _id;
        
        const addedSalon = await generic.insertIntoCollection("afroturf", "salons",salon);
        _id = addedSalon.ok == 1 ?  addedSalon._id: null;


        //if successful
        if(_id !== null){
            addSalonToUserAccount(userId, _id, hiring, salonId);
            console.log("Creating users chat room. . .and reviewsDoc");
            createOrderDoc(userId, _id)
            generic.createNewUsersPrivateChatRoom("salons", [_id]);
            awsHandler.createUserDefaultBucket(name).then(p => updateSalon({bucketName: p}, _id));
            generic.createReviewsDoc(_id, "salons");
            console.log("--added to owner account-- "+_id);
            let res =  {res:200, message: "successfully performed operation"}

            if(res.res === 200){
                //notify all devices that salon collection updated

                notify.onDocumentDataChangedListner(_id, "salonListner", "salon")
                //notify owner of salon created

            }
            let salonObj = await getSalonBySalonObj(_id)
            ctx.status = res.res
            if(empty(salonObj)){
                ctx.body = salonObj;
                return;
            }
            ctx.body = salonObj[0];
        }else{
            console.log("--failed to add owner account--");
            ctx.status = 401;
            ctx.body = {};
    }
    } catch (error) {
        throw new Error(error);
    }


    
 

}

const findOwner = async(salonObjId) =>{
    const db = await generic.getDatabaseByName("afroturf");
    const salonCursor = await db.db.collection("users").find({
        "salons.salonObjId": salonObjId
    }).project({orderDocList:1, reviewsDocId: 1, roomDocIdList:1, bucketName:1, username:1});;
    const salon = await salonCursor.toArray();
 
      
    db.connection.close();
    console.log(JSON.parse(JSON.stringify(salon[0])));

    return JSON.parse(JSON.stringify(salon[0]));
}
//test
//findOwner("5b8902930548d434f87ad900");

const getOrderSalonDoc = async (salonObjId) => {
    const db = await generic.getDatabaseByName("afroturf");
    const salonCursor = await db.db.collection("users").aggregate([
        {$match : {"salons.salonObjId": salonObjId}},
        {
            $project: {
                orderDocList: {
                   $filter: {
                      input: "$orderDocList",
                      as: "this",
                      cond:{$eq : [  "$$this.salonObjId", salonObjId ]}
                   }
                }
             }
        }
    ])
    const salon = await salonCursor.toArray();
    
    if(!empty(salon)){
        console.log("DATA IS THERE. . . ")
        console.log(salon)
        let count = JSON.parse(JSON.stringify(salon[0]));
        db.connection.close();
        console.log("GET ORDERSLIST")
        console.log(count.orderDocList[0])
        return count.orderDocList[0];
    }
}
//test
//getOrderSalonDoc("5b8902930548d434f87ad900");

//addtosalonOrders
const addtosalonOrders = async(ctx) => {
    //look up salon owner
    
    const userId = ctx.request.body.userId, salonObjId = ctx.request.body.salonObjId;
    const orderDocObj = await getOrderSalonDoc(salonObjId);
    console.log("--addtosalonOrders--");
    const salonOrder = await schema.salonOrder(ctx.request.body, orderDocObj.orderDoc);
    const res = await addBookingUserAccount(userId, salonOrder);
    if(res.ok!==1 && res.nModified!==1){
        console.log(401 + "Failed to add booking to user account");
        return {res:401 , message: "Failed to add booking to user account"}; 
    }else{
        console.log(salonOrder);
        try{
            const db = await generic.getDatabaseByName("afroturf");
            const result = await db.db.collection("orders").update(
                {"_id": ObjectId(orderDocObj.orderDoc,)},
                {$addToSet: {salonOrders:salonOrder}}, 
            );
            db.connection.close();
            console.log(result.result.ok, result.result.nModified);
            let res = result.result.ok && result.result.nModified === 1 ? {res:200, message: "successfully performed operation"} : {res:401, message: "failed to perform operation"};

            if(res.res == 200){
                const clientId = await generic.getClientId(salonObjId);
                notify.notifyUser("booked", clientId, {userId:userId, message:"booking from user: "+userId});
                //notify all stylist that the is a booking
            }else{
                //notify user unsuccessful
            }
            ctx.status = res.res
            ctx.body =  {};
        }catch(err){
            throw new Error(err);
        }
    }

}
//test
//addtosalonOrders("5b7e8d6291de652110e648ca","5b8902930548d434f87ad900");

const getSalonOrdersByDateBefore = async(ctx) => {
    const salonObjId = ctx.query.salonObjId, date = ctx.query.before;
    const db = await generic.getDatabaseByName("afroturf");
    const salonCursor = await db.db.collection("orders").aggregate([
        {$match : {"salonObjId": salonObjId}},
        {
            $project: {
                salonOrders:{
                    $filter: {
                        input: "$salonOrders",
                        as: "this",
                        cond:{$and : [{$lte : ["$$this.created", new Date(date)] }]}
                     }
                }
             }
        }
    ])
    const salon = await salonCursor.toArray();
    
    if(!empty(salon)){
        console.log("DATA IS THERE. . . ")
        console.log(salon)
        let count = JSON.parse(JSON.stringify(salon));
        db.connection.close();        
        ctx.status = 200
        ctx.body =  count;
    }
    db.connection.close();
}
//test
//getSalonOrdersByDateBefore("5b8902930548d434f87ad900", "August 31, 2018 19:15:30")


const getSalonOrdersByDateBetween = async(ctx) => {
    const salonObjId = ctx.query.salonObjId, date = ctx.query.after, date2 = ctx.query.before;
    const db = await generic.getDatabaseByName("afroturf");
    const salonCursor = await db.db.collection("orders").aggregate([
        {$match : {"salonObjId": salonObjId}},
        {
            $project: {
                salonOrders:{
                    $filter: {
                        input: "$salonOrders",
                        as: "this",
                        cond:{$and : [{$lte : ["$$this.created", new Date(date2)] }, {$gte : ["$$this.created", new Date(date)] }]}
                     }
                }
             }
        }
    ])
    const salon = await salonCursor.toArray();
    
    if(!empty(salon)){
        console.log("DATA IS THERE. . . ")
        console.log(salon)
        let count = JSON.parse(JSON.stringify(salon));
        db.connection.close();  
        ctx.status = 200      
        ctx.body = count;
    }
    db.connection.close();
}
//test
//getSalonOrdersByDateBetween("5b8902930548d434f87ad900", "August 31, 2018 18:15:30", "August 31, 2018 20:15:30" )
//addtostylistOrders


const addBookingUserAccount = async(userId, data) =>{
    try{
        //const booking = await schema.booking(data);
        const db = await generic.getDatabaseByName("afroturf");
        const result = await db.db.collection("users").update(
            {"_id": ObjectId(userId)},
            {$addToSet: {booking:data}}, 
        );
        db.connection.close();
        console.log(result.result.ok, result.result.nModified);
        let resultJson = {ok: result.result.ok, nModified: result.result.nModified};
        let res = resultJson.ok && resultJson.nModified === 1 ? {res:200, message: "sucessfully performed operation"} : {res:401, message: "failed performed operation"}
        if(res.res === 200){
            //notify user tha booking successfull
            //notify user that user data changed
            const clientId = await generic.getClientId(userId);
            notify.notifyUser("userDataChanged", clientId, {userId:userId, message:"changed from user: "+userId});
            //notify all stylist that the is a booking
        }
        return  res;
    }catch(err){
        throw new Error(err);
    }

}

const addtostylistOrders = async(ctx) => {
    //look up salon owner
    const userId = ctx.request.body.userId, salonObjId = ctx.request.body.salonObjId;
    const orderDocObj = await getOrderSalonDoc(salonObjId);

    console.log("--addtosalonOrders--");
    const salonOrder = await schema.stylistOrder(ctx.request.body, orderDocObj.orderDoc);
    const res = await addBookingUserAccount(userId, salonOrder);
    if(res.ok!==1 && res.nModified!==1){
        console.log(401 + "Failed to add booking to user account");
        let response =  {res: 401 , message: "Failed to add booking to user account"};
        ctx.status = response.res;
        ctx.message = response.message
        ctx.body = {}
    }else{
        
        console.log(salonOrder);
        try{
            const db = await generic.getDatabaseByName("afroturf");
            const result =   db.db.collection("orders").update(
                {"_id": ObjectId(orderDocObj.orderDoc)},
                {$addToSet: {stylistOrders:salonOrder}}, 
            );
            const result3 =  db.db.collection("users").update({
                $and:[{"_id": ObjectId(ctx.request.body.assignedTo)}]},
                {$addToSet: {stylistBookings:salonOrder}}
            );


            let results = await result;
            let results3 = await result3;

            console.log(results3.result.ok, results3.result.nModified);
            db.connection.close();
            console.log(results.result.ok, results.result.nModified);
            let res = await results.result.ok && await results.result.nModified === 1 ?  {res:200, message: "successfully performed operation"} : {res:401, message: "failed to perform operation"};
            if(res.res == 200){
                const clientId = await generic.getClientId(salonObjId);
                notify.notifyUser("booked", clientId, {userId:userId, message:"booking from user: "+userId});
                //notify all stylist that the is a booking
            }else{
                //notify user unsuccessful
            }
            ctx.status = res.res;
            ctx.body = {} 
        }catch(err){
            throw new Error(err);
        }
    }

}
//test
//addtostylistOrders("5b7e8d6291de652110e648ca","5b8902930548d434f87ad900");

const getOrderByOrderNumber = async(ctx) =>{
    const orderNumber = ctx.params.orderNumber, salonObjId = ctx.query.salonObjId;
    const db = await generic.getDatabaseByName("afroturf");
    console.log("getOrderByOrderNumber ", orderNumber);
    const salonCursor = await db.db.collection("orders").aggregate([
        {$match : {$and : [{salonObjId:salonObjId},{$or:[{"salonOrders.orderId": orderNumber}, {"stylistOrders.orderId": orderNumber}]}]}},
        {
            $project: {
                stylistOrders:{
                    $filter: {
                        input: "$stylistOrders",
                        as: "this",
                        cond:{$and : [{$eq : ["$$this.orderId",orderNumber ]}]}
                     }
                },
                salonOrders:{
                    $filter: {
                        input: "$salonOrders",
                        as: "this",
                        cond:{$and : [{$eq : ["$$this.orderId",orderNumber ]}]}
                     }
                }
             }
        }
    ])
    const salon = await salonCursor.toArray();
    
    if(!empty(salon)){
        console.log("OrderByNumber. . . ")
        console.log(salon)
        let count = JSON.parse(JSON.stringify(salon));
        db.connection.close();        
        ctx.status = 200;
        ctx.body =  count;
    }
    db.connection.close();
}

//test
//getOrderByOrderNumber("stylist-1","5b8902930548d434f87ad900");


const getBookedTimeSlotForStylist = async(ctx) =>{
    
    const stylistId = ctx.query.salonObjId, date = ctx.query.date;
    const db = await generic.getDatabaseByName("afroturf");
    const salonCursor = await db.db.collection("users").aggregate([
        {$match : {$or:[{"stylistBookings.assignedTo": stylistId}, {"_id": ObjectId(stylistId)}]}},
        {
            $project: {
                timeSlot:{
                    $filter: {
                        input: "$stylistBookings",
                        as: "this",
                        cond:{$and : [{$eq : ["$$this.assignedTo",stylistId ]}, {$gte:["$$this.timeSlot", new Date(date)]}]}
                     }
                }
             }
        }
    ])
    const salon = await salonCursor.toArray();
    
    if(!empty(salon)){
        console.log("OrderByNumber. . . ")
        console.log(salon)
        let count = JSON.parse(JSON.stringify(salon));
        db.connection.close();   
        ctx.status = 200;     
        ctx.body = count;
    }
    db.connection.close();
}


//test
//getBookedTimeSlotForStylist("5b7e9b1495e2e31ef888b64d","August 31, 2018 15:00:00")


const getBookedTimeSlotForSalon = async(ctx) =>{
    const salonObjId = ctx.query.salonObjId, date = ctx.query.after;
    console.log(date)
    const db = await generic.getDatabaseByName("afroturf");
    const salonCursor = await db.db.collection("orders").aggregate([
        {$match : {$or:[{"salonOrders.salonObjId": salonObjId}]}},
        {
            $project: {
                salonOrders:{
                    $filter: {
                        input: "$salonOrders",
                        as: "this",
                        cond:{$and : [{$eq : ["$$this.salonObjId",salonObjId ]}, {$gte:["$$this.timeSlot", new Date(date)]}]}
                     }
                }
             }
        }
    ])
    const salon = await salonCursor.toArray();
    
    if(!empty(salon)){
        console.log("OrderByNumber. . . ")
        console.log(salon)
        let count = JSON.parse(JSON.stringify(salon))[0];
        db.connection.close(); 
        ctx.status = 200;   
        ctx.body =  count;
    }else{
        console.log("NO such salon")
    }
    db.connection.close();
}


//test
//getBookedTimeSlotForSalon("5b8902930548d434f87ad900", "August 10, 2018 15:00:00")
const acceptOrder = async (ctx) =>{

    const data = ctx.request.body;
    console.log("--acceptOrder--");
    try{
        
        if(data.orderId.includes("salon")){
            console.log("accepting a salon order");
            const db = await generic.getDatabaseByName("afroturf");
            const result = await db.db.collection("orders").update({
                $and:[{"salonOrders.salonObjId": data.salonObjId}, {"salonOrders.orderId": data.orderId}]},
                {$set: {"salonOrders.$[order].status":data.status, "salonOrders.$[order].assigned":data.assigned, 
                    "salonOrders.$[order].assignedTo":data.assignedTo,  "salonOrders.$[order].approved":data.approved, 
                    "salonOrders.$[order].available":data.available,  "salonOrders.$[order].cancelled":data.cancelled, 
                    "salonOrders.$[order].timeSlot":new Date(data.timeSlot), "salonOrders.$[order].paymentStatus":data.paymentStatus, "salonOrders.$[order].modified":new Date()}},
                {arrayFilters: [{$and: [{"order.salonObjId": data.salonObjId}, {"order.orderId": data.orderId}]}], multi : true } 
            );
        
            console.log("ok: "+result.result.ok, "modified: "+ result.result.nModified);
            const res = { ok: result.result.ok, nModified:result.result.nModified};
            
            if(res.ok === 1 && res.nModified === 1){
                const result2 = await db.db.collection("users").update({
                    $and:[{"booking.salonObjId": data.salonObjId}, {"booking.orderId": data.orderId}]},
                    {$set: {"booking.$[order].status":data.status, "booking.$[order].assigned":data.assigned, 
                        "booking.$[order].assignedTo":data.assignedTo,  "booking.$[order].approved":data.approved, 
                        "booking.$[order].available":data.available,  "booking.$[order].cancelled":data.cancelled, 
                        "booking.$[order].timeSlot":new Date(data.timeSlot), "booking.$[order].modified":new Date()}},
                    {arrayFilters: [{$and: [{"order.salonObjId": data.salonObjId}, {"order.orderId": data.orderId}]}], multi : true } 
                );
                db.connection.close();
                console.log(result2.result.ok, result2.result.nModified);
                const res = { ok: result2.result.ok, nModified:result2.result.nModified};
                let resTo = res.ok && res.nModified === 1 ?  {res:200, message: "successfully performed operation"} : {res:401, message: "failed to perform operation"};

                ctx.status = resTo.res
                ctx.body = {};
                if(resTo.res === 200){
                    //notify user tha booking successfull
                    //notify user that user data changed
                    const clientId = await generic.getClientId(data.customerId);
                    notify.notifyUser("bookingAccepted", clientId, {userId:userId, message:"changed from user: "+userId});
                    //notify all stylist that the is a booking
                }
            }
            db.connection.close();
        }else{
            console.log("accepting a stylist order");
            const db = await generic.getDatabaseByName("afroturf");
            const result = await db.db.collection("orders").update({
                $and:[{"stylistOrders.salonObjId": data.salonObjId}, {"stylistOrders.orderId": data.orderId}]},
                {$set: {"stylistOrders.$[order].status":data.status, "stylistOrders.$[order].assigned":data.assigned, 
                    "stylistOrders.$[order].assignedTo":data.assignedTo,  "stylistOrders.$[order].approved":data.approved, 
                    "stylistOrders.$[order].available":data.available,  "stylistOrders.$[order].cancelled":data.cancelled, 
                    "stylistOrders.$[order].timeSlot":new Date(data.timeSlot), "stylistOrders.$[order].modified":new Date()}},
                {arrayFilters: [{$and: [{"order.salonObjId": data.salonObjId}, {"order.orderId": data.orderId}]}], multi : true } 
            );
        
            console.log("ok: "+result.result.ok, "modified: "+ result.result.nModified);
            const res = { ok: result.result.ok, nModified:result.result.nModified};
            
            if(res.ok === 1 && res.nModified === 1){
                const result2 = await db.db.collection("users").update({
                    $and:[{"booking.salonObjId": data.salonObjId}, {"booking.orderId": data.orderId}]},
                    {$set: {"booking.$[order].status":data.status, "booking.$[order].assigned":data.assigned, 
                        "booking.$[order].assignedTo":data.assignedTo,  "booking.$[order].approved":data.approved, 
                        "booking.$[order].available":data.available,  "booking.$[order].cancelled":data.cancelled, 
                        "booking.$[order].timeSlot":new Date(data.timeSlot), "booking.$[order].paymentStatus":data.paymentStatus, "booking.$[order].modified":new Date()}},
                    {arrayFilters: [{$and: [{"order.salonObjId": data.salonObjId}, {"order.orderId": data.orderId}]}], multi : true } 
                );
                const result3 = await db.db.collection("users").update({
                    $and:[{"_id": ObjectId(data.assignedTo)}]},
                    {$set: {"stylistBookings.$[order].status":data.status, "stylistBookings.$[order].assigned":data.assigned, 
                        "stylistBookings.$[order].assignedTo":data.assignedTo,  "stylistBookings.$[order].approved":data.approved, 
                        "stylistBookings.$[order].available":data.available,  "stylistBookings.$[order].cancelled":data.cancelled, 
                        "stylistBookings.$[order].timeSlot":new Date(data.timeSlot), "stylistBookings.$[order].paymentStatus":data.paymentStatus, "stylistBookings.$[order].modified":new Date()}},
                    {arrayFilters: [{$and: [{"order.salonObjId": data.salonObjId}, {"order.orderId": data.orderId}]}], multi : true } 
                );
            
                db.connection.close();
                console.log(result3.result.ok, result3.result.nModified);
                
                const res2 = { ok: result3.result.ok, nModified:result3.result.nModified};
                let resToNew = resToNew =  res2.ok && res2.nModified === 1 ? {res:200, message: "successfully performed operation"} : {res:401, message: "failed to perform operation"}
                ctx.status = resToNew.res
                ctx.body = {};
                if(resToNew.res === 200){
                    //notify user tha booking successfull
                    //notify user that user data changed
                    const clientId = await generic.getClientId(data.customerId);
                    notify.notifyUser("bookingAccepted", clientId, {userId:userId, message:"changed from user: "+userId});
                    //notify all stylist that the is a booking
                }
                

            }
        }
    
    }catch(err){
        throw new Error(err);
    }

}
//test
const data  = {
    "orderId": "stylist-6",
    "customerId": "data.customerId",
    "item": "haircuts",
    "code": "F23M",
    "price": 100,
    "salonObjId": "5b8902930548d434f87ad900",
    "description": "Faded haircut :)",
    "status": "active",
    "assigned": true,
    "assignedTo": "5b7e9b1495e2e31ef888b64d",
    "approved": true,
    "available": true,
    "cancelled": false
}
//acceptOrder(data);


const getStylistOrdersByDateAfter = async(ctx) => {
    const salonObjId = ctx.query.salonObjId, date = ctx.query.after;
    const db = await generic.getDatabaseByName("afroturf");
    const salonCursor = await db.db.collection("orders").aggregate([
        {$match : {"salonObjId": salonObjId}},
        {
            $project: {
                stylistOrders:{
                    $filter: {
                        input: "$stylistOrders",
                        as: "this",
                        cond:{$and : [{$gte : ["$$this.created", new Date(date)] }]}
                     }
                }
             }
        }
    ])
    const salon = await salonCursor.toArray();
    
    if(!empty(salon)){
        console.log("DATA IS THERE. . . ")
        console.log(salon)
        let count = JSON.parse(JSON.stringify(salon));
        db.connection.close();   
        ctx.status = 200
        ctx.body = count 
    }
    db.connection.close();
}
//test
//getStylistOrdersByDateAfter("5b8902930548d434f87ad900", "August 29, 2019 19:15:30")


const getStylistOrdersByDateBefore = async(ctx) => {
    const salonObjId = ctx.query.salonObjId, date = ctx.query.before;
    const db = await generic.getDatabaseByName("afroturf");
    const salonCursor = await db.db.collection("orders").aggregate([
        {$match : {"salonObjId": salonObjId}},
        {
            $project: {
                stylistOrders:{
                    $filter: {
                        input: "$stylistOrders",
                        as: "this",
                        cond:{$and : [{$lte : ["$$this.created", new Date(date)] }]}
                     }
                }
             }
        }
    ])
    const salon = await salonCursor.toArray();
    
    if(!empty(salon)){
        console.log("DATA IS THERE. . . ")
        console.log(salon)
        let count = JSON.parse(JSON.stringify(salon));
        db.connection.close();           
        ctx.status = 200
        ctx.body = count 
    }
    db.connection.close();
}
//test
//getStylistOrdersByDateBefore("5b8902930548d434f87ad900", "August 10, 2018 19:15:30")


const getStylistOrdersByDateBetween = async(ctx) => {
    const salonObjId = ctx.query.salonObjId, date = ctx.query.after, date2 = ctx.query.before;
    const db = await generic.getDatabaseByName("afroturf");
    const salonCursor = await db.db.collection("orders").aggregate([
        {$match : {"salonObjId": salonObjId}},
        {
            $project: {
                stylistOrders:{
                    $filter: {
                        input: "$stylistOrders",
                        as: "this",
                        cond:{$and : [{$lte : ["$$this.created", new Date(date2)] }, {$gte : ["$$this.created", new Date(date)] }]}
                     }
                }
             }
        }
    ])
    const salon = await salonCursor.toArray();
    
    if(!empty(salon)){
        console.log("DATA IS THERE. . . ")
        console.log(salon)
        let count = JSON.parse(JSON.stringify(salon));
        db.connection.close();  
        ctx.status = 200
        ctx.body = count 
    }
    db.connection.close();
}
//test
//getStylistOrdersByDateBetween("5b8902930548d434f87ad900", "August 30, 2018 18:15:30", "August 31, 2018 20:15:30" )

const getSalonOrdersDoc = async(ctx) => {
    const salonObjId = ctx.query.salonObjId;
    const db = await generic.getDatabaseByName("afroturf");
    const salonCursor = await db.db.collection("orders").aggregate([
        {$match : {"salonObjId": salonObjId}},
        {
            $project: {
                stylistOrders: 1, salonOrders:1, salonObjId:1
             }
        }
    ])
    const salon = await salonCursor.toArray();
    
    if(!empty(salon)){
        console.log("DATA IS THERE. . . ")
        console.log(salon)
        let count = JSON.parse(JSON.stringify(salon[0]));
        db.connection.close();
        console.log("GET ORDERSLIST")
        console.log(count)
        ctx.status = 200
        ctx.body = count  
    }
}



const createOrderDoc = async (userId, salonObjId) => {
    //get currect user
   
    console.log("--createOrderDoc--");
    const data = await schema.createNewOrder(salonObjId);
    console.log(data);

        //add this to users db
    console.log("--createOrderDoc--");

    let _id;
    
    const addedSalon = await generic.insertIntoCollection("afroturf", "orders",data);
    _id = addedSalon.ok == 1 ?  addedSalon._id: null;


    //if successful
    if(_id !== null){
        addOrderDocToUserAccount(userId, _id, salonObjId);
        return 200;
    }else{
        console.log("--failed to add owner account orders Doc--");
        return -1
    }
    
}
const addOrderDocToUserAccount = async (userId, orderDoc, salonObjId) => {
    //get currect user
    console.log("--addOrderDocToUserAccount--");
    try{
        const db = await generic.getDatabaseByName("afroturf");
        const result = await db.db.collection("users").update(
            {"_id": ObjectId(userId)},
            {$addToSet: {orderDocList:{orderDoc:orderDoc, salonObjId:salonObjId}}}, 
        );
        db.connection.close();
        console.log(result.result.ok, result.result.nModified);
    return  result.result.ok, result.result.nModified;
    }catch(err){
        throw new Error(err);
    }
}

const addSalonToUserAccount = async (userId, salonObjId, hiring, salonId) => {
    //get currect user
    console.log("--addSalonToUserAccount--");
    const data = schema.getActiveSalonsJsonForm(salonId,salonObjId, hiring);
    try{
        const db = await generic.getDatabaseByName("afroturf");
        const result = await db.db.collection("users").update(
            {"_id": ObjectId(userId)},
            {$addToSet: {salons:data}}, 
        );
        db.connection.close();
        console.log(result.result.ok, result.result.nModified);
    return  result.result.ok, result.result.nModified;
    }catch(err){
        throw new Error(err);
    }
}
const updateSalonContent = async (ctx) =>{
   //put object to update in a salon
   try{
       console.log(ctx.request.body)
        const salonObjId = ctx.request.body._id.$oid, salonData = ctx.request.body;
        delete salonData._id;
        console.log("_Id:  ", salonObjId)
        const db = await generic.getDatabaseByName("afroturf");
        const result = await db.db.collection("salons").update(
            {"_id": ObjectId(salonObjId)},
            {$set: salonData}
        );
        
        db.connection.close();
        console.log(result.result.ok, result.result.nModified);
        const res = {ok: result.result.ok, modified: result.result.nModified};
        let data = res.ok === 1 && res.modified === 1 ? {res:200, message: "successfully performed operation"} : {res:401, message: "failed to perform operation"};
        ctx.status = data.res
        ctx.body =  {};
        
    }catch(err){
        throw new Error(err);
    }
}
const updateSalon = async (salonData, salonObjId) =>{
    //put object to update in a salon
    try{
        //const salonObjId = ctx.request.salonObjId, salonData = ctx.request.body;
        const db = await generic.getDatabaseByName("afroturf");
        const result = await db.db.collection("salons").update(
            {"_id": ObjectId(salonObjId)},
            {$set: salonData}
        );
        
        db.connection.close();
        console.log(result.result.ok, result.result.nModified);
    return  result.result.ok, result.result.nModified;
    }catch(err){
        throw new Error(err);
    }
}
const changeAccountStatusSalon = async (salonObjId, status) => {
    //change accountStatus to deactivated
    try{
        const db = await generic.getDatabaseByName("afroturf");
        const result = await db.db.collection("salons").update(
            {"_id": ObjectId(salonObjId)},
            {$set: {accountStatus: status}}, 
        );
        db.connection.close();
        console.log(result.result.ok, result.result.nModified);
    return  result.result.ok, result.result.nModified;
    }catch(err){
        throw new Error(err);
    }

}
// CRUD services i.e manicure, pedicure, massages, makeup and hairstyles


const updateSubservice = async (ctx) => {
    //later use $unset
    const salonObjId = ctx.request.body.salonObjId, type = ctx.request.body.type, price = ctx.request.body.price, 
    description = ctx.request.body.description, url = ctx.request.body.url; code = ctx.request.body.code, serviceName = ctx.request.body.serviceName;
    console.log("--addServicesToSalon--");
    try{
        
        const db = await generic.getDatabaseByName("afroturf");
        if(type && description && price && url !== (null || undefined)){
            
            const data = schema.createNewSubserviceForm(type, code, price, description, url);
            console.log("ALL PRESENT 1")
            
            const result = await db.db.collection("salons").update(
                {$and : [{"_id": ObjectId(salonObjId)}]},
                {$set: {"services.$[subservice].subservices.$[service].price":data.price, "services.$[subservice].subservices.$[service].url":data.url,
                 "services.$[subservice].subservices.$[service].description":data.description, "services.$[subservice].subservices.$[service].type":data.type}},
                {arrayFilters: [{$and: [{"subservice._id":serviceName},{"subservice.subservices.code": {$eq:data.code}}]},{"service.code": code}]}
            );
            db.connection.close();
            console.log("ok: "+result.result.ok, "modified: "+ result.result.nModified);
            let data2 = result.result.ok &&result.result.nModified === 1 ? {res:200, message: "successfully performed operation"} : {res:401, message: "failed to perform operation"};
            ctx.status = data2.res;
            ctx.body =  {};

 
        }
    
    }catch(err){
        throw new Error(err);
    }
    
}
const updateServiceName = async (ctx) => {
    //later use $unset
    const salonObjId = ctx.request.body.salonObjId, serviceName = ctx.request.body.serviceName, serviceNameNew = ctx.request.body.serviceNameNew;
    console.log("--addServicesToSalon--");
    try{
        const db = await generic.getDatabaseByName("afroturf");
        const result = await db.db.collection("salons").update(
            {$and: [{"_id": ObjectId(salonObjId)}, {"services.name": serviceName}]},
            {$set: {"services.$._id":serviceNameNew, "services.$.name": serviceNameNew}}, 
        );
        db.connection.close();
        console.log("ok: "+result.result.ok, "modified: "+ result.result.nModified);            
        let data = result.result.ok &&result.result.nModified === 1 ? {res:200, message: "successfully performed operation"} : {res:401, message: "failed to perform operation"};
        ctx.status = data.res;
        ctx.body =  {};

    }catch(err){
        throw new Error(err);
    }

}

const addServicesToSalon = async (ctx) => {
    //check if service already exist if not proceed
    //get currect user
    const salonObjId = ctx.request.body.salonObjId, serviceName = ctx.request.body.serviceName;
    console.log("--addServicesToSalon--");
    const data = await schema.createNewServicesForm(serviceName);
    try{
        const db = await generic.getDatabaseByName("afroturf");
        const result = await db.db.collection("salons").update(
            {$and: [{"_id": ObjectId(salonObjId)}, {"services._id": {$ne: serviceName}}]},
            {$addToSet: {services:data}}, 
        );
        db.connection.close();
        console.log("ok: "+result.result.ok, "modified: "+ result.result.nModified);
        let data = result.result.ok &&result.result.nModified === 1 ? {res:200, message: "successfully performed operation"} : {res:401, message: "failed to perform operation"};
        ctx.status = data.res;
        ctx.body =  {};
    }catch(err){
        throw new Error(err);
    }
}

const addsubserviceToSalonServices = async (ctx) => {
    //get currect user
    const salonObjId = ctx.request.body.salonObjId, 
    serviceName = ctx.request.body.serviceName, type = ctx.request.body.type, code = ctx.request.body.code,
    price = ctx.request.body.price, description = ctx.request.body.description, estimatedDuration = ctx.request.body.estimatedDuration;
    console.log("--addsubserviceToSalonServices--");
    const data = schema.createNewSubserviceForm(type, code, price, description, estimatedDuration);
    try{
        const db = await generic.getDatabaseByName("afroturf");
        const result = await db.db.collection("salons").update(
            {$and : [{"_id": ObjectId(salonObjId)}]},
            {$addToSet: {"services.$[subservice].subservices":data}},
            {arrayFilters: [{$and: [{"subservice._id":serviceName}, {"subservice.subservices.code": {$ne:data.code}}]}]}
        );
        db.connection.close();
        console.log("ok: "+result.result.ok, "modified: "+ result.result.nModified);
        let data = result.result.ok &&result.result.nModified === 1 ? {res:200, message: "successfully performed operation"} : {res:401, message: "failed to perform operation"};
        ctx.status = data.res;
        ctx.body =  {};
}catch(err){
        throw new Error(err);
    }
}

const acceptStylistRequest = async (ctx) => {
   // try{
        const userId = ctx.request.body.userId, 
        salonObjId = ctx.request.body.salonObjId,
        status = ctx.request.body.status,
        permissions = ctx.request.body.permissions;
        if(status == undefined || permissions === undefined){
            ctx.status = 422;
            ctx.message = "status: null or permission: null";
            return 401 + "status: null or permission: null"}
        const data = await schema.getApplicationJsonRes(userId,salonObjId, status, permissions);
        const db = await generic.getDatabaseByName("afroturf");
        const result = await db.db.collection("users").update({
            $and:[{"salons.salonObjId": salonObjId}, {"salons.role": "salonOwner"}]},
            {$set: {"stylistRequests.$[stylist].status":status, "stylistRequests.$[stylist].stylistAccess":[permissions]}},
            {arrayFilters: [{$and: [{"stylist.salonObjId": salonObjId}, {"stylist.userId": userId}]}], multi : true } 
        );
        db.connection.close();
        console.log("ok: "+result.result.ok, "modified: "+ result.result.nModified);
        if(result.result.ok === 1 && result.result.nModified === 1){
            const res = await addStylistToSalon(userId, salonObjId, data);
            let data2 = res.ok && res.nModified === 1? {res:200, message: "successfully performed operation"} : {res:401, message: "failed to perform operation"};
            ctx.status = data2.res;
            ctx.body =   {};
        }else{
            ctx.status = 401
            ctx.message = "conflict" 
            return  401 + " error accepting";
        }
        
    // }catch(err){
    //     throw new Error(err);
    // }
}


const getUser = async (userId)=>{
    try{
        const db = await generic.getDatabaseByName("afroturf");
        const result = await db.db.collection("users").aggregate([{$match: {_id:ObjectId(userId)} }, {$project: {username:1, fname:1, reviewsDocId:1, gender:1, avatar:1}}]).toArray();
        db.connection.close();
       console.log("getUser done")
        return  JSON.parse(JSON.stringify(result));
    }catch(err){
        throw new Error(err);
    }
}
const addStylistToSalon = async (userId, salonObjId, data) => {
    console.log("addStylistToSalon")
    const stylist = await getUser(userId);
    console.log("passed getUser ", stylist)
    let stylistId = await counters.getNextStylistInCount(salonObjId);
    console.log("passed getUser ", stylistId)
    stylistId = stylistId;

    if(stylist == "[]"){
        console.log("   NO SUCH USER "+stylist)
        return -1;
    }
    console.log(" SUCH USER "+stylist[0]._id)
   // try{
        const db = await generic.getDatabaseByName("afroturf");
        const result = await db.db.collection("salons").update({
            $and:[{_id: ObjectId(salonObjId)}, {"stylists.userId": {$ne: stylist[0]._id}}]},
            {$addToSet: {stylists:schema.stylistJSON(stylist[0], stylistId, stylist[0]._id )}}
        );
        // const result2 = await db.db.collection("users").update({
        //     $and:[{_id: ObjectId(userId)}]},
        //     {$set: {stylistStatus:{status:"active", salonObjId:salonObjId}, stylistBookings:[]}}
        // );
        const result3 = await db.db.collection("users").update({
            $and:[{_id: ObjectId(userId)}, {"EmploymentStatus.salonObjId": salonObjId} ]},
            {$set: {EmploymentStatus:data, stylistBookings:[]}}
        );
        
        db.connection.close();
        console.log("ok: "+result.result.ok, "modified: "+ result.result.nModified);
        return  {ok : result.result.ok, nModified:  result.result.nModified}
    // }catch(err){
    //     throw new Error(err);
    // }
}

//test
//addStylistToSalon("5b8f75f4de5f7e1964ca5137", "5b8f7f7b0e22dc20a4588e27", data2);

//createSalon("5b7dd26c21a41857ccfcd7a2", "THE MILE", "Pretoria, 0083, The Blue Street", "The BLue Street", [31.212121,22.12313], "manicure", 1)
module.exports ={
    createSalon,
    updateSalon,
    acceptStylistRequest,
    updateSalonContent,
    addtosalonOrders,
    addtostylistOrders,
    acceptOrder,
    getBookedTimeSlotForSalon,
    getStylistOrdersByDateAfter,
    getBookedTimeSlotForStylist,
    getSalonOrdersDoc,
    getStylistOrdersByDateBetween,
    getSalonOrdersByDateBetween,
    getStylistOrdersByDateBefore,
    getSalonOrdersByDateBefore,
    getOrderByOrderNumber,
    addsubserviceToSalonServices,
    addServicesToSalon,
    updateServiceName,
    updateSubservice,
    getSalonByName, 
    createUserBookmark,
    getSalonByNameShallow, 
    getUserBookmarksByUserId,
    getAllNearestSalonsShallow, 
    getAllSalons, 
    getNearestSalons,
    getSalonBySalonId,
    getSalonBySalonIdShallow,
    deleteAllUserBookmarksByUserId,
    //salons
    getSalonByRating,
    getSalonBySalonObj,
    deleteUserBookmark,
    containsInSalons,

}