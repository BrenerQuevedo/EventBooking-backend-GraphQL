const mongoose = require("mongoose");


const UserSchema = new mongoose.Schema({
    name :{
        type: String,
        required: true,        
    },
    password : {
        type: String,
        required: true,
        //select: false n faz mt sentido usar sabendo q eu posso retornar somente oq é pedido
    },
    email:{
        type: String,
        required: true,
        unique: true,
        dropsDups: true
    },
    createdEvents: [
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Event"
        }
    ]
});


const User = mongoose.model("User", UserSchema)
 
module.exports = User;