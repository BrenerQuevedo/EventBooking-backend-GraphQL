const Event = require("../../models/Event");
const User = require("../../models/User");
const {dateToString} = require("../../helpers/date")



const user = async userId => {
    try {
        const user = await User.findById(userId)
        return {
            ...user._doc,
            _id: user.id,
            createdEvents: events.bind(this, user._doc.createdEvents)
        }
    } catch (err) {
        throw err;
    }
}

const events = async eventIds => {
    try {

        const events = await Event.find({ _id: { $in: eventIds } })

        return events.map(handleEvent);

    } catch (err) {
        throw err;
    }
}

const singleEvent = async eventId => {
    try {
        const event = await Event.findById(eventId);
        return handleEvent(event);
    } catch (err) {
        throw err;
    }
};

const handleEvent = event => {
    return {
        ...event._doc,
        _id: event.id,
        date: dateToString(event._doc.date),
        creator: user.bind(this, event._doc.creator)
    };
};


const handleBooking = booking => {
    return {
        ...booking._doc,
        user: user.bind(this, booking._doc.user),
        event: singleEvent.bind(this, booking._doc.event),
        createdAt: dateToString(booking._doc.createdAt),
        updatedAt: dateToString(booking._doc.updatedAt)
    }
}

exports.handleEvent = handleEvent;
exports.handleBooking = handleBooking; 

//exports.user = user;
//exports.events = events;
//exports.singleEvent = singleEvent;
