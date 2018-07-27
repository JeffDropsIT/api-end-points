const mongodb = require('mongodb');
const assert = require('assert');


let mongoClient = mongodb.MongoClient;
let url = 'mongodb://localhost:27017/mydb';


// Use connect method to connect to the server
mongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected successfully to server");
  db.close();
});


// mongoClient.connect(url, (err, db) => {
//     if (err) throw err;
//     let dbo = db.db("mydb");
//     let myobj = { name: "Company Inc", address: "Highway 37" };
//     dbo.collection("customers").insertOne(myobj, (err, res) => {
//       if (err) throw err;
//       console.log("1 document inserted");
//       db.close();
//     });
//   });


