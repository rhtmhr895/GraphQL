const User = require('../../model/user');
const bcrypt = require('bcryptjs');



module.exports = {
   

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
    },

    
}