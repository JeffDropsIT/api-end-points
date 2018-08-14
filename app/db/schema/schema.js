const users = {
    bsonType: "object",
    required: ["email", "password", "phone"],
    properties: {
        email: {
            bsonType: "string", 
            description: "must be a string and is required"
        },
        password: {
            bsonType: "string",
            description: "must be a string and is required"
         },
        phone: {
            bsonType: "string",
            description: "must be an string and is required"
        },
        fname: {
            bsonType: "string",
            description: "must be a string and is not required"
        },
        gender: {
            enum: ["male", "female", "other"],

            description: "can only be one of the enum values"
        },
        lname: {
            bsonType: "string",
            description: "must be a string and is not required"
        },
        birthDay: {
            bsonType: "date",
            description: "must be a date and is not required"
        },
        address: {
            bsonType: "object",
            properties:{
                city: {
                    bsonType: "string",
                    description: "must be a string and is not required"
                },
                street: {
                    bsonType: "string",
                    description: "must be a string and is not required"
                },
                code: {
                    bsonType: "int",
                    description: "must be an integer and is not required"
                },
            }
            
        },
        following: {
            bsonType: "object",
            properties:{
                salons:{
                    bsonType: "object",
                    properties:{
                        salonIds: {
                            bsonType: "int",
                            description: "must be a int and is not required"
                        },
                        reviewsIds: {
                            bsonType: "string",
                            description: "must be a obj string and is not required"
                        }
                    }
                }
            }
            
        },
        bookings: {
            bsonType: "object",
            properties:{
                bookingHistory: {
                    bsonType: "object",
                    properties: {
                        orders: {
                        bsonType: "object",
                        properties:{
                            status: {
                                enum:["accepted", "pending", "rejected"],
                                description: "must be one of the enum values and is not required"
                            },
                            date: {
                                bsonType: "date",
                                description: "must be a date and is not required"
                            },
                            code: {
                                bsonType: "int",
                                description: "must be an integer and is not required"
                            }
                        }
                        
                    }
                },
                }
            }
            
        }
        
    }


};
const stylist =  (stylist, stylistId)=>{
    const application = {
        "userId": ObjectId(stylist._id),
        "name": stylist.fname,
        "gender": stylist.gender,
        "stylistId": ObjectId(stylistId),
        "reviews":[],
        "rating": 1,
    }
    return application;
}

const modifyRequestJson =  (userId, salonObjId, status, permissions)=>{
    const application = {
        "userId": ObjectId(userId),
        "salonObjId": ObjectId(salonObjId),
        "status": status,
        "stylistAccess": permissions
    }
    return application;
}
module.exports = {
    users,
    stylist,
    modifyRequestJson,
}