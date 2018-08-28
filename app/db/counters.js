const generic = require("./generic");
const empty = require("is-empty");
const ObjectId = require('mongodb').ObjectID;
//these can be one method which takes in the _id, collectionName and array <identifier>
const getNextStylistInCount = async(salonId) =>{
    try {
        const db = await generic.getDatabaseByName("afroturf");
        let result = await db.db.collection("salons").aggregate([
            { $match: { _id: ObjectId(salonId) } },
            {$project:{count:{$size: "$stylists"}}}
        ]);
       
        result = await result.toArray();
        if(!empty(result)){
            console.log("DATA IS THERE. . .getNextStylistInCount ")
            console.log(result)
            let count = JSON.parse(JSON.stringify(result[0]));
            db.connection.close();
            return count.count + 1;
        }else{
            console.log("NOT STYLIST PRESENT. . .")
            let count = JSON.parse(JSON.stringify(result));
            db.connection.close();
            console.log(count);
            if(count === NaN) {return 1;}else return 1;
        }
        
        
    } catch (error) {
        console.log("failed to getNextStylistInCount Count")
        throw new Error(error);
    }
    
}

const getNextReviewOutCount = async(userId) =>{
    try {
        const db = await generic.getDatabaseByName("afroturf");
        let result = await db.db.collection("reviews").aggregate([
            { $match: { "userId": userId } },
            {$project:{count:{$size: "$reviewsOut"}}}
        ]);
        
        result = await result.toArray();
        if(!empty(result)){
            console.log("DATA IS THERE. . . ")
            console.log(result)
            let count = JSON.parse(JSON.stringify(result[0]));
            db.connection.close();
            return count.count + 1;
        }else{
            console.log("NOT STYLIST PRESENT. . .")
            let count = JSON.parse(JSON.stringify(result));
            db.connection.close();
            console.log(count);
            if(count === NaN) {return 1;}else return 1;
        }
    } catch (error) {
        console.log("failed to getNextReviewOutCount Count")
        throw new Error(error);
    }
    
}


const getNextReviewInCount = async(userId) =>{
    try {
        const db = await generic.getDatabaseByName("afroturf");
        let result = await db.db.collection("reviews").aggregate([
            { $match: { "userId": userId } },
            {$project:{count:{$size: "$reviewsIn"}}}
        ]);
        
        result = await result.toArray();
        if(!empty(result)){
            console.log("DATA IS THERE. . . ")
            console.log(result)
            let count = JSON.parse(JSON.stringify(result[0]));
            db.connection.close();
            return count.count + 1;
        }else{
            console.log("NOT STYLIST PRESENT. . .")
            let count = JSON.parse(JSON.stringify(result));
            db.connection.close();
            console.log(count);
            if(count === NaN) {return 1;}else return 1;
        }
    } catch (error) {
        console.log("failed to getNextReviewInCount Count")
        throw new Error(error);
    }
    
}


const getNextMessageCount = async(roomDocId) =>{
    try {
        const db = await generic.getDatabaseByName("afroturf");
        let result = await db.db.collection("rooms").aggregate([
            { $match: { _id: ObjectId(roomDocId) } },
            {$project:{count:{$size: "$messages"}}}
        ]);
        
        result = await result.toArray();
        if(!empty(result)){
            console.log("DATA IS THERE. . . ")
            console.log(result)
            let count = JSON.parse(JSON.stringify(result[0]));
            db.connection.close();
            return count.count + 1;
        }else{
            console.log("STYLIST PRESENT. . .")
            let count = JSON.parse(JSON.stringify(result));
            db.connection.close();
            console.log(count);
            if(count === NaN) {return 1;}else return 1;
        }
    } catch (error) {
        console.log("failed to getNextMessageCount Count")
        throw new Error(error);
    }
    
}
const getNextSequenceValue = async (sequenceName, collectionIndex) => {
    try {
        const db = await generic.getDatabaseByName("afroturf");
        const sequenceDocument = await db.db.collection(collectionIndex).findAndModify(
            {_id: sequenceName },
            [],
            {$inc:{lastAdded:1}},
            {new:true}
    );
        db.connection.close();
        return await sequenceDocument.value.lastAdded;
        
    } catch (error) {
        throw new Error(error);
    }
    };


module.exports = {
    getNextMessageCount,
    getNextReviewOutCount,
    getNextStylistInCount,
    getNextReviewInCount,
    getNextSequenceValue
}