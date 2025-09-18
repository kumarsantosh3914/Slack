import jwt from 'jsonwebtoken';
import { serverConfig } from "../config/index.js";
import userRepository from "../repositories/userRepository.js";
import { UnauthorizedError } from "../utils/errors/app.error.js";

function extractToken(req) {
    const header = req.headers['authorization'] || req.headers['Authorization'];
    if (header && typeof header === 'string' && header.startsWith('Bearer ')) {
        return header.slice(7).trim();
    }
    const xAccess = req.headers['x-access-token'];
    if (typeof xAccess === 'string' && xAccess.trim().length > 0) {
        return xAccess.trim();
    }
    return null;
}

export const isAuthenticated = async (req, res, next) => {
    try {
        const token = extractToken(req);
        if (!token) {
            throw new UnauthorizedError('Authentication token missing');
        }

        let payload;
        try {
            payload = jwt.verify(token, serverConfig.JWT_SECRET);
        } catch (err) {
            throw new UnauthorizedError('Invalid or expired token', { details: { reason: err?.message } });
        }

        const user = await userRepository.getById(payload.id, { projection: '-password -__v', lean: true });
        if (!user) {
            throw new UnauthorizedError('User not found for token');
        }

        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
}