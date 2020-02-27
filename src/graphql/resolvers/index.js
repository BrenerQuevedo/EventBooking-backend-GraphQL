const bcrypt = require("bcryptjs");

const User = require("../../models/User");
const Event = require("../../models/Event");
const Booking = require("../../models/Booking");

const user = async userId => {
    try {
    const user = await User.findById(userId)
        return {
            ...user._doc,
            _id: user.id, 
            createdEvents: events.bind(this, user._doc.createdEvents)}
    } catch(err) {
        throw err;
    }
}

const events = async eventIds => {
    try {

    const events = await Event.find({_id: {$in: eventIds}})
    
    events.map(event => {
            return {
                ...event._doc,
                _id: event.id,
                date: new Date(event._doc.date).toISOString(),
                creator: user.bind(this, event.creator)
            };
        });
        return events;
    } catch(err ) {
        throw err;
    }
}

module.exports =  {
   /* events: async () => {
      const events = await Event.find()
      try {
        return events.map(event => {
            //_id: event._doc._id.toString() é o mesmo que event.id
            return {
                ...event._doc,
                _id: event.id,
                date: new Date(event._doc.date).toISOString(),
                creator: user.bind(this, event._doc.creator)
            };
        });

        }catch(err ) {
           throw err;
       }; 
    },
*/

events: async () => {
    try {
      const events = await Event.find().populate({
        path: "creator",
        populate: { path: "createdEvents" },
        
      });

      return events.map(e => {
          return {
              ...e._doc,
              date: new Date(e.date).toISOString(),
          }
      })
    } catch (err) {
      throw err;
    }
  },
    booking: async () => {
        try {
            const bookings = await Booking.find()
            .populate("user")
            .populate("event")

            return bookings;
        } catch (error) {
            throw error;
        }

    },
    createEvent: async (args) => {
      
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            location: args.eventInput.location,
            creator: "5e55cf61a29225041cc0763b"
        });
        
        let createdEvent;
    
        try {

        const res = await event.save();
            
        createdEvent = {
            ...res._doc,
            _id: event.id, 
            date: new Date(event._doc.date).toISOString(),
            creator: user.bind(this, res._doc.creator)
        }; 

            const owner = await User.findById("5e55cf61a29225041cc0763b");
        
            if (!owner) {
                throw new Error("User not <found></found>. ")
            }

            owner.createdEvents.push(event);
            await owner.save();
        
            return createdEvent;
        
        }catch(err){
            throw err;
        };
    },


    
    createUser: async (args) => {
        try {
            const existingUser = await User.findOne({ email: args.userInput.email });
                if (existingUser) {
                    throw new Error('User exists already.');
                }

            const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
      
            const user = new User({
              email: args.userInput.email,
              password: hashedPassword
            });
      
            const result = await user.save();
      
            return { ...result._doc, password: null, _id: result.id };
            
          } catch (err) {
            throw err;
          }
    },

    bookEvent: async args => {
        try{
        const user = "5e55cf61a29225041cc0763b"
        const event = args.id

        const newBooking = new Booking({
            user,
            event
        });

        const res = await newBooking.save();
        
        return {
            ...newBooking._doc,
            createdAt: new Date(res.createdAt).toISOString(),
            updatedAt: new Date(res.updatedAt).toISOString(),
        }
        
        } catch(error) {
            throw error;
        }
    }
}