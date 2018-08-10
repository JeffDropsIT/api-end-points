const task = require('../controllers/task');
const salonClient = require('../db/databaseClient');





// /afroturf/salons/:salonId/?location=23.123,21.3434
//&radius=10
const getSalonBySalonId = async ctx => {

    const location =  ctx.query.location;
    const radius =  ctx.query.radius;
    const salonId =  ctx.params.salonId;
    if(location !== undefined && 
        salonId !== undefined &&radius !== undefined){
        const userLocation = await task.toLocationObject(location);
        ctx.body = await salonClient.getSalonBySalonId(salonId, userLocation, radius);
        return ctx.body;
    }


};

// /afroturf/salons/q?location=23.123,21.3434
//&radius=10&limit=10&name=HeartBeauty
const getSalonByName = async ctx => {
    console.log("WE ARE IN 2");
    const location =  ctx.query.location;
    const radius =  ctx.query.radius;
    const name =  ctx.query.name;
    const limit =  ctx.query.limit;
    if(location !== undefined &&
      name !== undefined &&
      radius !== undefined 
      && limit !== undefined ){
        const userLocation = await task.toLocationObject(location);
        ctx.body = await salonClient.getSalonByName(name, userLocation, radius,limit);
        return ctx.body;
    }
    


};
// /afroturf/salons/?location=23.123,21.3434
//&radius=10&limit=10
const getNearestSalons = async ctx =>{

    const location =  ctx.query.location;
    const radius =  ctx.query.radius;
    const limit =  ctx.query.limit;

    if(location !== undefined && radius !== undefined && limit !== undefined ){
        const userLocation = await task.toLocationObject(location);
        ctx.body = await salonClient.getNearestSalons(userLocation, radius,limit);
        return ctx.body;
    }
};


// shallow

const getAllNearestSalonsShallow = async ctx => {

    const location =  ctx.query.location;
    const radius =  ctx.query.radius;
    if(location !== undefined 
        && radius !== undefined){
        const userLocation = await task.toLocationObject(location);
        ctx.body = await salonClient.getAllNearestSalonsShallow(userLocation, radius);
        return ctx.body;
    }


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

    if(location !== undefined
         && name !== undefined 
         &&radius !== undefined && 
         limit !== undefined ){
        const userLocation = await task.toLocationObject(location);
        ctx.body = await
         salonClient.getSalonByNameShallow
         (name, userLocation, radius,limit);
        return ctx.body;
    }
};
const getSalonBySalonIdShallow = async ctx =>{
    const location =  ctx.query.location;
    const radius =  ctx.query.radius;
    const salonId =  ctx.params.salonId;


    if(location !== undefined && salonId !== undefined 
        &&radius !== undefined){
        const userLocation = await task.toLocationObject(location);
        ctx.body = await 
        salonClient.getSalonBySalonIdShallow(salonId, userLocation, radius);
        return ctx.body;
    }
}


const getAllSalons = async ctx =>{

    ctx.body = await salonClient.getAllSalons();
    return ctx.body;
}

//filter 




module.exports = {
    getAllNearestSalonsShallow,
    getNearestSalons, 
    getSalonByName, 
    getSalonByNameShallow, 
    getSalonBySalonIdShallow,
    getSalonBySalonId,
    getAllSalons

};