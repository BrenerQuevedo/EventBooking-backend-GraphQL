const mongoose = require("mongoose");


const BookingSchema = new mongoose.Schema({
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event"
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {
    timestamps: true
});

const Booking = mongoose.model("Booking",BookingSchema);

module.exports = Booking;