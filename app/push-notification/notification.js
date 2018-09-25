
const http = require("http");

server_key = "AAAAPJhGwQY:APA91bGAojaSXyJtVgVYtFqqtmq_4WB7F8uCvJeSSMycS1ZaKKMIzqKV9eGkO65vUlsNBr9vy8Et9gkbElmVAoJR1JAn4cfY4vRGMpxyfQWTxLVZJNDOSSqhYI4lPGi5oRJn7f842aSfjVKo1CrNMYcWDUx3zsZ7-w";
const postEvent = (event, to, extra) =>{
    const post_data = { 
        "data": {
      "event": event,
      extra

    },
    "to" : to }
  return post_data;
}



const notifyUser = async (event, to, extra) =>{

    var options = {
        host: "gcm-http.googleapis.com",
        path: "/gcm/send",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization":    "key="+server_key,
        }
    };
    
    
    var req = await http.request(options, function (res) {
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

    
    req.write(JSON.stringify(postEvent(event, to, extra)));
    req.end()
}


module.exports = {
    notifyUser,
}
