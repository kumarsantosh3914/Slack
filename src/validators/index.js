import logger from '../config/logger.config.js';

export const validateRequestBody = (schema) => {
    return async (req, res, next) => {
        try {
            logger.info('Validating request body...');
            await schema.parseAsync(req.body);
            logger.info('Request body is valid');
            next();
        } catch (error) {
            logger.error('Request body is invalid');
            return res.status(400).json({
                message: "Invalid request body",
                success: false,
                error: error
            });
        }
    }
}

export const validteQueryParams = (Schema) => {
    return async (req, res, next) => {
        try {
            await Schema.parseAsync(req.query);
            console.log('Query params are valid');
            next();
        } catch (error) {
            return res.status(400).json({
                message: "Invalid query params",
                success: false,
                error: error
            });
        }
    }
}


