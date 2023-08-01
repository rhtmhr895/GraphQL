const { dateToString } = require('../../helpers/date');
const Event = require('../../model/event');
const { userDB, transformEvent } = require('./merge')
const User = require('../../model/user');





module.exports = {
    events: async () => {
        // return ['Node.js', 'Express.js', 'React.js', 'Next.js']
        try {
            const events = await Event.find();
            return events.map(event => {
                return  transformEvent(event)
            });
        } catch (err) {
            console.log(`Error fetching records--`, err);
            throw err;
        }
    },
    createEvent: async (args, req) => {
        // const eventName = args.name 
        // return eventName
        // const event = {
        //     _id: Math.random().toString(),
        //     title: args.eventInput.title,
        //     description: args.eventInput.description,
        //     price: +args.eventInput.price,
        //     date: args.eventInput.date,
        // }
        if(!req.isAuth){
            throw new Error('Unauthorized!');
        }
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            createdBy: req.userId
        })

        let createdEvent;

        try {
            const result_1 = await event.save();
            createdEvent = transformEvent(result_1)
            const user = await User.findById(req.userId);
            if (!user) {
                throw new Error(`No user record exists`);
            }
            user.createdEvents.push(event);
            const result_2 = await user.save();
            return createdEvent;
        } catch (err) {
            console.log(`error occured while creating event--`, err);
            throw err;
        }

    },
}