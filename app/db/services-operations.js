const generic = require("./generic");
const METERS_TO_KM = 1000;
const empty = require("is-empty");















const containsInServices = async (contains, userlocation, radius, limit, servicesObj) => {

    console.log("containsInServices hhhhh "+contains.toLowerCase());
        try{
    
        const db = await generic.getDatabaseByName("afroturf");
        await db.db.collection("salons").ensureIndex({"location.coordinates" : "2dsphere"});
        if(empty(userlocation)){
            if(!empty(servicesObj.rating) && !empty(servicesObj.price) && servicesObj.service !== undefined){
                let rating = servicesObj.rating;
                let price = servicesObj.price;
                console.log(" getSalonByNameShallow NO location, radius, limit null: "+rating)
                const salonCursor = await db.db.collection("salons").aggregate([ {
                $match: { $eq: [{"$services._id.type":  { '$regex' : contains, '$options' : 'i' }}], 
               $or: [{ $and: [{'$services.subservices.rating': { $gte: parseInt(rating[0]) } },{'$services.subservices.rating': { $lte: parseInt(rating[1]) } } ]},
               { $and: [{'$services.subservices.price': { $gte: parseInt(price[0]) } },{'$services.subservices.price': { $lte: parseInt(price[1]) } }, {'$services._id':{ '$regex' : servicesObj.service, '$options' : 'i' }} ]}
               
            ] }
                }, 
                {
                $project: {services: 1, salonId: 1}
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

const servicesObj = {
    rating:[0,5],
    price:[10,700],
    service:"haircuts"
}

    containsInServices("chan", [], 0,1,servicesObj);

const getServicesByNameTypePriceRangeCodeAndSalonId = async (userlocation, radius, limit, serviceName, servicetype, price_gte, price_lte, code,salonId) =>{
    console.log("getServicesByNameTypePriceRangeCodeAndSalonId server "+userlocation)
    
    const db = await generic.getDatabaseByName("afroturf");
    await db.db.collection("salons").ensureIndex({"location.coordinates" : "2dsphere"});
    if(empty(userlocation)){
      console.log("NO location, radius, limit null")
      const stylistCursor = await db.db.collection("salons").aggregate([
        {
          $match: {salonId: parseInt(salonId)}
    
        },{
           $unwind :'$services'
        
        }
        ,{
          $project: {services: 1,matchCode: { $eq: [ '$services.subservices.code', code ] }, 
          match: { $eq: [ '$services.'+serviceName+'.type', servicetype ] }, matchPrice : {$and :[{$gte: ['$services.'+serviceName+'.price', parseInt(price_gte)]}, {$lte: ['$services.'+serviceName+'.price', parseInt(price_lte)]}]}}
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
        $project: {services: 1,matchCode: { $eq: [ '$services.subservices.code', code ] },
         match: { $eq: [ '$services.subservices.type', servicetype ] }, matchPrice : {$and :[{$gte: ['$services.subservices.price', parseInt(price_gte)]}, {$lte: ['$services.subservices.price', parseInt(price_lte)]}]}}
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

const db = await generic.getDatabaseByName("afroturf");
await db.db.collection("salons").ensureIndex({"location.coordinates" : "2dsphere"});
if(empty(userlocation)){
console.log("NO location, radius, limit null")
const stylistCursor = await db.db.collection("salons").aggregate([
 {
     $unwind :'$services'
  
  },{
    $unwind :'$services.'+serviceName
 
  }
  ,{
    $project: {services: 1,matchCode: { $eq: [ '$services.'+serviceName+'.code',
     code ] }, match: { $eq: [ '$services.'+serviceName+'.type', servicetype ] }
     , matchPrice : {$and :[{$gte: ['$services.'+serviceName+'.price', 
     parseInt(price_gte)]}, 
     {$lte: ['$services.'+serviceName+'.price', parseInt(price_lte)]}]}}
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

const db = await generic.getDatabaseByName("afroturf");
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

const db = await generic.getDatabaseByName("afroturf");
await db.db.collection("salons").ensureIndex({"location.coordinates" : "2dsphere"});
if(empty(userlocation)){
console.log("NO location, radius, limit null")
const stylistCursor = await db.db.collection("salons").aggregate([{
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

const db = await generic.getDatabaseByName("afroturf");
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

const db = await generic.getDatabaseByName("afroturf");
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

const db = await generic.getDatabaseByName("afroturf");
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

const db = await generic.getDatabaseByName("afroturf");
await db.db.collection("salons").ensureIndex({"location.coordinates" : "2dsphere"});
if(empty(userlocation)){
console.log("NO location, radius, limit null")
const stylistCursor = await db.db.collection("salons").aggregate([{
     $match :{"services._id": serviceName}
  
  },{
    $unwind :'$services.'+serviceName
 
  }
  ,{
    $project: {services: 1, match: { $eq: [ '$services.subservices.type', servicetype ] }}
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
    query:{"services._id": serviceName},
    num: parseInt(limit),
    spherical: true
  }

},{
   $unwind :'$services'

}
,{
  $project: {services: 1, match: { $eq: [ '$services.subservices.type', servicetype ] }}
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
console.log("---getServicesByNameSalonId server "+userlocation)

const db = await generic.getDatabaseByName("afroturf");
await db.db.collection("salons").ensureIndex({"location.coordinates" : "2dsphere"});
if(empty(userlocation)){
console.log(" getServicesByNameSalonId NO location, radius, limit null")
const stylistCursor = await db.db.collection("salons").aggregate([
  {
    $match:{salonId: parseInt(salonId), "services._id": serviceName}

  },{
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
    query: {salonId: parseInt(salonId), "service._id":serviceName},
    spherical: true
  }

},{
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

const db = await generic.getDatabaseByName("afroturf");
await db.db.collection("salons").ensureIndex({"location.coordinates" : "2dsphere"});
if(empty(userlocation)){
console.log("NO location, radius, limit null")
const stylistCursor = await db.db.collection("salons").aggregate([{
  $match:{salonId: parseInt(salonId), "services._id": serviceName}
  
  },{
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
    query: {salonId: parseInt(salonId), "services._id": serviceName},
    spherical: true
  }

},{
  $project: {services: 1}
}

]);
const stylist = await stylistCursor.toArray();
db.connection.close();
return JSON.parse(JSON.stringify(stylist));               

};



const getServicesSalonId = async (userlocation, radius, limit, salonId) =>{

console.log("getServicesSalonId server "+userlocation)

const db = await generic.getDatabaseByName("afroturf");
await db.db.collection("salons").ensureIndex({"location.coordinates" : "2dsphere"});
if(empty(userlocation)){
console.log("NO location, radius, limit null")

const stylistCursor = await db.db.collection("salons").aggregate([
  {
    $match:{salonId: parseInt(salonId), "services._id": serviceName}

  },{
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
    query: {salonId: parseInt(salonId), "services._id": serviceName},
    spherical: true
  }

}
,{
  $project: {services: 1}
}

]);
const stylist = await stylistCursor.toArray();
db.connection.close();
return JSON.parse(JSON.stringify(stylist));               

};












const getAllServices = async (userlocation, radius, limit) =>{

console.log("getAllServices server "+userlocation)

const db = await generic.getDatabaseByName("afroturf");
await db.db.collection("salons").ensureIndex({"location.coordinates" : "2dsphere"});
if(empty(userlocation)){
console.log("NO location, radius, limit null")

const stylistCursor = await db.db.collection("salons").aggregate([
  {
     $unwind :'$services'
  
  }
  ,{
    $project: {services: 1}
  }

]);
const stylist = await stylistCursor.toArray();
console.log(stylist)
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



module.exports = {
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
  getAllServices,

  containsInServices
}
