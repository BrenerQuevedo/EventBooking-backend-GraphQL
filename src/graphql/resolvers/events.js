const Event = require("../../models/Event");
const User = require("../../models/User");

const {handleEvent} = require("./merge");
const {dateToString} = require("../../helpers/date")


module.exports = {


    events: async () => {
        try {
            const events = await Event.find().populate({
                path: "creator",
                populate: { path: "createdEvents" },

            });

            return events.map(handleEvent);

        } catch (err) {
            throw err;
        }
    },
    createEvent: async (args, req) => {
        if(!req.isAuth) {
            throw new Error("User not authenticated!")
        }

        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: dateToString(args.eventInput.date),
            location: args.eventInput.location,
            creator: req.id
        });

        let createdEvent;

        try {
            const res = await event.save();

            //await res.populate("creator");

            createdEvent = handleEvent(res);

            const owner = await User.findById(req.id);

            if (!owner) {
                throw new Error("User not <found></found>. ")
            }

            owner.createdEvents.push(event);
            await owner.save();

            return createdEvent;

        } catch (err) {
            throw err;
        };
    },


}