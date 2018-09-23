const generic = require("./generic");
const METERS_TO_KM = 1000;
const empty = require("is-empty");

const containsInServices = async (contains, userlocation, radius, limit, servicesObj) => {

    console.log("containsInServices hhhhh "+empty(userlocation));
        try{
  
        let price = servicesObj.price;
        const db = await generic.getDatabaseByName("afroturf");
        await db.db.collection("salons").ensureIndex({"location.coordinates" : "2dsphere"});
        if(empty(userlocation)){
            if(!empty(servicesObj.price) && servicesObj.service !== undefined){
                console.log([contains,servicesObj])
                let price = servicesObj.price;
                console.log(" getSalonByNameShallow NO location, radius, limit null: "+price)
                const salonCursor = await db.db.collection("salons").aggregate([
                  {$unwind:"$services"},
                  {$match: {"services._id":  { '$regex' : servicesObj.service, '$options' : 'i' }}},
                  {$unwind:"$services.subservices"},
                  {$match:{$or : [
                    {"services.subservices.type": { '$regex' : contains, '$options' : 'i' }},
                    {"services.subservices.price":{"$gte":price[0], "$lte":price[1]}}
                
                                 ]}},
                  {$project: {salonId:1,"services.subservices":1,"services._id":1}}
              
              ])
               
                const salon = await salonCursor.toArray();
    
                console.log("INSIDE connect", JSON.stringify(salon));
                db.connection.close();
                return JSON.parse(JSON.stringify(salon));
            }else if(!empty(servicesObj.price)){
              let price = servicesObj.price;
              console.log([contains,servicesObj])
              const salonCursor = await db.db.collection("salons").aggregate([
                {$unwind:"$services"},
                {$unwind:"$services.subservices"},
                {$match:{$or : [
                  {"services.subservices.type": { '$regex' : contains, '$options' : 'i' }},
                  {"services.subservices.price":{"$gte":price[0], "$lte":price[1]}}
              
                               ]}},
                {$project: {salonId:1,"services.subservices":1,"services._id":1}}
            
            ])
             
              const salon = await salonCursor.toArray();
  
              console.log("INSIDE connect", JSON.stringify(salon));
              db.connection.close();
              return JSON.parse(JSON.stringify(salon));
          }else if(servicesObj.service !== undefined){
            console.log([contains,servicesObj])
            console.log(" getSalonByNameShallow NO location, radius, limit null: "+price)
            const salonCursor = await db.db.collection("salons").aggregate([
              {$unwind:"$services"},
              {$match: {"services._id":  { '$regex' : servicesObj.service, '$options' : 'i' }}},
              {$unwind:"$services.subservices"},
              {$match:{$or : [
                {"services.subservices.type": { '$regex' : contains, '$options' : 'i' }}
            
                             ]}},
              {$project: {salonId:1,"services.subservices":1,"services._id":1}}
          
          ])
           
            const salon = await salonCursor.toArray();
  
            console.log("INSIDE connect", JSON.stringify(salon));
            db.connection.close();
            return JSON.parse(JSON.stringify(salon));
        }else if(empty(servicesObj) && contains !== undefined){
            console.log([contains,servicesObj])
            console.log(" getSalonByNameShallow NO location, radius, limit null: "+contains)
            const salonCursor = await db.db.collection("salons").aggregate([
              {$unwind:"$services"},
              {$unwind:"$services.subservices"},
              {$match:{$or : [
                {"services.subservices.type": { '$regex' : contains, '$options' : 'i' }}
            
                             ]}},
              {$project: {salonId:1,"services.subservices":1,"services._id":1}}
          
          ])
           
            const salon = await salonCursor.toArray();
  
            console.log("INSIDE connect", JSON.stringify(salon));
            db.connection.close();
            return JSON.parse(JSON.stringify(salon));
        }else{
            console.log([contains, servicesObj])
          console.log("INSIDE connect", JSON.stringify({services:null}));
            return [{services:null}];
        }
        }


        //location present
        console.log("THERE IS A LOCATION", userlocation)

        if(!empty(servicesObj.price) && servicesObj.service !== undefined){
                console.log([contains,servicesObj])
                let price = servicesObj.price;
                console.log(" getSalonByNameShallow NO location, radius, limit null: "+price)
                const salonCursor = await db.db.collection("salons").aggregate([
                    {$geoNear: {
                        near: { coordinates :userlocation}, 
                        distanceField: "distance.calculated",
                        maxDistance: parseInt(radius)*METERS_TO_KM,
                        num: parseInt(limit),
                        spherical: true
                
                        }},
                  {$unwind:"$services"},
                  {$match: {"services._id":  { '$regex' : servicesObj.service, '$options' : 'i' }}},
                  {$unwind:"$services.subservices"},
                  {$match:{$or : [
                    {"services.subservices.type": { '$regex' : contains, '$options' : 'i' }},
                    {"services.subservices.price":{"$gte":price[0], "$lte":price[1]}}
                
                                 ]}},
                  {$project: {salonId:1,"services.subservices":1,"services._id":1}}
              
              ])
               
                const salon = await salonCursor.toArray();
    
                console.log("INSIDE connect", JSON.stringify(salon));
                db.connection.close();
                return JSON.parse(JSON.stringify(salon));
            }else if(!empty(servicesObj.price)){
              let price = servicesObj.price;
              console.log([contains,servicesObj])
              const salonCursor = await db.db.collection("salons").aggregate([
                {$geoNear: {
                    near: { coordinates :userlocation}, 
                    distanceField: "distance.calculated",
                    maxDistance: parseInt(radius)*METERS_TO_KM,
                    num: parseInt(limit),
                    spherical: true
            
                    }},
                {$unwind:"$services"},
                {$unwind:"$services.subservices"},
                {$match:{$or : [
                  {"services.subservices.type": { '$regex' : contains, '$options' : 'i' }},
                  {"services.subservices.price":{"$gte":price[0], "$lte":price[1]}}
              
                               ]}},
                {$project: {salonId:1,"services.subservices":1,"services._id":1}}
            
            ])
             
              const salon = await salonCursor.toArray();
  
              console.log("INSIDE connect", JSON.stringify(salon));
              db.connection.close();
              return JSON.parse(JSON.stringify(salon));
          }else if(servicesObj.service !== undefined){
            console.log([contains,servicesObj])
            console.log(" getSalonByNameShallow NO location, radius, limit null: "+servicesObj.service)
            const salonCursor = await db.db.collection("salons").aggregate([
                {$geoNear: {
                    near: { coordinates :userlocation}, 
                    distanceField: "distance.calculated",
                    maxDistance: parseInt(radius)*METERS_TO_KM,
                    num: parseInt(limit),
                    spherical: true
            
                    }},
              {$unwind:"$services"},
              {$match: {"services._id":  { '$regex' : servicesObj.service, '$options' : 'i' }}},
              {$unwind:"$services.subservices"},
              {$match:{$or : [
                {"services.subservices.type": { '$regex' : contains, '$options' : 'i' }}
            
                             ]}},
              {$project: {salonId:1,"services.subservices":1,"services._id":1}}
          
          ])
           
            const salon = await salonCursor.toArray();
  
            console.log("INSIDE connect", JSON.stringify(salon));
            db.connection.close();
            return JSON.parse(JSON.stringify(salon));
        }else if(empty(servicesObj) && contains !== undefined){
            console.log([contains,servicesObj])
            console.log(" getSalonByNameShallow NO location, radius, limit null: "+contains)
            const salonCursor = await db.db.collection("salons").aggregate([
                {$geoNear: {
                    near: { coordinates :userlocation}, 
                    distanceField: "distance.calculated",
                    maxDistance: parseInt(radius)*METERS_TO_KM,
                    num: parseInt(limit),
                    spherical: true
            
                    }},
              {$unwind:"$services"},
              {$unwind:"$services.subservices"},
              {$match:{$or : [
                {"services.subservices.type": { '$regex' : contains, '$options' : 'i' }}
            
                             ]}},
              {$project: {salonId:1,"services.subservices":1,"services._id":1, }}
          
          ])
           
            const salon = await salonCursor.toArray();
  
            console.log("INSIDE connect", JSON.stringify(salon));
            db.connection.close();
            return JSON.parse(JSON.stringify(salon));
        }else{
            console.log([contains, servicesObj])
          console.log("INSIDE connect", JSON.stringify({services:null}));
            return [{services:null}];
        }
        
    
    
        }catch(err){
        throw new Error(err);
        }   
    };

const servicesObj = {
   service: "makeup"
}

//containsInServices("", [31.212121,22.12313], 2100,10,servicesObj);













const containsInStylist = async (contains, userlocation, radius, limit, stylistObj) =>{

    console.log("containsInStylist hhhhh "+empty(userlocation));
    try{

    const db = await generic.getDatabaseByName("afroturf");
    await db.db.collection("salons").ensureIndex({"location.coordinates" : "2dsphere"});
    if(empty(userlocation)){
        if(!empty(stylistObj.rating) && stylistObj.gender !== undefined){
            console.log([contains,stylistObj])
            let rating = stylistObj.rating;
            console.log(" getSalonByNameShallow NO location, radius, limit null: "+stylistObj.gender)
            const salonCursor = await db.db.collection("salons").aggregate([
              {$match: {"stylists.name":  { '$regex' : contains, '$options' : 'i' }}},
     
              {$match:{$or : [
                {"stylists.gender":stylistObj.gender},
                {"stylists.rating":{"$gte":rating[0], "$lte":rating[1]}}
            
                             ]}},
              {$project: {salonId:1,stylists:1}}
          
          ])
           
            const salon = await salonCursor.toArray();

            console.log("INSIDE connect", JSON.stringify(salon));
            db.connection.close();
            return JSON.parse(JSON.stringify(salon));
        }else if(!empty(stylistObj.rating)){
          let rating = stylistObj.rating;
          console.log([contains,stylistObj])
          const salonCursor = await db.db.collection("salons").aggregate([
            {$match: {"stylists.name":  { '$regex' : contains, '$options' : 'i' }}},
            {$match:{$or : [
              {"stylists.rating":{"$gte":rating[0], "$lte":rating[1]}}
          
                           ]}},
                           {$project: {salonId:1,stylists:1}}
        
        ])
         
          const salon = await salonCursor.toArray();

          console.log("INSIDE connect", JSON.stringify(salon));
          db.connection.close();
          return JSON.parse(JSON.stringify(salon));
      }else if(stylistObj.gender !== undefined){
        console.log([contains,stylistObj])
        console.log(" getSalonByNameShallow NO location, radius, limit null: "+stylistObj.gender)
        const salonCursor = await db.db.collection("salons").aggregate([
            {$match: {"stylists.name":  { '$regex' : contains, '$options' : 'i' }}},
          {$match:{$or : [
            {"stylists.gender":stylistObj.gender},
        
                         ]}},
                         {$project: {salonId:1,stylists:1}}
      
      ])
       
        const salon = await salonCursor.toArray();

        console.log("INSIDE connect", JSON.stringify(salon));
        db.connection.close();
        return JSON.parse(JSON.stringify(salon));
    }else if(empty(stylistObj) && contains !== undefined){
        console.log([contains,stylistObj])
        console.log(" getSalonByNameShallow NO location, radius, limit null: "+contains)
        const salonCursor = await db.db.collection("salons").aggregate([
          {$match: {"stylists.name":  { '$regex' : contains, '$options' : 'i' }}},
          {$project: {salonId:1,stylists:1}}
      
      ])
       
        const salon = await salonCursor.toArray();

        console.log("INSIDE connect", JSON.stringify(salon));
        db.connection.close();
        return JSON.parse(JSON.stringify(salon));
    }else{
        console.log([contains, stylistObj])
        console.log("INSIDE connect", JSON.stringify({services:null}));
        return [{services:null}];
    }
    }


    //location present
    console.log("THERE IS A LOCATION", userlocation)

    if(!empty(userlocation)){
        if(!empty(stylistObj.rating) && stylistObj.gender !== undefined){
            console.log([contains,stylistObj])
            let rating = stylistObj.rating;
            console.log(" getSalonByNameShallow NO location, radius, limit null: "+stylistObj.gender)
            const salonCursor = await db.db.collection("salons").aggregate([
                {$geoNear: {
                near: { coordinates :userlocation}, 
                distanceField: "distance.calculated",
                maxDistance: parseInt(radius)*METERS_TO_KM,
                num: parseInt(limit),
                spherical: true
        
                }},
              {$match: {"stylists.name":  { '$regex' : contains, '$options' : 'i' }}},
              {$match:{$or : [
                {"stylists.gender":stylistObj.gender},
                {"stylists.rating":{"$gte":rating[0], "$lte":rating[1]}}
            
                             ]}},
              {$project: {salonId:1,stylists:1}}
          
          ])
           
            const salon = await salonCursor.toArray();

            console.log("INSIDE connect", JSON.stringify(salon));
            db.connection.close();
            return JSON.parse(JSON.stringify(salon));
        }else if(!empty(stylistObj.rating)){
          let rating = stylistObj.rating;
          console.log([contains,stylistObj])
          const salonCursor = await db.db.collection("salons").aggregate([
            {$geoNear: {
                near: { coordinates :userlocation}, 
                distanceField: "distance.calculated",
                maxDistance: parseInt(radius)*METERS_TO_KM,
                num: parseInt(limit),
                spherical: true
        
                }},
                {$match: {"stylists.name":  { '$regex' : contains, '$options' : 'i' }}},,
            {$match:{$or : [
              {"stylists.rating":{"$gte":rating[0], "$lte":rating[1]}}
          
                           ]}},
                           {$project: {salonId:1,stylists:1}}
        
        ])
         
          const salon = await salonCursor.toArray();

          console.log("INSIDE connect", JSON.stringify(salon));
          db.connection.close();
          return JSON.parse(JSON.stringify(salon));
      }else if(stylistObj.gender !== undefined){
        console.log([contains,stylistObj])
        console.log(" getSalonByNameShallow NO location, radius, limit null: "+stylistObj)
        const salonCursor = await db.db.collection("salons").aggregate([
            {$geoNear: {
                near: { coordinates :userlocation}, 
                distanceField: "distance.calculated",
                maxDistance: parseInt(radius)*METERS_TO_KM,
                num: parseInt(limit),
                spherical: true
        
                }},
            {$match: {"stylists.name":  { '$regex' : contains, '$options' : 'i' }}},
          {$match:{$or : [
            {"stylists.gender":stylistObj.gender},
        
                         ]}},
                         {$project: {salonId:1,stylists:1}}
      
      ])
       
        const salon = await salonCursor.toArray();

        console.log("INSIDE connect", JSON.stringify(salon));
        db.connection.close();
        return JSON.parse(JSON.stringify(salon));
    }else if(empty(stylistObj) && contains !== undefined){
        console.log([contains,stylistObj])
        console.log(" getSalonByNameShallow NO location, radius, limit null: "+contains)
        const salonCursor = await db.db.collection("salons").aggregate([
            {$geoNear: {
                near: { coordinates :userlocation}, 
                distanceField: "distance.calculated",
                maxDistance: parseInt(radius)*METERS_TO_KM,
                num: parseInt(limit),
                spherical: true
        
                }},
          {$match: {"stylists.name":  { '$regex' : contains, '$options' : 'i' }}},
          {$project: {salonId:1,stylists:1}}
      
      ])
       
        const salon = await salonCursor.toArray();

        console.log("INSIDE connect", JSON.stringify(salon));
        db.connection.close();
        return JSON.parse(JSON.stringify(salon));
    }else{
        console.log([contains, stylistObj])
        console.log("INSIDE connect", JSON.stringify({services:null}));
        return [{services:null}];
    }
    }
    


    }catch(err){
    throw new Error(err);
    } 

}


const stylistObj = {


 }

 //containsInStylist("cal", [31.212121,22.12313], 1, 2, stylistObj);


const containsInSalons = async (contains, userlocation, radius, limit, salonObj) =>{
    console.log("containsInSalons hhhhh "+empty(userlocation));
    try{

    const db = await generic.getDatabaseByName("afroturf");
    await db.db.collection("salons").ensureIndex({"location.coordinates" : "2dsphere"});
    if(empty(userlocation)){
        if(!empty(salonObj.rating)){
            let rating = salonObj.rating;
            console.log([contains,salonObj])
            const salonCursor = await db.db.collection("salons").aggregate([
                {$match: {name:  { '$regex' : contains, '$options' : 'i' }}},
              {$match:{$or : [
                {rating:{"$gte":rating[0], "$lte":rating[1]}}
            
                             ]}},
                             {$project: {salonId:1,stylists:1}}
          
          ])
           
            const salon = await salonCursor.toArray();
  
            console.log("INSIDE connect", JSON.stringify(salon));
            db.connection.close();
            return JSON.parse(JSON.stringify(salon));
        }else if(empty(salonObj) && contains !== undefined){
          console.log([contains,salonObj])
          console.log(" getSalonByNameShallow NO location, radius, limit null: "+contains)
          const salonCursor = await db.db.collection("salons").aggregate([
              {$match: {name:  { '$regex' : contains, '$options' : 'i' }}},
            {$project: {salonId:1,location:1, name:1, rating:1}}
        
        ])
         
          const salon = await salonCursor.toArray();
  
          console.log("INSIDE connect", JSON.stringify(salon));
          db.connection.close();
          return JSON.parse(JSON.stringify(salon));
      }else{
          console.log([contains, stylistObj])
          console.log("INSIDE connect", JSON.stringify({salons:null}));
          return [{salons:null}];
      }
    }


    //location present
    console.log("THERE IS A LOCATION", userlocation)

    if(!empty(userlocation)){
         if(!empty(salonObj.rating)){
            let rating = salonObj.rating;
            console.log([contains,salonObj])
            const salonCursor = await db.db.collection("salons").aggregate([
              {$geoNear: {
                  near: { coordinates :userlocation}, 
                  distanceField: "distance.calculated",
                  maxDistance: parseInt(radius)*METERS_TO_KM,
                  num: parseInt(limit),
                  query:{name:  { '$regex' : contains, '$options' : 'i' }},
                  spherical: true
          
                  }},
              {$match:{$or : [
                {rating:{"$gte":rating[0], "$lte":rating[1]}}
            
                             ]}},
                             {$project: {salonId:1,stylists:1}}
          
          ])
           
            const salon = await salonCursor.toArray();
  
            console.log("INSIDE connect", JSON.stringify(salon));
            db.connection.close();
            return JSON.parse(JSON.stringify(salon));
        }else if(empty(salonObj) && contains !== undefined){
          console.log([contains,salonObj])
          console.log(" getSalonByNameShallow NO location, radius, limit null: "+contains)
          const salonCursor = await db.db.collection("salons").aggregate([
              {$geoNear: {
                  near: { coordinates :userlocation}, 
                  distanceField: "distance.calculated",
                  maxDistance: parseInt(radius)*METERS_TO_KM,
                  num: parseInt(limit),
                  query:{name:  { '$regex' : contains, '$options' : 'i' }},
                  spherical: true
          
                  }},
            {$project: {salonId:1,location:1, name:1, rating:1}}
        
        ])
         
          const salon = await salonCursor.toArray();
  
          console.log("INSIDE connect", JSON.stringify(salon));
          db.connection.close();
          return JSON.parse(JSON.stringify(salon));
      }else{
          console.log([contains, stylistObj])
          console.log("INSIDE connect", JSON.stringify({salons:null}));
          return [{salons:null}];
      }
    }
    


    }catch(err){
    throw new Error(err);
    } 
}


const salonObj = {
    rating: [0,5]
 }

//containsInSalons("", [31.212121,22.12313], 1, 2, salonObj);

module.exports = {
    containsInSalons,
    containsInServices, 
    containsInStylist
}