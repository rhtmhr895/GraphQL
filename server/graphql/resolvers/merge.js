const Event = require('../../model/event');
const User = require('../../model/user');
const { dateToString } = require('../../helpers/date');



const events = async (eventIds) => {
    try {
        const events = await Event.find({ _id: { $in: eventIds } });
        return events.map(event => {
            return transformEvent(event)
        });
    } catch (err) {
        throw err;
    }
}

const userDB = async (userId) => {
    try {
        const user = await User.findById(userId);
        return { ...user._doc, 
            createdEvents: events.bind(this, user._doc.createdEvents) 
        };
    } catch (err) {
        throw err;
    }
}

const singleEvent = async (eventId) => {
    try{
        const event = await Event.findById({_id: eventId});
        return transformEvent(event);

    } catch(err) {
        throw err;
    }

}

const transformEvent = event => {
 
    return {
        ...event._doc, 
        createdBy: userDB.bind(this, event.createdBy),
        date: dateToString(event._doc.date)
    };
};

exports.userDB = userDB;
// exports.events = events;
exports.transformEvent = transformEvent;
exports.singleEvent = singleEvent;