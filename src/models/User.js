const mongoose = require("mongoose");


const UserSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true,
        dropsDups: true
    },
    password : {
        type: String,
        required: true,
        //select: false n faz mt sentido usar sabendo q eu posso retornar somente oq é pedido
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