const generic = require("./generic");
const METERS_TO_KM = 1000;
const empty = require("is-empty");
















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
  getAllServices
}
