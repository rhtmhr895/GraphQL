const User = require('../../model/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')



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

    login: async (args) =>{
        try{
            const user = await User.findOne({email: args.email});
            if(!user) {
                throw new Error('User does not exist!');
            }
            const isPasswordValid = await bcrypt.compare(args.password, user.password);
            if(!isPasswordValid){
                throw new Error('Password is incorrect!');
            }
            const token = jwt.sign({userId: user._id, email: user.email}, 'sEsh##241haAW34nafsh1!23as2@HSA45', {
                expiresIn: '1h'
            }
          );

          return { 
            userId: user._id,
            token: token,
            tokenExpiration: 1
          }

        } catch (err) {
            throw err;
        }
    }

    
}