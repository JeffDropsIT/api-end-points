const salonClient = require('../db/databaseClient');
const task = require('../controllers/task');


// /afroturf/salons/stylist/:salonId/:stylistId/q?location=-21.32565,23.54454&
//radius=10000
const getStylistById = async ctx =>{
    console.log("getStylistById")
    const stylistId = ctx.params.stylistId;
    const salonId = ctx.params.salonId;
    const location =  ctx.query.location;
    const radius =  ctx.query.radius;
    if(salonId !== undefined && stylistId !==undefined
    && location !== undefined && radius !==undefined){
        const userLocation = await task.toLocationObject(location);
        ctx.body = await 
        salonClient.getStylistById(salonId, stylistId, userLocation, radius);
        
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
     if(location !== undefined && name !== undefined && radius !== undefined
        && limit !== undefined && gender !== undefined
        && rating !== undefined){
            console.log("getSalonByStylistNameRatingGender - iin")
            const userLocation = await task.toLocationObject(location);
            ctx.body = await 
            salonClient.getSalonByStylistNameRatingGender(userLocation, radius, name,limit, rating, gender);
            
    }else if(location !== undefined && radius !== undefined
        && limit !== undefined && gender !== undefined
         && rating !== undefined){

            console.log("getSalonByStylistRatingGender - iiin")
            const userLocation = await task.toLocationObject(location);
            ctx.body = await 
            salonClient.getSalonByStylistRatingGender(userLocation, radius, limit, rating, gender);
     
    }else if(location !== undefined && radius !== undefined
        && limit !== undefined && rating !== undefined){
            console.log("getSalonByStylistRating - iiiin")
            const userLocation = await task.toLocationObject(location);
            ctx.body = await salonClient.getSalonByStylistRating(userLocation, radius, limit, rating);
        
    }
    else if(location !== undefined && radius !== undefined
        && limit !== undefined ){
            console.log("getSalonAllStylist - iiiin")
            const userLocation = await task.toLocationObject(location);
            ctx.body = await salonClient.getSalonAllStylist(userLocation, radius);
        
    }
    
};
// /afroturf/salons/stylist/:salonId/local-q?location=-21.32565,23.54454&
//radius=10000&limit=10&gender=male&rating=4;
const stylistQueriesLocal = async ctx =>{
    console.log("stylistQueriesLocal -entry")
    const location = await ctx.query.location;
    const radius = await ctx.query.radius;
    const salonId = ctx.params.salonId;
    const name = await ctx.query.name;
    const rating = await ctx.query.rating;
    const gender = await ctx.query.gender
    let limit = await ctx.query.limit; 
    let userLocation;
    if(location !== undefined){
        userLocation = await task.toLocationObject(location);
    }
    if(limit == undefined){
        limit = 10000000000;
    }else if(location !== undefined && name !== undefined && radius !== undefined
        && limit !== undefined && gender !== undefined
        && rating !== undefined && salonId !== undefined){
            console.log("getSalonByStylistNameRatingGenderAndSalonId stylist")
            ctx.body = await 
            salonClient
            .getSalonByStylistNameRatingGenderAndSalonId(userLocation, radius, name,limit, rating, gender, salonId);
    }else if(location !== undefined && radius !== undefined
        && limit !== undefined && gender !== undefined
        && rating !== undefined && salonId !== undefined){

            console.log("getSalonByStylistRatingGenderAndSalonId stylist")
            tx.body =  await 
            salonClient
            .getSalonByStylistRatingGenderAndSalonId(userLocation, radius,limit, rating, gender, salonId);
    }else if(location !== undefined && radius !== undefined
        && limit !== undefined && rating !== undefined 
        &&salonId !== undefined){
            console.log("getSalonByStylistRatingAndSalonId stylist")
            tx.body =  await 
            salonClient.getSalonByStylistRatingAndSalonId(userLocation, radius, limit, rating, gender, salonId);
    }else if(location !== undefined && radius !== undefined
        && salonId !== undefined){
            console.log("get all SalonStylistBySalonId stylist")
            tx.body =  await salonClient
            .getSalonStylistBySalonId(userLocation, radius ,salonId);
    }
    
};


module.exports = {
    getStylistById,
    stylistQueries,
    stylistQueriesLocal,
}