const toLocationObject =  async (location) =>{
    
    const userLocation =  await location.split(",").map(item => parseFloat(item));
    return userLocation;
};

module.exports = {
    toLocationObject,
};