import User from '../models/user.js';
import crudRepository from './crudRepository.js';

const sanitizeProjection = '-password -__v';

const userRepository = {
    ...crudRepository(User),

    signUpUser: async function signUpUser(data) {
        const normalized = {
            ...data,
            email: data.email?.toLowerCase().trim(),
            username: data.username?.trim(),
        };

        const user = new User(normalized);
        await user.save();
        return user.toJSON();
    },

    getByEmail: async function getByEmail(email) {
        const user = await User.findOne({ email: email?.toLowerCase().trim() })
            .select(sanitizeProjection)
            .lean()
            .exec();
        return user;
    },

    getByUsername: async function getByUsername(username) {
        const user = await User.findOne({ username: username?.trim() })
            .select(sanitizeProjection)
            .lean()
            .exec();
        return user;
    },

    getByToken: async function getByToken(token) {
        const user = await User.findOne({ verificationToken: token })
            .select(sanitizeProjection)
            .lean()
            .exec();
        return user;
    }
}

export default userRepository;