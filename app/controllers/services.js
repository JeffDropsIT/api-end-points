const task = require('./app/controllers/task');

///afroturf/salons/services/?location=23.123,21.3434
//&radius=10&service=hairstyles
const getAllNearestServicesByName = async ctx => {
    const location =  ctx.query.location;
    const radius =  ctx.query.radius;
    const serviceName =  ctx.query.service;
    if(location !== undefined && serviceName !== undefined 
        && radius !== undefined){
            const userLocation = await task.toLocationObject(location);
            //get all nearest services by name 
    }
};
///afroturf/salons/services/?location=23.123,21.3434
//&radius=10&service=hairstyles&salonId=1

const getSalonsServicesByNameAndSalonId= async ctx =>{
    const salonId =  ctx.query.salonId;
    const location =  ctx.query.location;
    const radius =  ctx.query.radius;
    const serviceName =  ctx.query.service;
    if(location !== undefined && radius !== undefined 
        && serviceName !== undefined && salonId !== undefined){
            const userLocation = await task.toLocationObject(location);
            //get services by name and type for a salonId
    };
};

///afroturf/salons/services/?location=23.123,21.3434
//&radius=10&type=locks
const getAllNearestServicesByType = async ctx => {
    const location =  ctx.query.location;
    const radius =  ctx.query.radius;
    const servicetype =  ctx.query.type;
    if(location !== undefined && serviceName !== undefined 
        && radius !== undefined && servicetype !== undefined){
            const userLocation = await task.toLocationObject(location);
            //get all nearest services by name and type 
    }
};
///afroturf/salons/services/?location=23.123,21.3434
//&radius=10&type=Locks&salonId=1

const getSalonsServicesByTypeAndSalonId= async ctx =>{
    const salonId =  ctx.query.salonId;
    const location =  ctx.query.location;
    const radius =  ctx.query.radius;
    const servicetype =  ctx.query.type;
    if(location !== undefined && radius !== undefined 
        && servicetype !== undefined && salonId !== undefined){
            const userLocation = await task.toLocationObject(location);
            //get services by name and type for a salonId
    };
};

///afroturf/salons/services/?location=23.123,21.3434
//&radius=10&service=hairstyles&type=locks
const getAllNearestServicesByTypeAndName = async ctx => {
    const location =  ctx.query.location;
    const radius =  ctx.query.radius;
    const serviceName =  ctx.query.service;
    const servicetype =  ctx.query.type;
    if(location !== undefined && serviceName !== undefined 
        && radius !== undefined && servicetype !== undefined){
            const userLocation = await task.toLocationObject(location);
            //get all nearest services by name and type 
    }
};

///afroturf/salons/services/?location=23.123,21.3434
//&radius=10&service=hairstyles&type=locks&salonId=1
const getAllNearestServicesByTypeAndNameAndSalonId = async ctx => {
    const salonId =  ctx.query.salonId;
    const location =  ctx.query.location;
    const radius =  ctx.query.radius;
    const serviceName =  ctx.query.service;
    const servicetype =  ctx.query.type;
    if(location !== undefined && serviceName !== undefined 
        && radius !== undefined && salonId !==undefined && servicetype !== undefined){
            const userLocation = await task.toLocationObject(location);
            //get all nearest services by name and type 
    }
};


///afroturf/salons/services/?location=23.123,21.3434
//&radius=10&service=hairstyles&code=F567B
const getAllNearestServicesByNameAndCode = async ctx => {

    const location =  ctx.query.location;
    const radius =  ctx.query.radius;
    const serviceName =  ctx.query.service;
    const code =  ctx.query.code;
    if(location !== undefined && radius !==undefined && serviceName !== undefined
         && undefined && code !== undefined){
            const userLocation = await task.toLocationObject(location);
            //get all nearest services by code
    }
};


///afroturf/salons/services/?location=23.123,21.3434
//&radius=10&service=hairstyles&code=F567B&salonId=1
const getAllNearestServicesByNameAndCodeAndSalonId = async ctx => {
    const salonId =  ctx.query.salonId;
    const location =  ctx.query.location;
    const radius =  ctx.query.radius;
    const serviceName =  ctx.query.service;
    const code =  ctx.query.code;
    if(location !== undefined && radius !==undefined && salonId !==undefined && serviceName !== undefined
         && undefined && code !== undefined){
            const userLocation = await task.toLocationObject(location);
            //get all nearest services by code
    }
};

///afroturf/salons/services/?location=23.123,21.3434
//&radius=10&service=hairstyles&price=50
const getAllNearestServicesByPrice = async ctx => {

    const location =  ctx.query.location;
    const radius =  ctx.query.radius;
    const serviceName =  ctx.query.service;
    const price =  ctx.query.price;
    if(location !== undefined && radius !== undefined && serviceName !== undefined 
        && code !== undefined && price !==undefined){
            const userLocation = await task.toLocationObject(location);
            //get all nearest services by price
    }
};
///afroturf/salons/services/?location=23.123,21.3434
//&radius=10&service=hairstyles&price=50&salonId=1
const getAllNearestServicesByPriceAndSalonId = async ctx => {

    const salonId =  ctx.query.salonId;
    const location =  ctx.query.location;
    const radius =  ctx.query.radius;
    const serviceName =  ctx.query.service;
    const price =  ctx.query.price;
    if(location !== undefined && radius !== undefined && serviceName !== undefined 
        && code !== undefined && price !==undefined &&salonId !== undefined){
            const userLocation = await  task.toLocationObject(location);
            //get all nearest services by price
    }
};
///afroturf/salons/services/?location=23.123,21.3434
//&radius=10&code=F567B

const getAllNearestServicesByCode = async ctx => {
    const location =  ctx.query.location;
    const radius =  ctx.query.radius;
    const code =  ctx.query.code;
    if(location !== undefined && radius !== undefined && code !== undefined){
            const userLocation = await task.toLocationObject(location);
            //get all nearest services by code and salonId
    }
};

///afroturf/salons/services/?location=23.123,21.3434
//&radius=10&code=F567B&salonId=1

const getAllNearestServicesByCodeAndSalonId = async ctx => {
    const salonId =  ctx.query.salonId;
    const location =  ctx.query.location;
    const radius =  ctx.query.radius;
    const code =  ctx.query.code;
    if(location !== undefined && salonId !== undefined 
        && radius !== undefined && code !== undefined){
            const userLocation = await task.toLocationObject(location);
            //get all nearest services by code and salonId
    }
};

///afroturf/salons/services/?location=23.123,21.3434
//&radius=10&salonId=1

const getAllServicesBysalonId = async ctx => {

    const location =  ctx.query.location;
    const radius =  ctx.query.radius;
    const salonId =  ctx.query.salonId;
    if(location !== undefined && salonId !== undefined 
        && radius !== undefined){
            const userLocation = await task.toLocationObject(location);
            //get all nearest services by name and code
    }
};
//(above + below -)

///afroturf/salons/services/?location=23.123,21.3434
//&radius=10&price_=-50 || +50 
const getAllNearestServicesByPriceRange = async ctx => {
    const location =  ctx.query.location;
    const radius =  ctx.query.radius;
    const serviceName =  ctx.query.service;
    const price =  ctx.query.price_;
    if(location !== undefined && serviceName !== undefined 
        && radius !== undefined && price !== undefined){
            const userLocation = await task.toLocationObject(location);
            //get all nearest services by name and price range (above + below -)
            //if contains - all below price else if + all above price
    }
};

///afroturf/salons/services/?location=23.123,21.3434
//&radius=10&price_=-50&salonId=1&service=hairstyles
const getAllNearestServicesByPriceRangeAndSalonId = async ctx => {
    const salonId =  ctx.query.salonId;
    const location =  ctx.query.location;
    const radius =  ctx.query.radius;
    const serviceName =  ctx.query.service;
    const price =  ctx.query.price_;

    if(location !== undefined && serviceName !== undefined 
        && radius !== undefined && salonId !== undefined && price !== undefined){
            const userLocation = await toLocationObject(location);
            //get all nearest services by name and price range (above + below -) and salonId
            //if contains - all below price else if + all above price
    }
};

//filter 
///afroturf/salons/services/filter/?location=23.123,21.3434
//&radius=10&price_=-50&salonId=1&service=hairstyles
const getSalonsServicesFilter = async ctx => {

    const location =  ctx.query.location;
    const radius =  ctx.query.radius;
    const price =  ctx.query.price_;
    const serviceName =  ctx.query.service;
    const servicetype =  ctx.query.type;
    const gender =  ctx.query.gender;
    if(location !== undefined && serviceName !== undefined && price !==undefined
    && radius !== undefined && servicetype !== undefined && gender !== undefined){
        
        
    }

    //also create a filter for services


};
const getSalonsServicesFilterBySalonId = async ctx => {

    const location =  ctx.query.location;
    const radius =  ctx.query.radius;
    const price =  ctx.query.price_;
    const serviceName =  ctx.query.service;
    const servicetype =  ctx.query.type;
    const salonId =  ctx.query.salonId;
    const gender =  ctx.query.gender;
    if(location !== undefined && serviceName !== undefined && price !==undefined
    && radius !== undefined && servicetype !== undefined && salonId !== undefined && gender !==undefined){
        
        
    }

    //also create a filter for services


};
