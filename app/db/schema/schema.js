const counters = require("../counters");

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
        created: {
             bsonType: "date",
             description: "must be a date and is not required"
             }, //added not in schema
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
        avatar: { //added not in schema
            bsonType: "array",
            items: {
                bsonType: "object",
                properties:{
                    key: {
                        bsonType: "string",
                        description: "must be a obj string and is not required"
                    },
                    created: {
                        bsonType: "date",
                        description: "must be a obj date and is not required"
                    },
                }
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

const orders = {
    bsonType: "object",
    properties:{
        salonObjId:{
            bsonType: "string",
            description: "must be a string and is required"
        },
        stylistOrders: {
            bsonType:"array",
            items:{
                bsonType: "object",
                properties:{
                    orderId:{
                        bsonType: "string",
                        description: "must be a string and is required"
                    },
                    timeSlot:{
                        bsonType: "date",
                        description: "must be a string and is required"
                    },
                    item:{
                        bsonType: "string",
                        description: "must be a string and is required"
                    },
                    code:{
                        bsonType: "string",
                        description: "must be a string and is required"
                    },
                    price:{
                        bsonType: "float",
                        description: "must be a string and is required"
                    },
                    description:{
                        bsonType: "string",
                        description: "must be a string and is required"
                    },
                    assigned:{
                        bsonType: "boolean",
                        description: "must be a string and is required"
                    },
                    assignedTo:{
                        bsonType: "string",
                        description: "must be a string and is required"
                    },
                    approved:{
                        bsonType: "boolean",
                        description: "must be a string and is required"
                    },
                    cancelled:{
                        bsonType: "string",
                        description: "must be a string and is required"
                    },
                    created: {
                        bsonType: "date",
                        description: "must be a date and is required"
                    }
                }
            }
        },
        salonOrders: {
            bsonType:"array",
            items:{
                bsonType: "object",
                properties:{
                    orderId:{
                        bsonType: "string",
                        description: "must be a string and is required"
                    },
                    item:{
                        bsonType: "string",
                        description: "must be a string and is required"
                    },
                    code:{
                        bsonType: "string",
                        description: "must be a string and is required"
                    },
                    timeSlot:{
                        bsonType: "date",
                        description: "must be a string and is required"
                    },
                    price:{
                        bsonType: "float",
                        description: "must be a string and is required"
                    },
                    description:{
                        bsonType: "string",
                        description: "must be a string and is required"
                    },
                    assigned:{
                        bsonType: "boolean",
                        description: "must be a string and is required"
                    },
                    assignedTo:{
                        bsonType: "string",
                        description: "must be a string and is required"
                    },
                    approved:{
                        bsonType: "boolean",
                        description: "must be a string and is required"
                    },
                    cancelled:{
                        bsonType: "string",
                        description: "must be a string and is required"
                    },
                    created: {
                        bsonType: "date",
                        description: "must be a date and is required"
                    }
                }
            }
        }
    }
}

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
                    },
                    avatar: { //added not in schema
                        bsonType: "array",
                        items: {
                            bsonType: "object",
                            properties:{
                                
                                key: {
                                    bsonType: "string",
                                    description: "must be a obj string and is not required"
                                },
                                created: {
                                    bsonType: "date",
                                    description: "must be a obj date and is not required"
                                },
                            }
                        }
                    },
                    gallary: { //added not in schema
                        bsonType: "array",
                        items:{
                            bsonType: "object",
                            properties:{
                                fileType: {
                                    bsonType: "string",
                                    description: "must be a string and is not required"
                                    },
                                key: {
                                    bsonType: "string",
                                    description: "must be a obj string and is not required"
                                    },
                                caption: {
                                    bsonType: "string",
                                    description: "must be a obj string and is not required"
                                },
                                views: {
                                    bsonType: "int",
                                    description: "must be a obj string and is not required"
                                },
                                created: {
                                    bsonType: "date",
                                    description: "must be a obj date and is not required"
                                },
                                comments: { //add endpoint
                                    bsonType:  "array",
                                    items: {
                                        bsonType: "object",
                                        required: ["created", "from", "comment"], //added not to schema
                                        properties: {
                                            created:{
                                                bsonType: "string",
                                                description: "must be a string and is not required"
                                            },
                                            from:{
                                                bsonType: "string",
                                                description: "must be a string and is not required"
                                            },
                                            comment:{
                                                bsonType: "string",
                                                description: "must be a string and is not required"
                                            }
                                        }
                                    }
                
                
                                }
                                }
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
                    },
                    gallary: { //added not in schema
                        bsonType: "array",
                        items:{
                            bsonType: "object",
                            properties:{
                                fileType: {
                                    bsonType: "string",
                                    description: "must be a string and is not required"
                                    },
                                key: {
                                    bsonType: "string",
                                    description: "must be a obj string and is not required"
                                    },
                                caption: {
                                    bsonType: "string",
                                    description: "must be a obj string and is not required"
                                },
                                views: {
                                    bsonType: "int",
                                    description: "must be a obj string and is not required"
                                },
                                created: {
                                    bsonType: "date",
                                    description: "must be a obj date and is not required"
                                },
                                comments: { 
                                    bsonType:  "array",
                                    items: {
                                        bsonType: "object",
                                        required: ["created", "from", "comment"], //added not to schema
                                        properties: {
                                            created:{
                                                bsonType: "string",
                                                description: "must be a string and is not required"
                                            },
                                            from:{
                                                bsonType: "string",
                                                description: "must be a string and is not required"
                                            },
                                            comment:{
                                                bsonType: "string",
                                                description: "must be a string and is not required"
                                            }
                                        }
                                    }
                
                
                                }
                                }
                            }
                        
                    }
                }
            }
        
    },
    avatar: { //added not in schema
        bsonType: "array",
        items: {
            bsonType: "object",
            properties:{
                key: {
                    bsonType: "string",
                    description: "must be a obj string and is not required"
                },
                created: {
                    bsonType: "date",
                    description: "must be a obj date and is not required"
                },
            }
        }
    },
    gallary: { //added not in schema
        bsonType: "array",
        items:{
            bsonType: "object",
            properties:{
                fileType: {
                    bsonType: "string",
                    description: "must be a string and is not required"
                    },
                key: {
                    bsonType: "string",
                    description: "must be a obj string and is not required"
                    },
                caption: {
                    bsonType: "string",
                    description: "must be a obj string and is not required"
                },
                views: {
                    bsonType: "int",
                    description: "must be a obj string and is not required"
                },
                created: {
                    bsonType: "date",
                    description: "must be a obj date and is not required"
                },
                comments: { 
                    bsonType:  "array",
                    items: {
                        bsonType: "object",
                        required: ["created", "from", "comment"], //added not to schema
                        properties: {
                            created:{
                                bsonType: "string",
                                description: "must be a string and is not required"
                            },
                            from:{
                                bsonType: "string",
                                description: "must be a string and is not required"
                            },
                            comment:{
                                bsonType: "string",
                                description: "must be a string and is not required"
                            }
                        }
                    }


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
                    },
                    sharedMedia : {
                        bsonType: "object",
                        properties: {         
                            fileType: {
                                bsonType: "string",
                                description: "must be a string and is not required"
                                },
                            key: {
                                bsonType: "string",
                                description: "must be a obj string and is not required"
                                },
                            caption: {
                                bsonType: "string",
                                description: "must be a obj string and is not required"
                            }
                        }
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
                    },
                    sharedMedia : {
                        bsonType: "object",
                        properties: {         
                            fileType: {
                                bsonType: "string",
                                description: "must be a string and is not required"
                                },
                            key: {
                                bsonType: "string",
                                description: "must be a obj string and is not required"
                                },
                            caption: {
                                bsonType: "string",
                                description: "must be a obj string and is not required"
                            }
                        }
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
                    },
                    sharedMedia : { //add endpoint
                        bsonType: "object",
                        properties: {         
                            fileType: {
                                bsonType: "string",
                                description: "must be a string and is not required"
                                },
                            key: {
                                bsonType: "string",
                                description: "must be a obj string and is not required"
                                },
                            caption: {
                                bsonType: "string",
                                description: "must be a obj string and is not required"
                            }
                        }
                    }
                }
                    
            }    
        }
    }
}














//templates





const createNewOrder = async (salonObjId) =>{
    const form = {
        salonObjId: salonObjId,
        stylistOrders: [],
        salonOrders: []
    }
    return form;
}

const salonOrder = async (data, orderDoc) =>{
    const form = {
        orderId: "salon-"+await counters.getOrderNumber(orderDoc,"$salonOrders"),
        customerId: data.userId,
        item: data.serviceName.toLowerCase(),
        code: data.code.toLowerCase(),
        created: new Date(),
        price: data.price,
        salonObjId:data.salonObjId,
        description: data.description.toLowerCase(),
        status: "pending",
        assigned: false,
        assignedTo: null,
        approved: false,
        available:false,
        paymentStatus: data.paymentStatus.toLowerCase(),
        cancelled: false,
        timeSlot: new Date(data.timeSlot)
    }
    return form;
}
const booking = async data => {
    const form = {
        orderId: data.orderId,
        customerId: data.userId,
        item: data.serviceName.toLowerCase(),
        code: data.code.toLowerCase(),
        created: new Date(),
        price: data.price,
        salonObjId:data.salonObjId,
        description: data.description.toLowerCase(),
        status: "pending",
        paymentStatus: data.paymentStatus.toLowerCase(),
        assigned: true,
        assignedTo: data.assignedTo,
        approved: false,
        cancelled: false,
        available: false,
        timeSlot: data.timeSlot
    }
    return form;
}
const stylistOrder = async (data, orderDoc) =>{
    const form = {
        orderId: "stylist-"+await counters.getOrderNumber(orderDoc,"$salonOrders"),
        customerId: data.userId,
        item: data.serviceName.toLowerCase(),
        code: data.code,
        salonObjId:data.salonObjId,
        created: new Date(),
        price: data.price,
        paymentStatus: data.paymentStatus.toLowerCase(),
        description: data.description.toLowerCase(),
        status: "pending",
        assigned: true,
        assignedTo: data.assignedTo,
        approved: false,
        cancelled: false,
        available: false,
        timeSlot: data.timeSlot
    }
    return form;
}




const gallaryEntry = (fileType, views, key, caption) => {
    const form = {
        "fileType": fileType,
        "view": views,
        "key": key,
        "caption": caption.toLowerCase(),
        "created": new Date(),
        "comments": []
    }
    return form;
}
const commentEntry = (from, comment) =>{
    const form = {
        "from": from,
        "created": new Date(),
        "comment": comment
    }
    return form;
}
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
        "name": name.toLowerCase(),
        "salonId": genNextSalonId,
        "rating": 1,
        "roomDocId": "", //remove
        "roomDocIdList": [],
        "reviewsDocId": "",
        "accountStatus": "active",
        "created": new Date(),
        "location": {"address": address.toLowerCase(), "street": street.toLowerCase(), "coordinates":coordinates},
        "services": [createNewServicesForm(sName)],
        "stylists": [],
        "avatar": [],
        "reviews": []
    }
    return form;
}

const createNewServicesForm =  (sName)=>{

    
    const form = {
        "name": sName.toLowerCase(),
        "_id": sName.toLowerCase(), 
        "created": new Date(),
        "subservices": []
    }
    return form;
}

const createNewSubserviceForm =  (type, code, price, description, url)=>{
    
    const form = {
        "type": type.toLowerCase(),
        "code": code.toLowerCase(), //unique
        "price": price,
        "created": new Date(),
        "url": url,
        "description": description.toLowerCase()
        
    }
    return form;
}
const stylist =  (_id, username, fname, gender, stylistId)=>{
    const application = {
        "userId": _id,
        "username": username.toLowerCase(),
        "name": fname.toLowerCase(),
        "gender": gender.toLowerCase(),
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
        "status": status.toLowerCase(),
        "stylistAccess": permissions
    }
    return application;
}

const stylistJSON =  (data, stylistId, id)=>{
    const form = {
        "userId":id,
        "username": data.username.toLowerCase(),
        "name": data.fname.toLowerCase(),
        "gender": data.gender.toLowerCase(),
        "stylistId": stylistId,
        "reviewsDocId":data.reviewsDocId,
        "gallery":[],
        "avatar":data.avatar,
        "created": new Date(),
        "rating": 1
    }
    return form;
}


//rooms

const createNewRoomForm = async (roomName, roomStatus, roomType, members) =>{
    const form = {
        "details":{
            "roomName": roomName.toLowerCase(),
            "roomStatus": roomStatus.toLowerCase(), 
        },
        "roomType": roomType.toLowerCase(),
        "members": members,
        "messages": []

    }
    return form;
}

const createNewMemberForm = async (status, userId) =>{
    const form = {
        "permissions":[],
        "userId": userId,
        "members": [],
        "status": status.toLowerCase()

    }
    return form;
}


const createNewMessageForm = async (messageId, payload, from, to, type) =>{
    const form = {
        "messageId": messageId,
        "payload": payload, 
        "created": new Date(),
        "from": from,
        "to": to,
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

const createNewReviewInForm =  (from, payload, rating, reviewId,reviewerName)=>{
    
    const form = {
        "reviewerId": from,
        "created": new Date(), //unique
        "payload": payload,
        "rating": rating,
        "reviewerName":reviewerName,
        "reviewId": reviewId 
        
    }
    return form;
}

const createNewReviewOutForm =  (to, payload, rating, reviewId,reviewerName)=>{
    
    const form = {
        "to": to,
        "created": new Date(), //unique
        "payload": payload,
        "rating": rating,
        "reviewerName":reviewerName,
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
    createNewSubserviceForm, 
    getApplicationJson,
    getActiveSalonsJsonForm,
    createNewReviewDocForm,
    rooms, 
    reviews,
    createNewRoomForm,
    createNewMessageForm,
    createNewMemberForm,
    gallaryEntry,
    commentEntry,
    createNewOrder,
    salonOrder,
    booking,
    stylistOrder,

}