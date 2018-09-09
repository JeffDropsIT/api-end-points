const task = require('../controllers/task');
const servicesOps= require('../../app/db/services-operations');



//filter 
///afroturf/salons/:salonId/services/filter/?location=23.123,21.3434
//&radius=10&price_lte=50&service=hairstyles&price_gte=10&code=F567B&type=Locks

const servicesFilterLocal = async ctx => {

    const location =  ctx.query.location;
    const radius =  ctx.query.radius;
    const price_lte =  ctx.query.price_lte;
    const price_gte =  ctx.query.price_gte; //handle gte and lte error
    let serviceName =  ctx.query.service;
    let servicetype =  ctx.query.type;
    let code = ctx.query.code;
    if(serviceName !== undefined){
        serviceName = serviceName.toLowerCase();
    }
    if(servicetype !== undefined){
        servicetype = servicetype.toLowerCase()
    };
    if(code !== undefined){
        code = code //.toLowerCase();
    }
    const salonId = ctx.params.salonId;
    
    let limit = ctx.query.limit;
    let userLocation;
    
    if(limit == undefined){
        limit = 1000000;
    }
    if(serviceName !== undefined && price_lte !==undefined
     && servicetype !== undefined 
    &&price_gte !==undefined&&code !== undefined && salonId !==undefined){
        userLocation = await task.toLocationObject(location);
        ctx.body = await servicesOps.getServicesByNameTypePriceRangeCodeAndSalonId(userLocation, radius, limit, serviceName, servicetype, price_gte, price_lte, code,salonId);

        
    
    }else if(serviceName !== undefined && price_lte !==undefined
        && servicetype !== undefined 
        && price_gte !==undefined&& salonId !==undefined){
            console.log("getServicesByNameTypePriceRangeAndSalonId");
            userLocation = await task.toLocationObject(location);
            ctx.body = await servicesOps.getServicesByNameTypePriceRangeAndSalonId(userLocation, radius, limit, serviceName, servicetype, price_gte, price_lte,salonId);
            
        
    }else if(serviceName !== undefined && price_lte !==undefined 
        && price_gte !==undefined&& salonId !==undefined){
            console.log("getServicesByNamePriceRangeAndSalonId");
            userLocation = await task.toLocationObject(location);
            ctx.body = await servicesOps.getServicesByNamePriceRangeAndSalonId(userLocation, radius, limit, serviceName, price_gte, price_lte,salonId);
            
        
    }else if(serviceName !== undefined 
        && salonId !== undefined
        && servicetype !== undefined){
            //get all nearest services by name and price range (above + below -) and salonId
            //if contains - all below price else if + all above price
            console.log(servicetype+" getServicesByNameTypeSalonId - "+serviceName)
            userLocation = await task.toLocationObject(location);
            ctx.body = await servicesOps.getServicesByNameTypeSalonId(userLocation, radius, limit, serviceName, servicetype, salonId);

    }else if(serviceName !== undefined 
        &&  salonId !== undefined){
            //get all nearest services by name and price range (above + below -) and salonId
            //if contains - all below price else if + all above price
            console.log("-- getServicesByNameSalonId - "+serviceName)
            userLocation = await task.toLocationObject(location);
            ctx.body = await servicesOps.getServicesByNameSalonId(userLocation, radius, limit,serviceName, salonId);
            return ctx.body;
    }else if( salonId !== undefined
      ){
            userLocation = await task.toLocationObject(location);
            console.log(servicetype+" getServicesSalonId - "+serviceName)
            ctx.body = await servicesOps.getServicesSalonId(userLocation, radius, limit, salonId);
         
    }


    

    


    

    //also create a filter for services


};

///afroturf/salons/services/global-q?location=23.123,21.3434
//&radius=10&price_lte=50&service=hairstyles&price_gte=10&code=F567B&type=Locks

const servicesFilterGlobal = async ctx => {
    console.log("servicesFilterGlobal ---344 ");
    const location =  ctx.query.location;
    const radius =  ctx.query.radius;
    const price_lte =  ctx.query.price_lte;
    const price_gte =  ctx.query.price_gte; //handle gte and lte error
    
    let serviceName =  ctx.query.service;
    let servicetype =  ctx.query.type;
    let code = ctx.query.code;
    if(serviceName !== undefined){
        serviceName = serviceName.toLowerCase();
    }
    if(servicetype !== undefined){
        servicetype = servicetype.toLowerCase()
    };
    if(code !== undefined){
        code = code //.toLowerCase();
    }
    
    let limit = ctx.query.limit;
    let userLocation;
  
    if(limit == undefined){
        limit = 1000000;
    }
    if(serviceName !== undefined && price_lte !==undefined
    && servicetype !== undefined 
    &&price_gte !==undefined&&code !== undefined){
        
        console.log("getServicesByNameTypePriceRangeCode ---345 ");
        userLocation = await task.toLocationObject(location);
        ctx.body = await servicesOps.getServicesByNameTypePriceRangeCode(userLocation, radius, limit, serviceName, servicetype, price_gte, price_lte, code);

    
    }else if(serviceName !== undefined && price_lte !==undefined
        && servicetype !== undefined 
        && price_gte !==undefined){
            console.log("getServicesByNameTypePriceRange --- 347");
            userLocation = await task.toLocationObject(location);
            ctx.body = await servicesOps.getServicesByNameTypePriceRange(userLocation, radius, limit, serviceName, servicetype, price_gte, price_lte);
            
        
    }else if(serviceName !== undefined && price_lte !==undefined
        && price_gte !== undefined){
            console.log("getServicesByNamePriceRange -- 348");
            userLocation = await task.toLocationObject(location);
            ctx.body = await servicesOps.getServicesByNamePriceRange(userLocation, radius, limit, serviceName, price_gte, price_lte);
            
        
    }else if( serviceName !== undefined 
        && servicetype !== undefined && limit !== undefined){
           

            console.log(servicetype+" getServicesByNameType ----349 "+serviceName)
            userLocation = await task.toLocationObject(location);
            ctx.body = await servicesOps.getServicesByNameType(userLocation, radius, limit, serviceName, servicetype);

    }else if(serviceName !== undefined
        && limit !== undefined){
            //get all nearest services by name and price range (above + below -) and salonId
            //if contains - all below price else if + all above price
            console.log(servicetype+" getServicesByName -360 "+serviceName)
            userLocation = await task.toLocationObject(location);
            ctx.body = await servicesOps.getServicesByName(userLocation, radius, limit,serviceName);
      
    }else{
            console.log(servicetype+" getServicesByName -360 "+serviceName)
            userLocation = await task.toLocationObject(location);
            ctx.body = await servicesOps.getAllServices([]);
    }


    

    


    

    //also create a filter for services


};

module.exports = {
    servicesFilterLocal,
    servicesFilterGlobal,
}

