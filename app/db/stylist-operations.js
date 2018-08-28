const auth = require("./authentication");
const awsHandler = require('../../aws/aws-handler');
const generic = require("./generic");
const counters = require("./counters");
const schema = require("./schema/schema");
const ObjectId = require('mongodb').ObjectID;






const applyAsStylist = async (ctx) => {
    //get currect user
    const userId = ctx.query.userId, salonObjId = ctx.query.salonObjId;
    console.log("--applyAsStylist--");
    const data = schema.getApplicationJson(userId,salonObjId);
    console.log(data);
    try{
        const db = await generic.getDatabaseByName("afroturf");
        const result = await db.db.collection("users").update({
            $and:[{"salons.salonObjId": salonObjId}, {"salons.role": "salonOwner"}, { "salons.hiring": 1 }, {"stylistRequests.userId": {$ne: userId}}]},
            {$addToSet: {stylistRequests:data}}, 
        );
        db.connection.close();
        console.log("ok: "+result.result.ok, "modified: "+ result.result.nModified);
        return  result.result.ok, result.result.nModified;
    }catch(err){
        throw new Error(err);
    }
}


module.exports = {
    applyAsStylist
}