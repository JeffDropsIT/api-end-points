
// /afroturf/salons/stylist/:salonId/:stylistId/q?location=-21.32565,23.54454&
//radius=10000
const getSylistById = async ctx =>{
    const stylistId = ctx.params.stylistId;
    const salonId = ctx.params.salonId;
    const location =  ctx.query.location;
    const radius =  ctx.query.radius;
    if(salonId !== undefined && stylistId !==undefined
    && location !== undefined && radius !==undefined){
        const userLocation = await task.toLocationObject(location);
        ctx.body = await 
        getSylistById(salonId, stylistId, userLocation, radius);
        return ctx.body;
    }
};

// /afroturf/salons/stylist/q?location=-21.32565,23.54454&
//radius=10000&limit=10&rating=4&gender=male&name=Jane;
const getSalonByStylistNameRatingGender = async ctx =>{
    const location =  ctx.query.location;
    const radius =  ctx.query.radius;
    const name =  ctx.query.name;
    const rating =  ctx.query.rating;
    const gender =  ctx.query.gender
    let limit =  ctx.query.limit;
    if(limit !== undefined){
        limit = 10000000000;
    }else if( location !== undefined 
        && name !== undefined && radius !== undefined
        && limit !== undefined && gender !== undefined
        && rating !== undefined){
        const userLocation = await task.toLocationObject(location);
        ctx.body = await 
        salonClient.getSalonByStylistNameRatingGender
        (userLocation, radius, name, limit, rating, gender);

        return ctx.body;
    }

};
// /afroturf/salons/stylist/q?location=-21.32565,23.54454&
//radius=10000&limit=10&rating=4&gender=male;
const getSalonByStylistRatingGender = async ctx =>{
    const location =  ctx.query.location;
    const radius =  ctx.query.radius;
    const rating =  ctx.query.rating;
    const gender =  ctx.query.gender
    let limit =  ctx.query.limit;
    if(limit !== undefined){
        limit = 10000000000;
    }else if(location !== undefined && radius !== undefined
        && limit !== undefined && gender !== undefined 
        && rating !== undefined){
        
        return ctx.body;
    }
};
// /afroturf/salons/stylist/q?location=-21.32565,23.54454&
//radius=10000&limit=10&rating=4;
const getSalonByStylistRating = async ctx =>{
    const location = await ctx.query.location;
    const radius = await ctx.query.radius;
    const rating = await ctx.query.rating;
    const limit = await ctx.query.limit;
    if(limit !== undefined){
        limit = 10000000000;
    }else if(location !== undefined && radius !== undefined
        && limit !== undefined && rating !== undefined){
            
    }
};

// /afroturf/salons/stylist/global-q?location=-21.32565,23.54454&
//radius=10000&limit=10&gender=male&rating=4;
const stylistQueries = async ctx =>{
    const location = await ctx.query.location;
    const radius = await ctx.query.radius;
    const name = await ctx.query.name;
    const rating = await ctx.query.rating;
    const gender = await ctx.query.gender
    const limit = await ctx.query.limit; 
    if(limit !== undefined){
        limit = 10000000000;
    }else if(location !== undefined && name !== undefined && radius !== undefined
        && limit !== undefined && gender !== undefined
        && rating !== undefined){
            const userLocation = await task.toLocationObject(location);
            ctx.body = await 
            salonClient.getSalonByStylistRatingGender(userLocation, radius, limit, rating, gender);
            return ctx.body;
    }else if(location !== undefined && radius !== undefined
        && limit !== undefined && gender !== undefined
         && rating !== undefined){
    
            const userLocation = await task.toLocationObject(location);
            ctx.body = await 
            salonClient.getSalonByStylistRatingGender(userLocation, radius, limit, rating, gender);
            return ctx.body;
    }else if(location !== undefined && radius !== undefined
        && limit !== undefined && rating !== undefined){
            const userLocation = await task.toLocationObject(location);
            ctx.body = await salonClient.getSalonByStylistRating(userLocation, radius, limit, rating);
        return ctx.body;
    }
    
};
// /afroturf/salons/stylist/:salonId/local-q?location=-21.32565,23.54454&
//radius=10000&limit=10&gender=male&rating=4;
const stylistQueriesLocal = async ctx =>{
    const location = await ctx.query.location;
    const radius = await ctx.query.radius;
    const salonId = ctx.params.salonId;
    const name = await ctx.query.name;
    const rating = await ctx.query.rating;
    const gender = await ctx.query.gender
    const limit = await ctx.query.limit; 
    if(location !== undefined && name !== undefined && radius !== undefined
        && limit !== undefined && gender !== undefined
        && rating !== undefined && salonId !== undefined){
            return await 
            salonClient
            .getSalonByStylistNameRatingGenderAndSalonId(location, limit, radius,salonId,gender,rating, name);
    }else if(location !== undefined && radius !== undefined
        && limit !== undefined && gender !== undefined
        && rating !== undefined && salonId !== undefined){
    
            return await 
            salonClient
            .getSalonByStylistRatingGenderAndSalonId(location, limit, radius,salonId,gender,rating);
    }else if(location !== undefined && radius !== undefined
        && limit !== undefined && rating !== undefined 
        &&salonId !== undefined){
            return await 
            salonClient.getSalonByStylistRatingAndSalonId(location, limit, radius,salonId,
            rating);
    }else if(location !== undefined && radius !== undefined
        && salonId !== undefined){
            return await salonClient
            .getSalonStylistBySalonId(location, radius ,salonId);
    }
    
};

//filter 
// /afroturf/salons/stylist/filter/?location=-21.32565,23.54454&
//radius=10000&limit=10&gender=male&rating=4;
const stylistsFilter = async ctx =>{
    const location = await ctx.query.location;
    const radius = await ctx.query.radius;
    const name = await ctx.query.name;
    const rating = await ctx.query.rating;
    const gender = await ctx.query.gender
    const limit = await ctx.query.limit;
    if(location !== undefined && name !== undefined && radius !== undefined
        && limit !== undefined && gender !== undefined
        && rating !== undefined){
            return await getSalonByStylistNameRatingGender(ctx);

    }else if(location !== undefined && radius !== undefined
        && limit !== undefined && gender !== undefined
         && rating !== undefined){
    
            return await getSalonByStylistRatingGender(ctx);
    }else if(location !== undefined && radius !== undefined
        && limit !== undefined && rating !== undefined){
            return await getSalonByStylistRating(ctx);
        }
        
};