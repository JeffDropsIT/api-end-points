const mongodb = require('mongodb');
const assert = require('assert');


let mongoClient = mongodb.MongoClient;
let url = 'mongodb://admin:password123@ds153841.mlab.com:53841/afroturf';



function getSalonByName(dbo, name, callback){
 // console.log("SALONS SEARCHING FOUNDING");
  dbo.collection("salons").find({name:name})
 .toArray(function (err, items) { 
   if (items.length > 0) {
      


     let salon = JSON.stringify(items[0]);
     //item = yield salon; 
     callback(salon);
      
     }
   });

};


mongoClient.connect(url, {useNewUrlParser : true}).then(db => {
  //yield db;
  //let myobj = { name: "Company Inc", address: "Highway 37" };
  console.log("DB CONNECTED");
  return db;

}).then(db => {
  console.log("SALONS SEARCHING > > >");


  module.exports.getSalonByName =  getSalonByName(db.db("afroturf"), "HeartBeauty", function(docs){
    console.log(docs);
    db.close();
    return docs;
    
  });


  
}).catch(err => {
  console.log(err);
});

