const task = require('../controllers/task');
const stylistOps= require('../../app/db/stylist-operations');
const empty = require("is-empty");

// /afroturf/user/:salonId/:stylistId  //returns stylist {params id, id, location (optional), radius (optional)}
const getStylistByIdSalonId = async(ctx) =>{

    let salonId = ctx.params.salonId, stylistId = ctx.params.stylistId;

    let location =  ctx.query.location;
    let radius =  ctx.query.radius;
    if((stylistId || salonId ) === undefined ){ return {res:422, message: "error salonId: int, stylistId:int (required)"}}
    try {
        const userLocation = await task.toLocationObject(location);
        const stylistJson =  stylistOps.getStylistByIdSalonId(salonId,stylistId, userLocation, radius);
        const res = {res: 200, message: "successfully performed operation",
        data: [await stylistJson]}
        ctx.status = 200;
        ctx.message = res.message;
        ctx.body = res.data;
        return ctx.body;
    } catch (error) {
        throw new Error(error);
    }

}

// /afroturf/filter/:salonId/stylist?query={"rating":[0, 5], "gender":male, "name":"t"} //returns all services

const getSalonByStylistNameRatingGenderAndSalonId = async(ctx)=>{

    let salonId = ctx.params.salonId
    console.log(salonId);
    let location =  ctx.query.location, radius =  ctx.query.radius;
    let userLocation = await task.toLocationObject(location);
    //let name = ctx.query.query.name, limit = ctx.query.limit, gender = ctx.query.query.gender, rating = ctx.query.query.rating;



    console.log(ctx.query.query)
    let filterRe; 
    try {
        if(ctx.query.query !== undefined){
            
            filterRe = JSON.parse(ctx.query.query);
            console.log(filterRe)
        }
    } catch (error) {
        console.log("failed")
        const res = {res: 422 , message: "Unprocessable Entity, "+error,
        data: []}
        ctx.status = res.res;
        ctx.message = res.message
        ctx.body = {};
        return;
    }

    let name = filterRe.name, limit = ctx.query.limit, gender = filterRe.gender, rating = filterRe.rating;

    
    if(radius === undefined){ radius = 10}
    
    if(empty(ctx.query.query) && salonId !== undefined){ return await getSalonStylistBySalonId(ctx)}
    if(salonId  === undefined){ return {res:422, message: "error salonId: int (required)"}}
    if(rating === undefined){
        rating = [0,5];
    }
    if(gender === undefined){
        gender = "male|female";
    }
    if(name === undefined){
        name = ".*";
    }
    if(limit === undefined){
        limit = 1000000;
    }
    
    try {

        const stylistJson =  stylistOps.getSalonByStylistNameRatingGenderAndSalonId(userLocation, radius, name, limit, rating,gender, salonId);
        const stylistJson2 =  stylistOps.getSalonByStylistNameRatingGenderAndSalonIdAND(userLocation, radius, name, limit, rating,gender, salonId)
        const res = {res: 200, message: "successfully performed operation",
        data: [{or:[await stylistJson], and:[[await stylistJson2]]}]}
        ctx.status = res.res;
        ctx.message = res.message;
        ctx.body = res.data;
        return ctx.body;
    } catch (error) {
        throw new Error(error);
    }
    
}


const getSalonStylistBySalonId = async(ctx) =>{
    console.log("getSalonStylistBySalonId")
    let salonId = ctx.params.salonId
    let location =  ctx.query.location, radius =  ctx.query.radius, limit =  ctx.query.limit;
    let userLocation = await task.toLocationObject(location);

    if(salonId  === undefined){ return {res:422, message: "error salonId: int (required)"}}
    console.log(salonId)

    if(limit === undefined){
        limit = 1000000;
    }
    
    try {
        
        const stylistJson =  stylistOps.getSalonStylistBySalonId(userLocation, radius, salonId)
        const res = {res: 200, message: "successfully performed operation",
        data: []}
        ctx.status = res.res;
        ctx.message = res.message;
        ctx.body = await stylistJson;
        return ctx.body;
    } catch (error) {
        throw new Error(error);
    }

}



const getAllStylist = async(ctx) =>{
    try{
        let location =  ctx.query.location, radius =  ctx.query.radius;
        let userLocation = await task.toLocationObject(location);

    
        if(radius === undefined){ radius = 10}
        const stylistJson =  stylistOps.getAllStylist(userLocation, radius)
        const res = {res: 200, message: "successfully performed operation",
        data: [await stylistJson]}
        ctx.status = res.res;
        ctx.message = res.message;
        ctx.body = await stylistJson;
    } catch (error) {
        throw new Error(error);
    }
}


module.exports = {
    getStylistByIdSalonId,
    getAllStylist,
    getSalonByStylistNameRatingGenderAndSalonId,
}