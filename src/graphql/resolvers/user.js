const bcrypt = require("bcryptjs");

const User = require("../../models/User");

module.exports = {


    createUser: async ({email, password}) => {
        try {
            const existingUser = await User.findOne({ email: email });
            if (existingUser) {
                throw new Error('User exists already.');
            }

            const hashedPassword = await bcrypt.hash(password, 12);

            const user = new User({
                email: email,
                password: hashedPassword
            });

            const result = await user.save();

            return { ...result._doc, password: null, _id: result.id };

        } catch (err) {
            throw err;
        }
    },

    login: async ({email, password}) => {
        
    }
}