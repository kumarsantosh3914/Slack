import User from '../models/user.js';
import userRepository from '../repositories/userRepository.js';
import logger from '../config/logger.config.js';
import { BadRequestError, ConflictError, NotFoundError, UnauthorizedError } from '../utils/errors/app.error.js';
import { createJWT } from '../utils/common/authUtils.js';

export const signUpService = async (data) => {
    const email = data?.email?.toLowerCase().trim();
    const username = data?.username?.trim();
    const password = data?.password;

    if (!email || !username || !password) {
        throw new BadRequestError('email, username and password are required', { details: { email: !!email, username: !!username, password: !!password } });
    }

    const [existingByEmail, existingByUsername] = await Promise.all([
        userRepository.getByEmail(email),
        userRepository.getByUsername(username)
    ]);

    if (existingByEmail) {
        throw new ConflictError('Email already in use');
    }
    if (existingByUsername) {
        throw new ConflictError('Username already in use');
    }

    const created = await userRepository.signUpUser({ email, username, password });
    logger.info('User signed up', { email: created.email, id: created._id });

    const token = createJWT({ id: created._id, email: created.email, username: created.username });
    return {
        user: created,
        token
    };
}

export const verifyTokenService = async (token) => {
    if (!token) {
        throw new BadRequestError('Verification token is required');
    }

    const user = await userRepository.getByToken(token);
    if (!user) {
        throw new NotFoundError('Invalid verification token');
    }

    if (user.verificationTokenExpiry && new Date(user.verificationTokenExpiry).getTime() < Date.now()) {
        throw new BadRequestError('Verification token has expired');
    }

    const updated = await userRepository.update(user._id, {
        isVerified: true,
        verificationToken: null,
        verificationTokenExpiry: null,
    }, { newDocument: true, lean: true });

    logger.info('User verified successfully', { id: updated?._id });
    return updated;
}

export const signInService = async (data) => {
    const identifier = data?.email?.toLowerCase().trim() || data?.username?.trim();
    const password = data?.password;
    if (!identifier || !password) {
        throw new BadRequestError('identifier (email or username) and password are required');
    }

    // Fetch user including password for verification
    const findQuery = data?.email
        ? { email: data.email.toLowerCase().trim() }
        : { username: data.username.trim() };

    const user = await User.findOne(findQuery).select('+password').exec();
    if (!user) {
        throw new UnauthorizedError('Invalid credentials');
    }

    const passwordOk = await user.comparePassword(password);
    if (!passwordOk) {
        throw new UnauthorizedError('Invalid credentials');
    }

    // Optional: enforce verification before login
    // if (!user.isVerified) {
    //     throw new UnauthorizedError('Account is not verified');
    // }

    const safeUser = user.toJSON();
    const token = createJWT({ id: safeUser._id, email: safeUser.email, username: safeUser.username });
    logger.info('User signed in', { id: safeUser._id });
    return { user: safeUser, token };
}

