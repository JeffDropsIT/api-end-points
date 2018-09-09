const task = require('../controllers/task');
const stylistOps= require('../../app/db/stylist-operations');

// /afroturf/salons/stylist/:salonId/:stylistId/q?location=-21.32565,23.54454&
//radius=10000
const getStylistById = async ctx =>{
    console.log("getStylistById")
    const stylistId = ctx.params.stylistId;
    const salonId = ctx.params.salonId;
    const location =  ctx.query.location;
    const radius =  ctx.query.radius;
    if(salonId !== undefined && stylistId !==undefined){
        const userLocation = await task.toLocationObject(location);
        ctx.body = await 
        stylistOps.getStylistById(salonId, stylistId, userLocation, radius);
        
    }
};



// /afroturf/salons/stylist/global-q?location=-21.32565,23.54454&
//radius=10000&limit=10&gender=male&rating=4;
const stylistQueries = async ctx =>{
    console.log("stylistQueries - in")
    const location = await ctx.query.location;
    const radius = await ctx.query.radius;
    const name = await ctx.query.name;
    const rating = await ctx.query.rating;
    const gender = await ctx.query.gender
    let limit = await ctx.query.limit; 

    if(limit == undefined){
        limit = 10000000;
    }
     if(name !== undefined
        && gender !== undefined && rating !== undefined) {
            console.log("getSalonByStylistNameRatingGender - iin")
            const userLocation = await task.toLocationObject(location);
            ctx.body = await 
            stylistOps.getSalonByStylistNameRatingGender(userLocation, radius, name,limit, rating, gender);
            
    }else if(gender !== undefined
         && rating !== undefined){

            console.log("getSalonByStylistRatingGender - iiin")
            const userLocation = await task.toLocationObject(location);
            ctx.body = await 
            stylistOps.getSalonByStylistRatingGender(userLocation, radius, limit, rating, gender);
     
    }else if( rating !== undefined){
            console.log("getSalonByStylistRating - iiiin")
            const userLocation = await task.toLocationObject(location);
            ctx.body = await stylistOps.getSalonByStylistRating(userLocation, radius, limit, rating);
        
    }else if(gender !== undefined){
            console.log("getSalonByStylistGenderAndSalonId2 stylist")
            
            userLocation = await task.toLocationObject(location);
            ctx.body =  await 
            stylistOps.getSalonByStylistGenderAndSalonId2(userLocation, radius, limit, gender);
    } 
    else{
            console.log("getSalonAllStylist - iiiin")
            const userLocation = await task.toLocationObject(location);
            ctx.body = await stylistOps.getSalonAllStylist(userLocation, radius);
        
    }
    
};
// /afroturf/salons/stylist/:salonId/local-q?location=-21.32565,23.54454&
//radius=10000&limit=10&gender=male&rating=4;
const stylistQueriesLocal = async ctx =>{
    console.log("---stylistQueriesLocal--- -entry: "+ctx.params.salonId)
    const location = await ctx.query.location;
    const radius = await ctx.query.radius;
    const salonId = ctx.params.salonId;
    const name = await ctx.query.name;
    const rating = await ctx.query.rating;
    const gender = await ctx.query.gender
    let limit = await ctx.query.limit; 


    let userLocation;
    if(limit == undefined){
        limit = 10000000000;
    }
    if(name !== undefined && gender !== undefined
        && rating !== undefined && salonId !== undefined){
            console.log("getSalonByStylistNameRatingGenderAndSalonId stylist")
            
            userLocation = await task.toLocationObject(location);
            ctx.body = await 
            stylistOps
            .getSalonByStylistNameRatingGenderAndSalonId(userLocation, radius, name,limit, rating, gender, salonId);
    }else if(gender !== undefined
        && rating !== undefined && salonId !== undefined){

            console.log("getSalonByStylistRatingGenderAndSalonId stylist")
            
            userLocation = await task.toLocationObject(location);
            ctx.body =  await 
            stylistOps
            .getSalonByStylistRatingGenderAndSalonId(userLocation, radius,limit, rating, gender, salonId);
    }else if(rating !== undefined 
        &&salonId !== undefined){
            console.log("getSalonByStylistRatingAndSalonId stylist")
            
            userLocation = await task.toLocationObject(location);
            ctx.body =  await 
            stylistOps.getSalonByStylistRatingAndSalonId(userLocation, radius, limit, rating, gender, salonId);
    }else if(gender !== undefined 
        &&salonId !== undefined){
            console.log("getSalonByStylistGenderAndSalonId stylist")
            
            userLocation = await task.toLocationObject(location);
            ctx.body =  await 
            stylistOps.getSalonByStylistGenderAndSalonId(userLocation, radius, limit, gender, salonId);
    } else {
        
        console.log("get all SalonStylistBySalonId stylist")
            
            userLocation = await task.toLocationObject(location);
            ctx.body =  await stylistOps
            .getSalonStylistBySalonId(userLocation, radius ,salonId);
    }
    console.log("end of script")
    
};


module.exports = {
    getStylistById,
    stylistQueries,
    stylistQueriesLocal,
}