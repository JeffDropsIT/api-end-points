const task = require('../controllers/task');
const salonOps= require('../../app/db/salon-operations');


const getSalonBySalonObj = async(ctx) =>{
    const location =  ctx.query.location;
    const radius =  ctx.query.radius;
    const salonObj =  ctx.query.salonObj;
    
    if(salonObj !== undefined ){
        const userLocation = await task.toLocationObject(location);
        ctx.body = await salonOps.getSalonBySalonObj(salonObj, userLocation, radius);
        
    }else{
        ctx.body = {res: "404", message:"missing salon object id"}
    }


}
// /afroturf/salons/:salonId/?location=23.123,21.3434
//&radius=10
const getSalonBySalonId = async ctx => {

    const location =  ctx.query.location;
    const radius =  ctx.query.radius;
    const salonId =  ctx.params.salonId;
    if(salonId !== undefined ){
        const userLocation = await task.toLocationObject(location);
        ctx.body = await salonOps.getSalonBySalonId(salonId, userLocation, radius);
        
    }


};
// /afroturf/salons/q?location=23.123,21.3434
//&radius=10&limit=10&rating=4
//or
// /afroturf/salons/q?location=23.123,21.3434
//&radius=10&limit=10&name=HeartBeauty
const getSalonByNameOrRating = async ctx => {
    console.log("getSalonByNameOrRating");
    const location =  ctx.query.location;
    const radius =  ctx.query.radius;
    const name =  ctx.query.name;
    let limit =  ctx.query.limit;
    const rating =  ctx.query.rating;
    if(limit == undefined){
        limit = 10000000000000000;
    }
    if(name !== undefined && rating === undefined ){
        const userLocation = await task.toLocationObject(location);
        ctx.body = await salonOps.getSalonByName(name, userLocation, radius,limit);
        return ctx.body;
    }else if(rating !== undefined && name === undefined){
          const userLocation = await task.toLocationObject(location);
          ctx.body = await salonOps.getSalonByRating(rating, userLocation, radius,limit);
          
      }else{
          return {res:401, message: "path not found include rating or name"}
      }
    


};
// /afroturf/salons/?location=23.123,21.3434
//&radius=10&limit=10
const getNearestSalons = async ctx =>{

    const location =  ctx.query.location;
    const radius =  ctx.query.radius;
    let limit =  ctx.query.limit;
    if(limit == undefined){
        limit = 10000000000000000;
    }

    const userLocation = await task.toLocationObject(location);
    ctx.body = await salonOps.getNearestSalons(userLocation, radius,limit);
        
    
};


// shallow

const getAllNearestSalonsShallow = async ctx => {
    console.log("----getAllNearestSalonsShallow-----");
    const location =  ctx.query.location;
    const radius =  ctx.query.radius;
  
    const userLocation = await task.toLocationObject(location);
    console.log(userLocation)
    ctx.body = await salonOps.getAllNearestSalonsShallow(userLocation, radius);
    


};

const getSalonByNameShallow = async ctx =>{
    console.log("getSalonByNameShallow -salons")
    const location =  ctx.query.location;
    const radius =  ctx.query.radius;
    const name =  ctx.query.name;
    let limit =  ctx.query.limit;
    if(limit == undefined){
        limit = 10000000000000000;
    }

    if( name !== undefined ){
        const userLocation = await task.toLocationObject(location);
        ctx.body = await
        salonOps.getSalonByNameShallow
         (name, userLocation, radius,limit);
        
    }
};
const getSalonBySalonIdShallow = async ctx =>{
    const location =  ctx.query.location;
    const radius =  ctx.query.radius;
    const salonId =  ctx.params.salonId;
    

    if(salonId !== undefined){
        const userLocation = await task.toLocationObject(location);
        ctx.body = await 
        salonOps.getSalonBySalonIdShallow(salonId, userLocation, radius);
        
    }
}


const getAllSalons = async ctx =>{

    ctx.body = await salonOps.getAllSalons();
    
}

//filter 




module.exports = {
    getAllNearestSalonsShallow,
    getNearestSalons, 
    getSalonByNameOrRating, 
    getSalonByNameShallow, 
    getSalonBySalonIdShallow,
    getSalonBySalonId,
    getAllSalons,
    getSalonBySalonObj,


};