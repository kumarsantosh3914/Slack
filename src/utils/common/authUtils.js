import jwt from 'jsonwebtoken';
import { serverConfig } from '../../config/index.js'

export const createJWT = (payload) => {
    return jwt.sign(payload, serverConfig.JWT_SECRET, {
        expiresIn: serverConfig.JWT_EXPIRY
    });
};