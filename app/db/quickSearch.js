
const generic = require("./generic");
const salonOps = require("./salon-operations");
const servicesOps= require("./services-operations");
const stylistOps= require('./stylist-operations');


const generalQuickSearch = async (ctx) => {


    contains = ctx.query.contains;
    const filter = ctx.query.filters;
    const salon = filter.salon;
    const services = filter.services;
    const stylist = filter.stylist;


    const SalonRatingArr  = salon.rating;

    const StylistRatingArr  = stylist.rating;
    const gender  = stylist.gender;

    const priceArr = services.price;
    const serviceName = services.service;




    try {

        if(salon && services && stylist !== null || undefined){

            let salon = await salonOps.containsInSalons(contains, userLocation, radius, limit, salon);
            let stylist = await stylistOps.containsInStylist(contains, userLocation, radius, limit, stylist);
            let service = await servicesOps.containsInServices(contains, userLocation, radius, limit, services);
            
            const res = {res: 200, message: "successfully performed operation",
             data: [salon, stylist, service]}
            ctx.body = res
        }else if(salon && services !== null || undefined){

            ctx.body = res
        }
        else if(salon && stylist !== null || undefined){

            ctx.body = res
        }else if(services && stylist !== null || undefined){

            ctx.body = res
        }else if(salon !== null || undefined){

            ctx.body = res
        }else if(services !== null || undefined){

        }else if(stylist !== null || undefined){

        }
        
    } catch (error) {
        console.log("failed at quickSearch")
       throw new Error(ërror) 
    }



}



module.exports = {
    generalQuickSearch,
}