const stylists = require("./stylists");


test("getStylistByIdSalonId should contain res = 200", () =>{

    const ctx = {
        params: {salonId:1, stylistId:1},
        query: {location: undefined, radius:undefined}
    };

    expect.assertions(1);
    return stylists.getStylistByIdSalonId(ctx).then(data => expect(data.res).toEqual(200));
});

test("getSalonByStylistNameRatingGenderAndSalonId one, should return res = 200", () =>{

    const ctx = {
        params: {salonId:1, stylistId:1},
        query: {location: undefined, radius:undefined, limit:10,query: {name:"cha", gender:"male", rating:[3,5]}}
       
    };

    expect.assertions(1);
    return stylists.getSalonByStylistNameRatingGenderAndSalonId(ctx).then(data => expect(data.res).toEqual(200));
});
test("getSalonByStylistNameRatingGenderAndSalonId two,  should return res = 200", () =>{

    const ctx = {
        params: {salonId:1, stylistId:1},
        query: {location: undefined, radius:undefined, limit:10,query: {rating:[3,5]}}
       
    };

    expect.assertions(1);
    return stylists.getSalonByStylistNameRatingGenderAndSalonId(ctx).then(data => expect(data.res).toEqual(200));
});
test("getSalonByStylistNameRatingGenderAndSalonId three, should return res = 200", () =>{

    const ctx = {
        params: {salonId:1, stylistId:1},
        query: {location: undefined, radius:undefined, limit:10,query: {name:undefined, gender:undefined, rating:[3,5]}}
       
    };

    expect.assertions(1);
    return stylists.getSalonByStylistNameRatingGenderAndSalonId(ctx).then(data => expect(data.res).toEqual(200));
});
test("getSalonStylistBySalonId four, should return res = 200", () =>{

    const ctx = {
        params: {salonId:1, stylistId:1},
        query: {location: undefined, radius:undefined, limit:10,query: {}}
       
    };

    expect.assertions(1);
    return stylists.getSalonByStylistNameRatingGenderAndSalonId(ctx).then(data => expect(data.res).toEqual(200));
});

test("getAllStylist five, should return res = 200", () =>{

    const ctx = {
        params: {salonId:undefined, stylistId:1},
        query: {location: undefined, radius:undefined, limit:10,query: {}}
       
    };

    expect.assertions(1);
    return stylists.getSalonByStylistNameRatingGenderAndSalonId(ctx).then(data => expect(data.res).toEqual(200));
});


