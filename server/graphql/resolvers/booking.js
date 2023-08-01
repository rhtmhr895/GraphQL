const { dateToString } = require('../../helpers/date');
const Booking = require('../../model/booking');
const Event = require('../../model/event');

const { singleEvent , userDB, transformEvent} = require('./merge')

const transformBooking = booking => {
    return {
        ...booking._doc,
        user: userDB.bind(this, booking._doc.user),
        event: singleEvent.bind(this, booking._doc.event),
        createdAt: dateToString(booking._doc.createdAt),
        updatedAt: dateToString(booking._doc.updatedAt)

    }
}


module.exports = {
    bookings: async (args,req) => {
        if(!req.isAuth){
            throw new Error('Unauthorized!');
        }
        try{
            const bookings = await Booking.find();
            return bookings.map(booking => {
                return transformBooking(booking)
                  
                
            })

        } catch (err){
            throw err;
        }
    },

    bookEvent: async (args, req) => {
        if(!req.isAuth){
            throw new Error('Unauthorized!');
        }
        try {
            const event = await Event.findOne({_id: args.eventId});
            const booking = new Booking({
                event: event._id,
                user: req.userId
            });
            const result = await booking.save();
            return transformBooking(result)

        } catch(err) {
            throw err;
        }
    },

    cancelBooking : async (args, req) => {
        if(!req.isAuth){
            throw new Error('Unauthorized!');
        }
        try{
            const booking = await Booking.findById({_id: args.bookingId}).
            populate('event');

            // console.log("this is booking", booking)
            const event = transformEvent(booking.event);
            await Booking.deleteOne({_id: args.bookingId});
            
            return event;
        } catch (err) {
            throw err;
        }
    }
}