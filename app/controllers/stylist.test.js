const stylists = require("./stylists");


test("salonId and stylistId, should contain res = 200", () =>{

    const ctx = {
        params: {salonId:1, stylistId:1},
        query: {location: undefined, radius:undefined}
    };

    expect.assertions(1);
    return stylists.getStylistByIdSalonId(ctx).then(data => expect(data.res).toEqual(200));
});