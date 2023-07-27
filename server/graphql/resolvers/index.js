const bcrypt = require('bcryptjs');
const Event = require('../../model/event');
const User = require('../../model/user');





const events = async (eventIds) => {
    try {
        const events = await Event.find({ _id: { $in: eventIds } });
        return events.map(event => {
            return { 
                ...event._doc, 
                createdBy: userDB.bind(this, event._doc.createdBy),
                date: new Date(event._doc.date).toISOString()
            
            };
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


module.exports = {
    events: async () => {
        // return ['Node.js', 'Express.js', 'React.js', 'Next.js']
        try {
            const events = await Event.find();
            return events.map(event => {
                return { ...event._doc, 
                    createdBy: userDB.bind(this, event._doc.createdBy),
                    date: new Date(event._doc.date).toISOString() 
                };
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
            createdEvent = { 
            ...result_1._doc ,
            createdBy: userDB.bind(this, result_1._doc.createdBy),
            date: new Date(event._doc.date).toISOString()
        };
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

    createUser: async (args) => {
        try {
            const user = await User.findOne({ email: args.userInput.email });
            if (user) {
                throw new Error(`User already exists`);
            }
            const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
            const user_1 = new User({
                email: args.userInput.email,
                password: hashedPassword
            });
            const result = await user_1.save();
            return { ...result._doc, password: null };
        } catch (err) {
            console.log(`Error occured while hashing password--`, err);
            throw err;
        }


    }
}