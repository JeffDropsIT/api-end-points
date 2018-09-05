const auth = require("./authentication");
const awsHandler = require('../../aws/aws-handler');
const generic = require("./generic");
const counters = require("./counters");
const schema = require("./schema/schema");
const ObjectId = require('mongodb').ObjectID;






const applyAsStylist = async (ctx) => {
    //get currect user
    const userId = ctx.request.body.userId, salonObjId = ctx.request.body.salonObjId;
    console.log("--applyAsStylist--");
    const data = schema.getApplicationJson(userId,salonObjId);
    console.log(data);
    try{
        const db = await generic.getDatabaseByName("afroturf");
        const result = await db.db.collection("users").update({
            $and:[{"salons.salonObjId": salonObjId}, {"salons.role": "salonOwner"}, { "salons.hiring": 1 }, {"stylistRequests.salonObjId": {$ne: salonObjId}}]},
            {$addToSet: {stylistRequests:data}}, 
        );
        console.log("ok: "+result.result.ok, "modified: "+ result.result.nModified);
        const res = result.result.ok && result.result.nModified === 1 ? 200 : 401;
        if(res === 200){
    
            console.log("--applyAsStylist updating my profile--");
            const result2 = await db.db.collection("users").update({
                $and:[{"_id": ObjectId(userId)}, {"EmploymentStatus.salonObjId": {$ne: salonObjId}}]},
                {$addToSet: {EmploymentStatus:data}}, 
            );
            console.log("ok: "+result2.result.ok, "modified: "+ result2.result.nModified);
        }
        
        db.connection.close();
        return  res;
    }catch(err){
        throw new Error(err);
    }
}
//applyAsStylist("5b7e9b1495e2e31ef888b64d", "5b8f7f7b0e22dc20a4588e27");
module.exports = {
    applyAsStylist
}