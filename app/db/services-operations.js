const generic = require("./generic");
const METERS_TO_KM = 1000;
const empty = require("is-empty");













//local service by service name


const getServicesByNameSalonId = async (userlocation, radius, limit, serviceName,salonId) =>{
    console.log("getServicesByNameTypePriceRangeCodeAndSalonId server "+userlocation)
    const db = await generic.getDatabaseByName("afroturf");
    await db.db.collection("salons").ensureIndex({"location.coordinates" : "2dsphere"});
    if(empty(userlocation)){
      console.log("NO location, radius, limit null")
      const stylistCursor = await db.db.collection("salons").aggregate([
        {$unwind:"$services"},
                  {$match:{$and: [ {"services._id":  { '$regex' : serviceName, '$options' : 'i' }},{salonId:parseInt(salonId)}]}},
                  {$unwind:"$services.subservices"},
                  {$project: {salonId:1,"services.subservices":1,"services._id":1, name:1, location:1, rating:1}}
      
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
  
      } ,{$unwind:"$services"},
      {$match:{$and: [ {"services._id":  { '$regex' : serviceName, '$options' : 'i' }},{salonId:parseInt(salonId)}]}},
      {$unwind:"$services.subservices"},
      {$project: {salonId:1,"services.subservices":1,"services._id":1, name:1, location:1, rating:1}}
    
    ]);
    const stylist = await stylistCursor.toArray();
    db.connection.close();
    return JSON.parse(JSON.stringify(stylist));               

};
//global services by service name


const getServicesByName = async (userlocation, radius, limit, serviceName) =>{
  console.log("getServicesByName "+userlocation)
  const db = await generic.getDatabaseByName("afroturf");
  await db.db.collection("salons").ensureIndex({"location.coordinates" : "2dsphere"});
  if(empty(userlocation)){
    console.log("NO location, radius, limit null")
    const stylistCursor = await db.db.collection("salons").aggregate([
      {$unwind:"$services"},
                {$match: {"services._id":  { '$regex' : serviceName, '$options' : 'i' }}},
                {$unwind:"$services.subservices"},
                {$project: {salonId:1,"services.subservices":1,"services._id":1, name:1, location:1, rating:1}}
    
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

    } ,{$unwind:"$services"},
    {$match: {"services._id":  { '$regex' : serviceName, '$options' : 'i' }}},
    {$unwind:"$services.subservices"},
    {$project: {salonId:1,"services.subservices":1,"services._id":1, name:1, location:1, rating:1}}
  
  ]);
  const stylist = await stylistCursor.toArray();
  db.connection.close();
  return JSON.parse(JSON.stringify(stylist));               

};



//global services by code
const getServicesCode = async (userlocation, radius, limit, code) =>{
console.log("getServicesByNameTypePriceRangeCode ---346 ");

const db = await generic.getDatabaseByName("afroturf");
await db.db.collection("salons").ensureIndex({"location.coordinates" : "2dsphere"});
if(empty(userlocation)){
console.log("NO location, radius, limit null")
const stylistCursor = await db.db.collection("salons").aggregate([
  {$unwind:"$services"},
  {$unwind:"$services.subservices"},
  {$match: {"services.subservices.code": code}},
  {$project: {salonId:1,"services.subservices":1,"services._id":1, name:1, location:1, rating:1}}
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

},  {$unwind:"$services"},
{$unwind:"$services.subservices"},
{$match: {"services.subservices.code": code}},
{$project: {salonId:1,"services.subservices":1,"services._id":1, name:1, location:1, rating:1}}
]);
const stylist = await stylistCursor.toArray();
db.connection.close();
return JSON.parse(JSON.stringify(stylist));               

};


//local services by code
const getServicesCodeSalonId = async (userlocation, radius, limit, code, salonId) =>{
  console.log("getServicesByNameTypePriceRangeCode ---346 ");
  
  const db = await generic.getDatabaseByName("afroturf");
  await db.db.collection("salons").ensureIndex({"location.coordinates" : "2dsphere"});
  if(empty(userlocation)){
  console.log("NO location, radius, limit null")
  const stylistCursor = await db.db.collection("salons").aggregate([
    {$unwind:"$services"},
    {$unwind:"$services.subservices"},
    {$match: {"services.subservices.code": code,  salonId:parseInt(salonId)}},
    {$project: {salonId:1,"services.subservices":1,"services._id":1, name:1, location:1, rating:1}}
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
  
  },  {$unwind:"$services"},
  {$unwind:"$services.subservices"},
  {$match: {"services.subservices.code": code}},
  {$project: {salonId:1,"services.subservices":1,"services._id":1, name:1, location:1, rating:1}}
  ]);
  const stylist = await stylistCursor.toArray();
  db.connection.close();
  return JSON.parse(JSON.stringify(stylist));               
  
  };


//local price range
const getServicesPriceRangeSalonId = async (userlocation, radius, limit,price_gte, price_lte,salonId) =>{
console.log("getServicesPriceRangeSalonId "+userlocation)
let price = [price_gte, price_lte]
const db = await generic.getDatabaseByName("afroturf");
await db.db.collection("salons").ensureIndex({"location.coordinates" : "2dsphere"});
if(empty(userlocation)){
console.log("NO location, radius, limit null")
const stylistCursor = await db.db.collection("salons").aggregate([
  {
    $match:{salonId: parseInt(salonId)}

  }, {$unwind:"$services"},
  {$unwind:"$services.subservices"},                  
  {$match:{$or : [
    {"services.subservices.price":{"$gte":price[0], "$lte":price[1]}}

                 ]}},
  {$project: {salonId:1,"services.subservices":1,"services._id":1, name:1, location:1, rating:1}}
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

}, {$unwind:"$services"},
{$unwind:"$services.subservices"},                  
{$match:{$or : [
  {"services.subservices.price":{"$gte":price[0], "$lte":price[1]}}

               ]}},
{$project: {salonId:1,"services.subservices":1,"services._id":1, name:1, location:1, rating:1}}
]);
const stylist = await stylistCursor.toArray();
db.connection.close();
return JSON.parse(JSON.stringify(stylist));               

};

//local price range
const getServicesPriceRange = async (userlocation, radius, limit,price_gte, price_lte) =>{
  console.log("getServicesPriceRangeSalonId "+userlocation)
  let price = [price_gte, price_lte]
  const db = await generic.getDatabaseByName("afroturf");
  await db.db.collection("salons").ensureIndex({"location.coordinates" : "2dsphere"});
  if(empty(userlocation)){
  console.log("NO location, radius, limit null")
  const stylistCursor = await db.db.collection("salons").aggregate([
 {$unwind:"$services"},
    {$unwind:"$services.subservices"},                  
    {$match:{$or : [
      {"services.subservices.price":{"$gte":price[0], "$lte":price[1]}}
  
                   ]}},
    {$project: {salonId:1,"services.subservices":1,"services._id":1, name:1, location:1, rating:1}}
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
  
  }, {$unwind:"$services"},
  {$unwind:"$services.subservices"},                  
  {$match:{$or : [
    {"services.subservices.price":{"$gte":price[0], "$lte":price[1]}}
  
                 ]}},
  {$project: {salonId:1,"services.subservices":1,"services._id":1, name:1, location:1, rating:1}}
  ]);
  const stylist = await stylistCursor.toArray();
  db.connection.close();
  return JSON.parse(JSON.stringify(stylist));               
  
  };
  
  
// local

//error on this endpoint
const getServicesByTypePriceRangeSalonId = async (userlocation, radius, limit, servicetype, price_gte, price_lte, salonId) =>{
console.log("getServicesByNameTypePriceRange server "+userlocation)
let price = [price_gte, price_lte];
const db = await generic.getDatabaseByName("afroturf");
await db.db.collection("salons").ensureIndex({"location.coordinates" : "2dsphere"});
if(empty(userlocation)){
console.log("NO location, radius, limit null")
const stylistCursor = await db.db.collection("salons").aggregate([
  {$unwind:"$services"},
  {$unwind:"$services.subservices"},
  {$match: {"services.subservices.type":  { '$regex' : servicetype, '$options' : 'i' }}, salonId:parseInt(salonId)},
{$match:{$or : [
  {"services.subservices.price":{"$gte":price[0], "$lte":price[1]}}]}},

  {$project: {salonId:1,"services.subservices":1,"services._id":1, name:1, location:1, rating:1}}
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
    query: {salonId:parseInt(salonId)},
    spherical: true
  }

},
{$unwind:"$services"},
{$unwind:"$services.subservices"},
{$match: {"services.subservices.type":  { '$regex' : servicetype, '$options' : 'i' }}},

{$match:{$or : [
  {"services.subservices.price":{"$gte":price[0], "$lte":price[1]}}]}},
{$project: {salonId:1,"services.subservices":1,"services._id":1, name:1, location:1, rating:1}},


]);
const stylist = await stylistCursor.toArray();
db.connection.close();
return JSON.parse(JSON.stringify(stylist));               

};


const getServicesByTypePriceRange = async (userlocation, radius, limit, servicetype, price_gte, price_lte) =>{
  console.log("getServicesByNameTypePriceRange server "+userlocation)
  let price = [price_gte, price_lte];
  const db = await generic.getDatabaseByName("afroturf");
  await db.db.collection("salons").ensureIndex({"location.coordinates" : "2dsphere"});
  if(empty(userlocation)){
  console.log("NO location, radius, limit null")
  const stylistCursor = await db.db.collection("salons").aggregate([
    {$unwind:"$services"},
    {$unwind:"$services.subservices"},
    {$match: {"services.subservices.type":  { '$regex' : servicetype, '$options' : 'i' }}},
    {$project: {salonId:1,"services.subservices":1,"services._id":1, name:1, location:1, rating:1}}
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
  {$unwind:"$services"},
  {$unwind:"$services.subservices"},
  {$match: {"services.subservices.type":  { '$regex' : servicetype, '$options' : 'i' }}},
  {$project: {salonId:1,"services.subservices":1,"services._id":1, name:1, location:1, rating:1}}
  ]);
  const stylist = await stylistCursor.toArray();
  db.connection.close();
  return JSON.parse(JSON.stringify(stylist));               
  
  };

 
const getAllServicesInSalonId = async (userlocation, radius, limit, salonId) =>{

console.log("getAllServices server "+userlocation)

const db = await generic.getDatabaseByName("afroturf");
await db.db.collection("salons").ensureIndex({"location.coordinates" : "2dsphere"});
if(empty(userlocation)){
console.log("NO location, radius, limit null")

const stylistCursor = await db.db.collection("salons").aggregate([
  {
    $match :{salonId:parseInt(salonId)}
 
 }
  ,{
    $project: {services: 1, salonId:1, name:1, location:1, rating:1}
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

}
,{
  $project: {services: 1, salonId:1, name:1, location:1, rating:1}
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
      $project: {services: 1, salonId:1, name:1, location:1, rating:1}
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
  
  }
  ,{
    $project: {services: 1, salonId:1, name:1, location:1, rating:1}
  }
  
  ]);
  const stylist = await stylistCursor.toArray();
  db.connection.close();
  return JSON.parse(JSON.stringify(stylist));               
  
  };
  

module.exports = {
  getServicesByNameSalonId,//5
  getServicesByName,//5
  getServicesCode, //4
  getServicesCodeSalonId, //4
  getServicesPriceRangeSalonId, //1
  getServicesPriceRange,  //1
  getServicesByTypePriceRangeSalonId, //2
  getServicesByTypePriceRange, //2
  getAllServicesInSalonId, //3
  getAllServices,  //3
}


// let query = {

//   salonId:salonId, //optional
//   serviceName:serviceName,
//   price:price


// }
// let query3 = {

//   salonId:salonId, //optional
//   serviceName:serviceName

// }

// let query5 = {

//   salonId:salonId, //optional


// }

// let query4 = {

//   salonId:salonId, //optional
//   code:code

// }


// let query2 = {

//   salonId:salonId, //optional
//   servicetype:servicetype, 
//   price:price
// }



