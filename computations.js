const  degrees_to_radians = (degrees) => {
        const pi = Math.PI;
        return degrees * (pi/180);
    }

    
const haversine = async (coordinate1, coordinate2) =>{
    let latiOrigin = coordinate1.lati, longiOrigin = coordinate1.longi;

    let latiDes = coordinate2.lati, longiDes = coordinate2.longi;
    
    const R = 6371000;

    const phi1 = await degrees_to_radians(latiOrigin);
    const phi2 = await degrees_to_radians(latiDes);

    const delta_phi = await degrees_to_radians(latiDes - latiOrigin);
    const delta_lambda = await degrees_to_radians(longiDes - longiOrigin)

    const a = await Math.pow(Math.sin(delta_phi/2.0), 2) + Math.cos(phi1)
    *Math.cos(phi2)*Math.pow(Math.sin(delta_lambda/2.0), 2);
    const c = await 2*Math.atan2(Math.sqrt(a), Math.sqrt(1-a));


    return R*c/1000;


};

// let cor1 = {lati: -26.067185, longi: 27.977467};
// let cor2 = {lati: -26.068168, longi: 27.979677};

// //haversine(cor2, cor1).then(dis => {console.log(dis)});

module.exports = {
    degrees_to_radians, 
    haversine,
};