const task = require('../controllers/task');
const salonClient = require('../db/databaseClient');

// ///afroturf/salons/services/?location=23.123,21.3434
// //&radius=10&service=hairstyles
// const getServicesByName = async ctx => {
//     const location =  ctx.query.location;
//     const radius =  ctx.query.radius;
//     const serviceName =  ctx.query.service;
//     if(location !== undefined && serviceName !== undefined 
//         && radius !== undefined){
//             const userLocation = await task.toLocationObject(location);
//             //get all nearest services by name 
//     }
// };
// ///afroturf/salons/:salonId/services/?location=23.123,21.3434
// //&radius=10&service=hairstyles

// const getServicesByNameAndSalonId= async ctx =>{
//     const salonId =  ctx.query.salonId;
//     const location =  ctx.query.location;
//     const radius =  ctx.query.radius;
//     const serviceName =  ctx.query.service;
//     if(location !== undefined && radius !== undefined 
//         && serviceName !== undefined && salonId !== undefined){
//             const userLocation = await task.toLocationObject(location);
//             //get services by name and type for a salonId
//     };
// };

// ///afroturf/salons/services/?location=23.123,21.3434
// //&radius=10&type=locks
// const getServicesByType = async ctx => {
//     const location =  ctx.query.location;
//     const radius =  ctx.query.radius;
//     const servicetype =  ctx.query.type;
//     if(location !== undefined && serviceName !== undefined 
//         && radius !== undefined && servicetype !== undefined){
//             const userLocation = await task.toLocationObject(location);
//             //get all nearest services by name and type 
//     }
// };
// ///afroturf/salons/:salonId/services/?location=23.123,21.3434
// //&radius=10&type=Locks

// const getServicesByTypeAndSalonId= async ctx =>{
//     const salonId =  ctx.query.salonId;
//     const location =  ctx.query.location;
//     const radius =  ctx.query.radius;
//     const servicetype =  ctx.query.type;
//     if(location !== undefined && radius !== undefined 
//         && servicetype !== undefined && salonId !== undefined){
//             const userLocation = await task.toLocationObject(location);
//             //get services by name and type for a salonId
//     };
// };

// ///afroturf/salons/services/?location=23.123,21.3434
// //&radius=10&service=hairstyles&type=locks
// const getServicesByTypeAndName = async ctx => {
//     const location =  ctx.query.location;
//     const radius =  ctx.query.radius;
//     const serviceName =  ctx.query.service;
//     const servicetype =  ctx.query.type;
//     if(location !== undefined && serviceName !== undefined 
//         && radius !== undefined && servicetype !== undefined){
//             const userLocation = await task.toLocationObject(location);
//             //get all nearest services by name and type 
//     }
// };

// ///afroturf/salons/:salonId/services/?location=23.123,21.3434
// //&radius=10&service=hairstyles&type=locks
// const getServicesByTypeAndNameAndSalonId = async ctx => {
//     const salonId =  ctx.query.salonId;
//     const location =  ctx.query.location;
//     const radius =  ctx.query.radius;
//     const serviceName =  ctx.query.service;
//     const servicetype =  ctx.query.type;
//     if(location !== undefined && serviceName !== undefined 
//         && radius !== undefined && salonId !==undefined && servicetype !== undefined){
//             const userLocation = await task.toLocationObject(location);
//             //get all nearest services by name and type 
//     }
// };


// ///afroturf/salons/services/?location=23.123,21.3434
// //&radius=10&service=hairstyles&code=F567B
// const getServicesByNameAndCode = async ctx => {

//     const location =  ctx.query.location;
//     const radius =  ctx.query.radius;
//     const serviceName =  ctx.query.service;
//     const code =  ctx.query.code;
//     if(location !== undefined && radius !==undefined && serviceName !== undefined
//          && undefined && code !== undefined){
//             const userLocation = await task.toLocationObject(location);
//             //get all nearest services by code
//     }
// };


// ///afroturf/salons/:salonId/services/?location=23.123,21.3434
// //&radius=10&service=hairstyles&code=F567B
// const getServicesByNameAndCodeAndSalonId = async ctx => {
//     const salonId =  ctx.query.salonId;
//     const location =  ctx.query.location;
//     const radius =  ctx.query.radius;
//     const serviceName =  ctx.query.service;
//     const code =  ctx.query.code;
//     if(location !== undefined && radius !==undefined && salonId !==undefined && serviceName !== undefined
//          && undefined && code !== undefined){
//             const userLocation = await task.toLocationObject(location);
//             //get all nearest services by code
//     }
// };

// ///afroturf/salons/services/?location=23.123,21.3434
// //&radius=10&service=hairstyles&price=50
// const getServicesByPrice = async ctx => {

//     const location =  ctx.query.location;
//     const radius =  ctx.query.radius;
//     const serviceName =  ctx.query.service;
//     const price =  ctx.query.price;
//     if(location !== undefined && radius !== undefined && serviceName !== undefined 
//         && code !== undefined && price !==undefined){
//             const userLocation = await task.toLocationObject(location);
//             //get all nearest services by price
//     }
// };
// ///afroturf/salons/:salonId/services/?location=23.123,21.3434
// //&radius=10&service=hairstyles&price=50&
// const getServicesByPriceAndSalonId = async ctx => {

//     const salonId =  ctx.query.salonId;
//     const location =  ctx.query.location;
//     const radius =  ctx.query.radius;
//     const serviceName =  ctx.query.service;
//     const price =  ctx.query.price;
//     if(location !== undefined && radius !== undefined && serviceName !== undefined 
//         && code !== undefined && price !==undefined &&salonId !== undefined){
//             const userLocation = await  task.toLocationObject(location);
//             //get all nearest services by price
//     }
// };
// ///afroturf/salons/services/?location=23.123,21.3434
// //&radius=10&code=F567B

// const getServicesByCode = async ctx => {
//     const location =  ctx.query.location;
//     const radius =  ctx.query.radius;
//     const code =  ctx.query.code;
//     if(location !== undefined && radius !== undefined && code !== undefined){
//             const userLocation = await task.toLocationObject(location);
//             //get all nearest services by code and salonId
//     }
// };

// ///afroturf/salons/:salonId/services/?location=23.123,21.3434
// //&radius=10&code=F567B

// const getServicesByCodeAndSalonId = async ctx => {
//     const salonId =  ctx.query.salonId;
//     const location =  ctx.query.location;
//     const radius =  ctx.query.radius;
//     const code =  ctx.query.code;
//     if(location !== undefined && salonId !== undefined 
//         && radius !== undefined && code !== undefined){
//             const userLocation = await task.toLocationObject(location);
//             //get all nearest services by code and salonId
//     }
// };

// ///afroturf/salons/:salonId/services/?location=23.123,21.3434
// //&radius=10

// const getAllServicesBysalonId = async ctx => {

//     const location =  ctx.query.location;
//     const radius =  ctx.query.radius;
//     const salonId =  ctx.query.salonId;
//     if(location !== undefined && salonId !== undefined 
//         && radius !== undefined){
//             const userLocation = await task.toLocationObject(location);
//             //get all nearest services by name and code
//     }
// };
// //(above + below -)

// ///afroturf/salons/services/?location=23.123,21.3434
// //&radius=10&price_=-50 || +50 
// const getServicesByPriceRange = async ctx => {
//     const location =  ctx.query.location;
//     const radius =  ctx.query.radius;
//     const serviceName =  ctx.query.service;
//     const price =  ctx.query.price_;
//     if(location !== undefined && serviceName !== undefined 
//         && radius !== undefined && price !== undefined){
//             const userLocation = await task.toLocationObject(location);
//             //get all nearest services by name and price range (above + below -)
//             //if contains - all below price else if + all above price
//     }
// };

// ///afroturf/salons/:salonId/services/?location=23.123,21.3434
// //&radius=10&price_=-50&service=hairstyles
// const getServicesByPriceRangeAndSalonId = async ctx => {
//     const salonId =  ctx.query.salonId;
//     const location =  ctx.query.location;
//     const radius =  ctx.query.radius;
//     const serviceName =  ctx.query.service;
//     const price =  ctx.query.price_;

    
// };

//filter 
///afroturf/salons/:salonId/services/filter/?location=23.123,21.3434
//&radius=10&price_lte=50&service=hairstyles&price_gte=10&code=F567B&type=Locks

const servicesFilterLocal = async ctx => {

    const location =  ctx.query.location;
    const radius =  ctx.query.radius;
    const price_lte =  ctx.query.price_lte;
    const price_gte =  ctx.query.price_gte; //handle gte and lte error
    const serviceName =  ctx.query.service;
    const servicetype =  ctx.query.type;
    const code = ctx.query.code;
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
        ctx.body = await salonClient.getServicesByNameTypePriceRangeCodeAndSalonId(userLocation, radius, limit, serviceName, servicetype, price_gte, price_lte, code,salonId);

        
    
    }else if(serviceName !== undefined && price_lte !==undefined
        && servicetype !== undefined 
        && price_gte !==undefined&& salonId !==undefined){
            console.log("getServicesByNameTypePriceRangeAndSalonId");
            userLocation = await task.toLocationObject(location);
            ctx.body = await salonClient.getServicesByNameTypePriceRangeAndSalonId(userLocation, radius, limit, serviceName, servicetype, price_gte, price_lte,salonId);
            
        
    }else if(serviceName !== undefined && price_lte !==undefined 
        && price_gte !==undefined&& salonId !==undefined){
            console.log("getServicesByNamePriceRangeAndSalonId");
            userLocation = await task.toLocationObject(location);
            ctx.body = await salonClient.getServicesByNamePriceRangeAndSalonId(userLocation, radius, limit, serviceName, price_gte, price_lte,salonId);
            
        
    }else if(serviceName !== undefined 
        && salonId !== undefined
        && servicetype !== undefined){
            //get all nearest services by name and price range (above + below -) and salonId
            //if contains - all below price else if + all above price
            console.log(servicetype+" getServicesByNameTypeSalonId - "+serviceName)
            userLocation = await task.toLocationObject(location);
            ctx.body = await salonClient.getServicesByNameTypeSalonId(userLocation, radius, limit, serviceName, servicetype, salonId);

    }else if(serviceName !== undefined 
        &&  salonId !== undefined){
            //get all nearest services by name and price range (above + below -) and salonId
            //if contains - all below price else if + all above price
            console.log(servicetype+" getServicesByNameSalonId - "+serviceName)
            userLocation = await task.toLocationObject(location);
            ctx.body = await salonClient.getServicesByNameSalonId(userLocation, radius, limit,serviceName, salonId);
            return ctx.body;
    }else if( salonId !== undefined
      ){
            userLocation = await task.toLocationObject(location);
            console.log(servicetype+" getServicesSalonId - "+serviceName)
            ctx.body = await salonClient.getServicesSalonId(userLocation, radius, limit, salonId);
         
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
    const serviceName =  ctx.query.service;
    const servicetype =  ctx.query.type;
    const code = ctx.query.code;
    
    let limit = ctx.query.limit;
    let userLocation;
    if(location !== undefined){
        userLocation = await task.toLocationObject(location);
    }
    if(limit == undefined){
        limit = 1000000;
    }
    if(location !== undefined && serviceName !== undefined && price_lte !==undefined
    && radius !== undefined && servicetype !== undefined 
    &&price_gte !==undefined&&code !== undefined){
        console.log("getServicesByNameTypePriceRangeCode ---345 ");
        ctx.body = await salonClient.getServicesByNameTypePriceRangeCode(userLocation, radius, limit, serviceName, servicetype, price_gte, price_lte, code);

    
    }else if(location !== undefined && serviceName !== undefined && price_lte !==undefined
        && radius !== undefined && servicetype !== undefined 
        && price_gte !==undefined){
            console.log("getServicesByNameTypePriceRange --- 347");
            ctx.body = await salonClient.getServicesByNameTypePriceRange(userLocation, radius, limit, serviceName, servicetype, price_gte, price_lte);
            return ctx.body;
        
    }else if(location !== undefined && serviceName !== undefined && price_lte !==undefined
        && radius !== undefined 
        && price_gte !==undefined){
            console.log("getServicesByNamePriceRange -- 348");
            ctx.body = await salonClient.getServicesByNamePriceRange(userLocation, radius, limit, serviceName, price_gte, price_lte);
            
        
    }else if(location !== undefined && serviceName !== undefined 
        && radius !== undefined
        && servicetype !== undefined && limit !== undefined){
           

            console.log(servicetype+" getServicesByNameType ----349 "+serviceName)
            ctx.body = await salonClient.getServicesByNameType(userLocation, radius, limit, serviceName, servicetype);

    }else if(location !== undefined && serviceName !== undefined 
        && radius !== undefined
        && limit !== undefined){
            //get all nearest services by name and price range (above + below -) and salonId
            //if contains - all below price else if + all above price
            console.log(servicetype+" getServicesByName -360 "+serviceName)
            ctx.body = await salonClient.getServicesByName(userLocation, radius, limit,serviceName);
      
    }


    

    


    

    //also create a filter for services


};

module.exports = {
    servicesFilterLocal,
    servicesFilterGlobal,
}

