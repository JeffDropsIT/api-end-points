const ObjectId = require('mongodb').ObjectID;

const users = {
    bsonType: "object",
    required: ["password", "phone", "username"],
    properties: {
        email: {
            bsonType: "string", 
            description: "must be a string and is required"
        },
        roomDocIdList: {
            bsonType: "array", 
            items: {
                bsonType: "object",
                required: ["roomDocId"],
                properties:{
                    roomDocId:{
                        bsonType: "string",
                        description: "must be a string and is not required  array of roomDocId"
                    }
                }
                
            }
        },
        reviewsDocId:{
            bsonType:"string",
            description: "must be the string representing the array where all the reviews in and out are stored" 
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
        
        username: {
            bsonType: "string",
            description: "must be a string and is required"
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
            items:{
                    bsonType: "object",
                    properties:{
                        salonObjId: {
                            bsonType: "string",
                            description: "must be a string and is not required"
                        }
                    }
                }
            }
            ,
        bookings: {
            bsonType: "array",
            items: {
                    bsonType: "object",
                    required: ["orders"],
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
                }
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
        roomDocId: {
            bsonType: "string", 
            description: "must be a string and is not required"
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
            items:{
                bsonType: "object",
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
        reviewsDocId:{
            bsonType: "string", 
            description: "must be a string that represents the id of the review document which contains the reviewsIn of this salon"
        },
                
            stylists: {
                bsonType: "array",
                items:{
                    bsonType: "object",
                    required: ["userId", "name", "username", "stylistId", "gender", "reviewsDocId"],
                    properties:{
                        userId: {
                            bsonType: "string",
                            description:"must be a string and is required"
                        },
                        name: {
                            bsonType: "string",
                            description: "must be a obj string and is required"
                        },
                        username: {
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
                        reviewsDocId:{
                            bsonType: "string", 
                            description: "must be a string that represents the id of the review document which contains the reviewsIn of this stylist"
                        }
                    }
            }
        
    }
}


};

const rooms = {
    bsonType: "object",
    required: ["details", "messages", "roomType", "members"], 
    properties: {
        details: {
            bsonType: "object",
            properties:{
                roomName:{
                    bsonType: "string",
                    description: "the username of the person the room is required"
                },
                roomStatus:{
                    enum: ["offline", "online", "blocked", "muted"],
                    description: "the status of the the room  required"
                }
            }
        },
        roomType: {
            enum: ["private", "public"], 
            description: "must be a enum that represents the type of room this is"
        },
        members:{
            bsonType: "array",
            items: {
                bsonType: "object",
                required: ["permissionsList", "userId","status"],
                properties: {
                    permissionsList: {
                        bsonType: "array",
                        items: {
                            bsonType: "object",
                            properties:{
                                permissions:{
                                    bsonType: "string",
                                    description: "must be a string representing permission"
                                }
                            }
                        }
                    },
                    userId: {
                        bsonType: "string",
                        description: "must be an string representing a userId who is allow in this room"
                        
                    }, 
                    status: {
                        enum: ["offline", "online", "blocked", "muted", "active"],
                        description: "must be one of the enum values"
                    }
                }
            }
        }
        ,
        messages: {
            bsonType: "array",
            items:{
                bsonType:"object",
                required: ["messageId", "created","payload", "from", "type" ],
                properties:{
                    messageId: {
                        bsonType:"string", 
                        description: "a unique string that represent a message"
                    },
                    created: {
                        bsonType:"string", 
                        description: "a unique string that represent a message"
                    },
                    payload: {
                        bsonType:"string", 
                        description: "a unique string that represents a message"
                    },
                    from: {
                        bsonType:"string", 
                        description: "a string that represents the userId of the user who sent the message"
                    },
                    type: {
                        bsonType:"int", 
                        description: "an integer that represents the type of the message that this is"
                    }
                }
            }
        }

    }

}

const reviews = {
    bsonType: "object",
    required: ["userId", "reviewsIn", "reviewsOut"], 
    properties:{
        userId:{
            bsonType: "string",
            description: "must be a string that represents the userid/salonId that this review doc belongs too"
        },
        reviewsIn:{
            bsonType:"array",
            items: {
                bsonType: "object",
                required: ["reviewId", "created","payload", "from", "rating" ],
                properties:{
                    from: {
                        bsonType: "string",
                        description: "a unique string representive for the userId who wrote the review"
                    },
                    reviewId: {
                        bsonType: "string",
                        description: "a unique string representive for the review"
                    },
                    created: {
                        bsonType: "date",
                        description: "must be a date and is required"
                    },
                    payload: {
                        bsonType: "string",
                        description: "must be a obj string and is required"
                    },
                    rating: {
                        bsonType: "int",
                        description: "must be a obj string and is required"
                    }
                }
            }    
        },
        reviewsOut:{
            bsonType:"array",
            items: {
                bsonType: "object",
                required: ["reviewId", "created","payload", "to", "rating" ],
                properties:{
                    to: {
                        bsonType: "string",
                        description: "a unique string representive for the userId who wrote the review"
                    },
                    reviewId: {
                        bsonType: "string",
                        description: "a unique string representive for the review"
                    },
                    created: {
                        bsonType: "date",
                        description: "must be a date and is required"
                    },
                    payload: {
                        bsonType: "string",
                        description: "must be a obj string and is required"
                        },
                    rating: {
                        bsonType: "int",
                        description: "must be a obj string and is required"
                    }
                }
                    
            }    
        }
    }
}














//templates

const getActiveSalonsJsonForm =  (genSalonVal, salonObjId, hiring)=>{
    const application = {
        "salonId": genSalonVal,
        "salonObjId": salonObjId,
        "role": "salonOwner",
        "hiring": hiring
    }
    return application;
}
const getApplicationJson =  (userId, salonObjId)=>{
    const application = {
        "userId": userId,
        "salonObjId": salonObjId,
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
        "roomDocId": "",
        "reviewsDocId": "",
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
const stylist =  (_id, username, fname, gender, stylistId)=>{
    const application = {
        "userId": _id,
        "username": username,
        "name": fname,
        "gender": gender,
        "stylistId": stylistId,
        "reviewsDocId":"",
        "created": new Date(),
        "rating": 1
    }
    return application;
}

const modifyRequestJson =  (userId, salonObjId, status, permissions)=>{
    const application = {
        "userId": userId,
        "salonObjId": salonObjId,
        "status": status,
        "stylistAccess": permissions
    }
    return application;
}

const stylistJSON =  (_id, username, fname, gender, stylistId)=>{
    const form = {
        "userId": _id,
        "username": username,
        "name": fname,
        "gender": gender,
        "stylistId": stylistId,
        "reviewsDocId":"",
        "created": new Date(),
        "rating": 1
    }
    return form;
}


//rooms

const createNewRoomForm = async (roomName, roomStatus, roomType) =>{
    const form = {
        "details":{
            "roomName": roomName,
            "roomStatus": roomStatus, 
        },
        "roomType": roomType,
        "members": [],
        "messages": []

    }
    return form;
}

const createNewMemberForm = async (status, userId) =>{
    const form = {
        "permissions":[],
        "userId": userId,
        "members": [],
        "status": status

    }
    return form;
}


const createNewMessageForm = async (messageId, payload, from, type) =>{
    const form = {
        "messageId": messageId,
        "payload": payload, 
        "created": new Date(),
        "from": from,
        "type": type

    }
    return form;
}
//reviews
const createNewReviewDocForm = async (userId) =>{
    const form =  {
        "userId": userId,
        "reviewsIn": [],
        "reviewsOut": []
    }
    return form;
}

const createNewReviewInForm =  (from, payload, rating, reviewId)=>{
    
    const form = {
        "from": from,
        "created": new Date(), //unique
        "payload": payload,
        "rating": rating,
        "reviewId": reviewId 
        
    }
    return form;
}

const createNewReviewOutForm =  (to, payload, rating, reviewId)=>{
    
    const form = {
        "to": to,
        "created": new Date(), //unique
        "payload": payload,
        "rating": rating,
        "reviewId": reviewId 
        
    }
    return form;
}


module.exports = {
    users,
    salons,
    stylist,
    stylistJSON,
    modifyRequestJson,
    createNewSalonForm,
    createNewServicesForm,
    createNewReviewInForm,
    createNewReviewOutForm,
    createNewSubserviceForm, getApplicationJson,
    getActiveSalonsJsonForm,
    createNewReviewDocForm,
    rooms, 
    reviews,
    createNewRoomForm,
    createNewMessageForm,
    createNewMemberForm

}