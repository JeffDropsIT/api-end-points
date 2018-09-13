const task = require('../controllers/task');
const stylistOps= require('../../app/db/stylist-operations');


// /afroturf/user/:salonId/:stylistId  //returns stylist {params id, id, location (optional), radius (optional)}
const getStylistByIdSalonId = async(ctx) =>{

    let salonId = ctx.params.salonId, stylistId = ctx.params.stylistId;

    const location =  ctx.query.location;
    const radius =  ctx.query.radius;
    if((stylistId || salonId ) === undefined ){ return {res:422, message: "error salonId: int, stylistId:int (required)"}}
    try {
        const userLocation = await task.toLocationObject(location);
        const stylistJson = await stylistOps.getStylistByIdSalonId(salonId,stylistId, userLocation, radius);
        const res = {res: 200, message: "successfully performed operation",
        data: [stylistJson]}
        ctx.body = res;
        return ctx.body;
    } catch (error) {
        throw new Error(error);
    }

}

// /afroturf/filter/:salonId/stylist?query={"rating":[0, 5], "gender":male, "name":"t"} //returns all services

const getSalonByStylistNameRatingGenderAndSalonId = async(ctx)=>{


    let salonId = ctx.params.salonId
    console.log(salonId)
    const location =  ctx.query.location, radius =  ctx.query.radius;
    const name = ctx.query.query.name, limit = ctx.query.query.limit, gender = ctx.query.query.gender, rating = ctx.query.query.rating;
    if(salonId  === undefined){ return {res:422, message: "error salonId: int (required)"}}
    if(rating === undefined){
        rating = [0,5];
    }
    if(gender === undefined){
        gender = "male|female";
    }
    if(limit === undefined){
        limit = 1000000;
    }
    
    try {
        const userLocation = await task.toLocationObject(location);
        const stylistJson = await stylistOps.getSalonByStylistNameRatingGenderAndSalonId(userLocation, radius, name, limit, rating,gender, salonId)
        const res = {res: 200, message: "successfully performed operation",
        data: [stylistJson]}
        ctx.body = res;
    } catch (error) {
        throw new Error(error);
    }
    
}



module.exports = {
    getStylistByIdSalonId,
    getSalonByStylistNameRatingGenderAndSalonId
}