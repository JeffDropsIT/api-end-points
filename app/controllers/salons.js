const task = require('./task');




// /afroturf/salons/:salonId/?location=23.123,21.3434
//&radius=10
const getSalonBySalonId = async ctx => {

    const location = await ctx.query.location;
    const radius = await ctx.query.radius;
    const salonId = await ctx.params.salonId;
    if(location !== undefined && 
        salonId !== undefined &&radius !== undefined){
        const userLocation = await task.toLocationObject(location);
        ctx.body = await salonClient.getSalonBySalonId(salonId, userLocation, radius);
    }


};

// /afroturf/salons/q?location=23.123,21.3434
//&radius=10&limit=10&name=HeartBeauty
const getSalonByName = async ctx => {

    const location = await ctx.query.location;
    const radius = await ctx.query.radius;
    const name = await ctx.query.name;
    const limit = await ctx.query.limit;
    if(location !== undefined && name !== undefined &&radius !== undefined && limit !== undefined ){
        const userLocation = await task.toLocationObject(location);
        ctx.body = await salonClient.getSalonByName(name, userLocation, radius,limit);
    }


};
// /afroturf/salons/?location=23.123,21.3434
//&radius=10&limit=10
const getNearestSalons = async ctx =>{

    const location = await ctx.query.location;
    const radius = await ctx.query.radius;
    const limit = await ctx.query.limit;

    if(location !== undefined && radius !== undefined && limit !== undefined ){
        const userLocation = await task.toLocationObject(location);
        ctx.body = await salonClient.getNearestSalons(userLocation, radius,limit);
    }
};


// shallow

const getAllNearestSalonsShallow = async ctx => {

    const location = await ctx.query.location;
    const radius = await ctx.query.radius;
    if(location !== undefined 
        && radius !== undefined){
        const userLocation = await task.toLocationObject(location);
        ctx.body = await salonClient.getAllNearestSalonsShallow(userLocation, radius,limit);
    }


};

const getSalonByNameShallow = async ctx =>{
    const location = await ctx.query.location;
    const radius = await ctx.query.radius;
    const name = await ctx.query.name;
    const limit = await ctx.query.limit;

    if(location !== undefined && name !== undefined &&radius !== undefined && limit !== undefined ){
        const userLocation = await task.toLocationObject(location);
        ctx.body = await salonClient.getSalonByNameShallow(name, userLocation, radius,limit);
    }
};
const getSalonBySalonIdShallow = async ctx =>{
    const location = await ctx.query.location;
    const radius = await ctx.query.radius;
    const salonId = await ctx.params.salonId;

    if(location !== undefined && salonId !== undefined &&radius !== undefined){
        const userLocation = await task.toLocationObject(location);
        ctx.body = await salonClient.getSalonBysalonIdShallow(nasalonIdme, userLocation, radius,limit);
    }
}

//filter 




module.exports = {
    getAllNearestSalonsShallow,
    getNearestSalons, 
    getSalonByName, 
    getSalonByNameShallow, 
    getSalonBySalonIdShallow,
    getSalonBySalonId

};