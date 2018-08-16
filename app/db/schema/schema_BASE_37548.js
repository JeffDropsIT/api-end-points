const ObjectId = require('mongodb').ObjectID;

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
            bsonType: "array",
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
            ,
        bookings: {
            bsonType: "array",
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


};


const salons = {
    bsonType: "object",
    required: ["name", "location", "services", "stylists", "accountStatus"],
    properties: {
        name: {
            bsonType: "string", 
            description: "must be a string and is required"
        },
        
        rating: {
            bsonType: "int",
            description: "must be a int and is not required"
            },
        created: {
            bsonType: "date",
            description: "must be a date and is not required"
            },
        accountStatus: {
            enum: ["active", "deactivated", "blocked"],
            description: "must be a one of the enum valuew required"
            },
        address: {
            bsonType: "object",
            properties:{
                street: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                address: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                coordinates: {
                    bsonType: "int",
                    description: "must be an integer and is required"
                },
            }
            
        },
        services: {
            bsonType: "array",
            service:{
                bsonType: "object",
                required: ["type", "code", "price", "description"],
                properties:{
                    type: {
                         bsonType: "string",
                            description: "must be a int and is not required"
                        },
                    code: {
                        bsonType: "string",
                        description: "must be a obj string and is not required"
                        },
                    price: {
                        bsonType: "double",
                        description: "must be a obj string and is not required"
                    },
                    description: {
                        bsonType: "string",
                        description: "must be a obj string and is not required"
                        }
                    }
                }
            
        },
        reviews: {
            bsonType: "array",
            review:{
                bsonType: "object",
                required: ["created", "userId", "review", "rating", "reviewId"],
                properties:{
                    userId: {
                        bsonType: "object",
                        properties: {$oid: {bsonType: "string", description:"must be a string and is required"}}
                    },
                    reviewId: {
                        bsonType: "object",
                        properties: {$oid: {bsonType: "string", description:"must be a string and is required"}}
                    }
                    ,
                    created: {
                        bsonType: "date",
                        description: "must be a date and is required"
                    },
                    review: {
                        bsonType: "string",
                        description: "must be a obj string and is required"
                        }
                    },
                    rating: {
                        bsonType: "int",
                        description: "must be a obj string and is required"
                        }
                    }
                },
                
            stylists: {
                bsonType: "array",
                stylist:{
                    bsonType: "object",
                    required: ["userId", "name", "gender", "reviews", "stylistId"],
                    properties:{
                        userId: {
                            bsonType: "object",
                            properties: {$oid: {bsonType: "string", description:"must be a string and is required"}}
                        },
                        name: {
                            bsonType: "string",
                            description: "must be a obj string and is required"
                        },
                        stylistId: {
                            bsonType: "int",
                            description: "must be a obj string and is required"
                        },
                        gender: {
                            bsonType: "object",
                            description: "must be a obj string and is required"
                        },
                        reviews: {
                            bsonType: "array",
                            review:{
                                bsonType: "object",
                                required: ["created", "userId", "review", "rating", "reviewId"],
                                properties:{
                                    userId: {
                                        bsonType: "object",
                                        properties: {$oid: {bsonType: "string", description:"must be a string and is required"}}
                                    },
                                    reviewId: {
                                        bsonType: "object",
                                        properties: {$oid: {bsonType: "string", description:"must be a string and is required"}}
                                    },
                                    created: {
                                        bsonType: "date",
                                        description: "must be a date and is required"
                                    },
                                    review: {
                                        bsonType: "string",
                                        description: "must be a obj string and is required"
                                        }
                                    },
                                    rating: {
                                        bsonType: "int",
                                        description: "must be a obj string and is required"
                                        }
                                    }
                        },
                        rating: {
                            bsonType: "int",
                            description: "must be a obj string and is required"
                        }
                    }
            }
        
    }
}


};
















//templates

const getActiveSalonsJsonForm =  (genSalonVal, salonObjId, hiring)=>{
    const application = {
        "salonId": genSalonVal,
        "salonObjId": ObjectId(salonObjId),
        "role": "salonOwner",
        "hiring": hiring
    }
    return application;
}
const getApplicationJson =  (userId, salonObjId)=>{
    const application = {
        "userId": ObjectId(userId),
        "salonObjId": ObjectId(salonObjId),
        "status": "pending",
        "stylistAccess": [
            "GU"
        ]
    }
    return application;
}
const createNewSalonForm =  (genNextSalonId,name, address, street, coordinates, sName)=>{
    const form = {
        "name": name,
        "salonId": genNextSalonId,
        "rating": 1,
        "accountStatus": "active",
        "created": new Date(),
        "location": {"address": address, "street": street, "coordinates":coordinates},
        "services": [createNewServicesForm(sName)],
        "reviews": []
    }
    return form;
}

const createNewServicesForm =  (sName)=>{

    
    const form = {
        "name": sName,
        "_id": sName, 
        "created": new Date(),
        "subservices": []
    }
    return form;
}
const createNewReviewForm =  (userId, review, rating)=>{
    
    const form = {
        "userId": userId,
        "created": new Date(), //unique
        "review": review,
        "rating": rating
        
    }
    return form;
}
const createNewSubserviceForm =  (type, code, price, description)=>{
    
    const form = {
        "type": type,
        "code": code, //unique
        "price": price,
        "created": new Date(),
        "description": description
        
    }
    return form;
}
const stylist =  (stylist, stylistId)=>{
    const application = {
        "userId": ObjectId(stylist._id),
        "name": stylist.fname,
        "gender": stylist.gender,
        "stylistId": ObjectId(stylistId),
        "reviews":[],
        "created": new Date(),
        "rating": 1
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

const stylistJSON =  (stylist, stylistId)=>{
    const application = {
        "userId": ObjectId(stylist._id),
        "stylistId": stylistId,
        "name": stylist.fname,
        "gender": stylist.gender,
        "reviews":[],
        "rating": 1,
    }
    return application;
}





module.exports = {
    users,
    salons,
    stylist,
    stylistJSON,
    modifyRequestJson,
    createNewSalonForm,
    createNewServicesForm,
    createNewReviewForm,
    createNewSubserviceForm, getApplicationJson,
    getActiveSalonsJsonForm

}