const toLocationObject =  async (location) =>{

    if(location === undefined || null){
        console.log("Location isEmpty: "+location)
        return [];
    }
    console.log("we got the locations")
    const userLocation =  await location.split(",").map(item => parseFloat(item));
    return userLocation;
};



module.exports = {
    toLocationObject,
};