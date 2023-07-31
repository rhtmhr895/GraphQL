const { dateToString } = require('../../helpers/date');
const Event = require('../../model/event');
const { userDB, transformEvent } = require('./merge')




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
    createEvent: async (args) => {
        // const eventName = args.name 
        // return eventName
        // const event = {
        //     _id: Math.random().toString(),
        //     title: args.eventInput.title,
        //     description: args.eventInput.description,
        //     price: +args.eventInput.price,
        //     date: args.eventInput.date,
        // }
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            createdBy: '64c20fb64a7af7f753fe0d45'
        })

        let createdEvent;

        try {
            const result_1 = await event.save();
            createdEvent = transformEvent(result_1)
            const user = await User.findById('64c20fb64a7af7f753fe0d45');
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