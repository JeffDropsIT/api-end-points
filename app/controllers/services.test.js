const services = require("./services");


test("getServicesPriceRange should contain res = 200", () =>{

    const ctx = {
        params: {salonId:1},
        query: {location: undefined, radius:undefined, query:{price:[100, 150]}}
    };

    expect.assertions(1);
    return services.getServicesPriceRange(ctx).then(data => expect(data.res).toEqual(200));
});


test("getServicesPriceRangeSalonId should contain res = 200", () =>{

    const ctx = {
        params: {salonId:1},
        query: {location: undefined, radius:undefined, query:{price:[100, 150]}}
    };

    expect.assertions(1);
    return services.getServicesPriceRangeSalonId(ctx).then(data => expect(data.res).toEqual(200));
});




test("getServicesPriceRange should contain res = 200", () =>{

    const ctx = {
        query: {location: undefined, radius:undefined, query:{serviceType: "fade",price:[100, 150]}}
    };

    expect.assertions(1);
    return services.getServicesPriceRange(ctx).then(data => expect(data.res).toEqual(200));
});


test("getServicesByTypePriceRangeSalonId  should contain res = 200", () =>{

    const ctx = {
        params: {salonId:1},
        query: {location: undefined, radius:undefined, query:{serviceType: "fade",price:[100, 150]}}
    };

    expect.assertions(1);
    return services.getServicesByTypePriceRange(ctx).then(data => expect(data.res).toEqual(200));
});


test("getServicesByName  should contain res = 200", () =>{

    const ctx = {
        query: {location: undefined, radius:undefined, query:{serviceName:"haircuts"}}
    };

    expect.assertions(1);
    return services.getServicesByName(ctx).then(data => expect(data.res).toEqual(200));
});


test("getServicesByNameSalonId  should contain res = 200", () =>{

    const ctx = {
        params: {salonId:1},
        query: {location: undefined, radius:undefined, query:{serviceName:"haircuts"}}
    };

    expect.assertions(1);
    return services.getServicesByNameSalonId(ctx).then(data => expect(data.res).toEqual(200));
});



test("getServicesCode  should contain res = 200", () =>{

    const ctx = {
        
        query: {location: undefined, radius:undefined, query:{code:"5555"}}
    };

    expect.assertions(1);
    return services.getServicesCode(ctx).then(data => expect(data.res).toEqual(200));
});


test("getServicesCodeSalonId  should contain res = 200", () =>{

    const ctx = {
        params:{salonId:1},
        query: {location: undefined, radius:undefined, query:{code:"5555"}}
    };

    expect.assertions(1);
    return services.getServicesCodeSalonId(ctx).then(data => expect(data.res).toEqual(200));
});



test("getAllServices  should contain res = 200", () =>{

    const ctx = {
        
        query: {location: undefined, radius:undefined, query:{code:"5555"}}
    };

    expect.assertions(1);
    return services.getAllServices(ctx).then(data => expect(data.res).toEqual(200));
});


test("getAllServicesInSalonId  should contain res = 200", () =>{

    const ctx = {
        params:{salonId:1},
        query: {location: undefined, radius:undefined, query:{code:"5555"}}
    };

    expect.assertions(1);
    return services.getAllServicesInSalonId(ctx).then(data => expect(data.res).toEqual(200));
});
