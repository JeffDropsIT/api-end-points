
const containsOps = require("./contains-operations");
const task = require("../controllers/task");
const empty = require("is-empty");
const generalQuickSearch = async (ctx) => {
    console.log(ctx.query.filters)

    contains = ctx.query.contains;
    const filter = JSON.parse(ctx.query.filters);
    const salon = filter.salon;
    console.log("salon: "+salon)
    const services = filter.services;
    const stylist = filter.stylist;
    const location =  ctx.query.location;
    let limit = ctx.query.limit; 
    let radius = ctx.query.radius;
    let userLocation;
    if(limit == undefined){
        limit = 10000000000;
    }
   userLocation = await task.toLocationObject(location);





    try {

        if(!empty(salon)&& !empty(services) & !empty(stylist)){
            
            let salonJson = await containsOps.containsInSalons(contains, userLocation, radius, limit, salon);
            let stylistJson = await containsOps.containsInStylist(contains, userLocation, radius, limit, stylist);
            let serviceJson = await containsOps.containsInServices(contains, userLocation, radius, limit, services);
            
            const res = {res: 200, message: "successfully performed operation",
            data: [salonJson, stylistJson, serviceJson]}
            ctx.body = res
        }else if(!empty(salon) && !empty(services) && empty(stylist)){
            let salonJson = await containsOps.containsInSalons(contains, userLocation, radius, limit, salon);
            let serviceJson = await containsOps.containsInServices(contains, userLocation, radius, limit, services);
            const res = {res: 200, message: "successfully performed operation",
            data: [salonJson, [{stylist:null}], serviceJson]}
            ctx.body = res
        }else if(!empty(salon) && !empty(stylist) && empty(services)){
            let salonJson = await containsOps.containsInSalons(contains, userLocation, radius, limit, salon);
            let stylistJson = await containsOps.containsInStylist(contains, userLocation, radius, limit, stylist);
            const res = {res: 200, message: "successfully performed operation",
            data: [salonJson, stylistJson, [{services:null}]]}
            ctx.body = res
        }else if(!empty(services) && !empty(stylist) && empty(salon)){
            let serviceJson = await containsOps.containsInServices(contains, userLocation, radius, limit, services);
            let stylistJson = await containsOps.containsInStylist(contains, userLocation, radius, limit, stylist);
            const res = {res: 200, message: "successfully performed operation",
            data: [[{salon:null}], stylistJson, serviceJson]}
            ctx.body = res
        }else if(!empty(services) && empty(stylist) && empty(salon)){
            let serviceJson = await containsOps.containsInServices(contains, userLocation, radius, limit, services);
            const res = {res: 200, message: "successfully performed operation",
            data: [[{salon:null}], [{stylist:null}], serviceJson]}
            ctx.body = res
        }else if(!empty(stylist) && empty(services) && empty(salon)){
            let stylistJson = await containsOps.containsInStylist(contains, userLocation, radius, limit, stylist);
            const res = {res: 200, message: "successfully performed operation",
            data: [[{salon:null}], stylistJson, [{services:null}]]}
            ctx.body = res
        }else if(!empty(salon) && empty(services) && empty(stylist)){
            let salonJson = await containsOps.containsInSalons(contains, userLocation, radius, limit, salon);
            const res = {res: 200, message: "successfully performed operation",
            data: [salonJson, [{stylist:null}], [{services:null}]]}
            ctx.body = res
        }else{
            const res = {res: 404, message: "failed to perform operation, no filter",
            data: [salonJson, [{stylist:null}], [{services:null}]]}
            ctx.body = res
        }
    } catch (error) {
        console.log("failed at quickSearch")
       throw new Error(error) 
    }



}



module.exports = {
    generalQuickSearch,
}