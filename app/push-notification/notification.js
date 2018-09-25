
const http = require("http");
//route to stylists and salon owner
const onBookingPosted = async () =>{

};
//route to followers and salon owner
const onReviewPosted = async () =>{

};
//route to receipient 
const onMessagePosted = async () =>{

};
//route to followers and salon owner
const onPostPosted = async () =>{

};

server_key = "AAAAPJhGwQY:APA91bGAojaSXyJtVgVYtFqqtmq_4WB7F8uCvJeSSMycS1ZaKKMIzqKV9eGkO65vUlsNBr9vy8Et9gkbElmVAoJR1JAn4cfY4vRGMpxyfQWTxLVZJNDOSSqhYI4lPGi5oRJn7f842aSfjVKo1CrNMYcWDUx3zsZ7-w";


let to = "ddLrwgdP3lQ:APA91bEL1nEK4Mp8YgKnECw-Ko97mHUabdMl7gz614N2YYtM3ynzcxsLzdB8szVVuFaRoI7Pnq9Cv6TUv44mnq3Jc6hp8H6gkeEFSmjKxIzrRmFQPKe7WkNrfus6tqmarWc0eNGNrql3"
let event = "posted";
const postEvent = (event, to, extra) =>{
    const post_data = { 
        "data": {
      "event": event,
      extra

    },
    "to" : to }
  return post_data;
}
var options = {
    host: "gcm-http.googleapis.com",
    path: "/gcm/send",
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Authorization":    "key="+server_key,
    }
};

var req = http.request(options, function (res) {
    var responseString = "";

    res.on("data", function (data) {
        responseString += data;
        // save all the data from response
    });
    res.on("end", function () {
        console.log(responseString); 
        // print to console when response ends
    });
});

req.write(JSON.stringify(postEvent(event, to, {other:""})));
req.end()
