const task = require('../controllers/task');
const servicesOps= require('../../app/db/services-operations');


//getServicesPriceRangeSalonId, //1
//getServicesPriceRange,  //1

    //also create a filter for services



//1a.
// /afroturf/filter/services?query={"price":[0,100]} //returns all services

const getServicesPriceRange = async (ctx) =>{
    let location =  ctx.query.location, radius =  ctx.query.radius, limit =  ctx.query.limit;
    let userLocation = await task.toLocationObject(location);

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
    let price;
    try {
        price = filterRe.price;
    } catch (error) {
        price = [0, 1000];
    }
    
    if(price[0] === undefined){
        price = [0, 1000]
    }
    
    if(limit === undefined){
        limit = 1000000;
    }
    
    try {
        
        const stylistJson =  servicesOps.getServicesPriceRange(userLocation, radius, limit, price[0], price[1])
        const res = {res: 200, message: "successfully performed operation"}
        ctx.status = res.res;
        ctx.message = res.message;
        ctx.body = await stylistJson
        return ctx.body;
    } catch (error) {
        throw new Error(error);
    }
}


//1b.
// /afroturf/filter/:salonId/services?query={"price":[0,100]} //returns all services in salon with salonId

const getServicesPriceRangeSalonId = async (ctx) =>{
    let salonId = ctx.params.salonId;
    let location =  ctx.query.location, radius =  ctx.query.radius, limit =  ctx.query.limit;

   
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
        ctx.message = res.message;
        ctx.body = {};
        return;
    }
    let price;
    try {
        price = filterRe.price;
    } catch (error) {
        price = [0, 1000];
    }
    let userLocation = await task.toLocationObject(location);
    
    if(price[0] === undefined){
        price = [0, 1000]
    }
    
    
    if(limit === undefined){
        limit = 1000000;
    }
    
    try {
        
        const stylistJson =  servicesOps.getServicesPriceRangeSalonId(userLocation, radius, limit, price[0], price[1], salonId)
        const res = {res: 200, message: "successfully performed operation"}
        ctx.status = 200;
        ctx.message = res.message;
        ctx.body = await stylistJson;
        return ctx.body;
    } catch (error) {
        throw new Error(error);
    }
}


//getServicesByTypePriceRangeSalonId, //2
//getServicesByTypePriceRange, //2

//2a.
// /afroturf/filter/services?query={"serviceType": "fade", "price":[0,100]} //returns services which match query

const getServicesByTypePriceRange = async (ctx) =>{
    let location =  ctx.query.location, radius =  ctx.query.radius, limit =  ctx.query.limit;

    let filterRe; 
    try {
        if(ctx.query.query !== undefined){
            
            filterRe = JSON.parse(ctx.query.query);
            console.log(filterRe)
        }
    } catch (error) {
        console.log("failed")
        const res = {res: 422 , message: "Unprocessable Entity, "+error}
        ctx.status = res.res;
        ctx.message = res.message;
        ctx.body = {};
        return;
    }
    let servicetype = filterRe.serviceType;
    let price;
    try {
        price = filterRe.price;
    } catch (error) {
        price = [0, 1000];
    }
    let userLocation = await task.toLocationObject(location);
    
    if(price[0] === undefined){
        price = [0, 1000]
    }
    
    
    if(limit === undefined){
        limit = 1000000;
    }
    
    try {
        
        const stylistJson =  servicesOps.getServicesByTypePriceRange(userLocation, radius, limit, servicetype, price[0], price[0])
        const res = {res: 200, message: "successfully performed operation"}
        ctx.status = res.res;
        ctx.message = res.message;
        ctx.body = await stylistJson;
        return ctx.body;
    } catch (error) {
        throw new Error(error);
    }
}





//2b.
// /afroturf/filter/:salonId/services?query={"serviceType": "fade", "price":[0,100]} //returns services which match query



const getServicesByTypePriceRangeSalonId = async (ctx) =>{
    let salonId = ctx.params.salonId;
    let location =  ctx.query.location, radius =  ctx.query.radius, limit =  ctx.query.limit;



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
        ctx.message = res.message;
        ctx.body = {};
        return;
    }
    let servicetype = filterRe.serviceType;
    let price;
    try {
        price = filterRe.price;
    } catch (error) {
        price = [0, 1000];
    }
    let userLocation = await task.toLocationObject(location);
    
    if(price[0] === undefined){
        price = [0, 1000]
    }
    
    
    if(limit === undefined){
        limit = 1000000;
    }
    
    try {
        
        const stylistJson =  servicesOps.getServicesByTypePriceRangeSalonId(userLocation, radius, limit, servicetype, price[0], price[0], salonId)
        const res = {res: 200, message: "successfully performed operation"}
        ctx.status = res.res;
        ctx.message = res.message;
        ctx.body = await stylistJson;
        return ctx.body;
    } catch (error) {
        throw new Error(error);
    }
}

// getServicesByNameSalonId,//5
// getServicesByName,//5


//5a.
// /afroturf/filter/services?query={} //returns all services

const getServicesByName = async(ctx) =>{

    let location =  ctx.query.location, radius =  ctx.query.radius, limit =  ctx.query.limit;

    let userLocation = await task.toLocationObject(location);
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
        ctx.message = res.message;
        ctx.body = {};
        return;
    }
    let serviceName = filterRe.serviceName;
    
    
    if(limit === undefined){
        limit = 1000000;
    }
    
    try {
        
        const stylistJson =  servicesOps.getServicesByName(userLocation, radius, limit, serviceName)
        const res = {res: 200, message: "successfully performed operation"}
        ctx.status = res.res;
        ctx.message = res.message;
        ctx.body = await stylistJson;
        return ctx.body;
    } catch (error) {
        throw new Error(error);
    }

}



//5b.
// /afroturf/filter/:salonId/services?query={} //returns all services in salon with salonId

const getServicesByNameSalonId = async(ctx) =>{
    let salonId = ctx.params.salonId;
    let location =  ctx.query.location, radius =  ctx.query.radius, limit =  ctx.query.limit;
    let userLocation = await task.toLocationObject(location);
  
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
        ctx.message = res.message;
        ctx.body = {};
        return;
    }

    let serviceName = filterRe.serviceName;
    if(limit === undefined){
        limit = 1000000;
    }
    
    try {
        
        const stylistJson =  servicesOps.getServicesByNameSalonId(userLocation, radius, limit, serviceName, salonId)
        const res = {res: 200, message: "successfully performed operation"}
        ctx.status = res.res;
        ctx.message = res.message;
        ctx.body = await stylistJson;
        return ctx.body;
    } catch (error) {
        throw new Error(error);
    }

    
}









//4a.
// /afroturf/filter/services?query={"code":"ASS1"} //returns all services
const getServicesCode = async(ctx) =>{


    let location =  ctx.query.location, radius =  ctx.query.radius, limit =  ctx.query.limit;



    console.log(ctx.query.query)
    let filterRe; 
    try {
        if(ctx.query.query !== undefined){
            
            filterRe = JSON.parse(ctx.query.query);
            console.log(filterRe)
        }
    } catch (error) {
        console.log("failed")
        const res = {res: 422 , message: "Unprocessable Entity, "+error}
        ctx.status = res.res;
        ctx.message = res.message;
        ctx.body = {};
        return;
    }
    let code = filterRe.code;

    let userLocation = await task.toLocationObject(location);
  
    if(limit === undefined){
        limit = 1000000;
    }
    
    try {
        
        const stylistJson =  servicesOps.getServicesCode(userLocation, radius, limit, code)
        const res = {res: 200, message: "successfully performed operation"}
        ctx.status = res.res;
        ctx.message = res.message;
        ctx.body = await stylistJson;
        return ctx.body;
    } catch (error) {
        throw new Error(error);
    }


}

//4b


const getServicesCodeSalonId = async(ctx) =>{
    let salonId = ctx.params.salonId;
    let location =  ctx.query.location, radius =  ctx.query.radius, limit =  ctx.query.limit;
    let userLocation = await task.toLocationObject(location);
  



    console.log(ctx.query.query)
    let filterRe; 
    try {
        if(ctx.query.query !== undefined){
            
            filterRe = JSON.parse(ctx.query.query);
            console.log(filterRe)
        }
    } catch (error) {
        console.log("failed")
        const res = {res: 422 , message: "Unprocessable Entity, "+error}
        ctx.status = res.res;
        ctx.message = res.message;
        ctx.body = {};
        return;
    }
    let code = filterRe.code;
    if(limit === undefined){
        limit = 1000000;
    }
    
    try {
        
        const stylistJson =  servicesOps.getServicesCodeSalonId(userLocation, radius, limit, code, salonId)
        const res = {res: 200, message: "successfully performed operation"}
        ctx.status = res.res;
        ctx.message = res.message;
        ctx.body = await stylistJson;
        return ctx.body;
    } catch (error) {
        throw new Error(error);
    }

}


// getAllServicesInSalonId, //3
// getAllServices,  //3

//3a.
// /afroturf/filter/services-a               /returns services which match query

const getAllServices = async(ctx) => {

    let location =  ctx.query.location, radius =  ctx.query.radius, limit =  ctx.query.limit;
    let userLocation = await task.toLocationObject(location);
  
    if(limit === undefined){
        limit = 1000000;
    }
    
    try {
        
        const stylistJson =  servicesOps.getAllServices(userLocation, radius, limit)
        const res = {res: 200, message: "successfully performed operation"}
        ctx.status = res.res;
        ctx.message = res.message;
        ctx.body = await stylistJson;
        return ctx.body;
    } catch (error) {
        throw new Error(error);
    }
}




//3b.
// /afroturf/filter/:salonId/services-a//returns services which match query

const getAllServicesInSalonId = async(ctx) => {
    let salonId = ctx.params.salonId;
    let location =  ctx.query.location, radius =  ctx.query.radius, limit =  ctx.query.limit;
    let userLocation = await task.toLocationObject(location);
  
    if(limit === undefined){
        limit = 1000000;
    }
    
    try {
        
        const stylistJson =  servicesOps.getAllServicesInSalonId(userLocation, radius, limit, salonId)
        const res = {res: 200, message: "successfully performed operation"}
        ctx.status = res.res;
        ctx.message = res.message;
        ctx.body = await stylistJson;
        return ctx.body;
    } catch (error) {
        throw new Error(error);
    }

}







module.exports = {
    getServicesPriceRange,
    getServicesPriceRangeSalonId,
    getServicesByTypePriceRangeSalonId,
    getServicesByTypePriceRange,
    getServicesByNameSalonId,
    getServicesByName,
    getServicesCodeSalonId,
    getServicesCode,
    getAllServicesInSalonId,
    getAllServices

}

