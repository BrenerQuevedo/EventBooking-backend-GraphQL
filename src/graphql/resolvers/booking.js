const Event = require("../../models/Event");
const Booking = require("../../models/Booking");
const { handleBooking, handleEvent} = require("./merge")



module.exports = {
    bookings: async () => {
        try {
            const bookings = await Booking.find()
            //.populate("user")
            //.populate("event")

            return bookings.map(booking => {
                return handleBooking(booking);
            });

        } catch (err) {
            throw err;
        }
    },

    bookEvent: async args => {
        try {
            //const user = "5e55cf61a29225041cc0763b"
            const idEvent = await Event.findOne({ _id: args.eventId });


            const newBooking = new Booking({
                user: "5e55cf61a29225041cc0763b",
                event: idEvent
            });

            const res = await newBooking.save();

            return handleBooking(res);

        } catch (error) {
            throw error;
        }
    },

    cancelBooking: async args => {
        try {
            const booking = await Booking.findById(args.bookingId).populate("event");
            const event = handleEvent(booking.event)
            await Booking.deleteOne({ _id: args.bookingId })

            return event;


        } catch (error) {
            throw error;
        }
    }
}