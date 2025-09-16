class AppError extends Error {
    constructor({ name = 'AppError', message = 'Unexpected error', statusCode = 500, code = 'APP_ERROR', details = undefined, isOperational = true }) {
        super(message);
        this.name = name;
        this.statusCode = statusCode;
        this.code = code;
        this.details = details;
        this.isOperational = isOperational;
        Error.captureStackTrace?.(this, this.constructor);
    }

    toJSON() {
        return {
            name: this.name,
            message: this.message,
            statusCode: this.statusCode,
            code: this.code,
            details: this.details
        };
    }

    static wrap(error, fallback = {}) {
        if (error instanceof AppError) return error;
        return new InternalServerError(fallback.message || error?.message || 'Internal Server Error', { details: { cause: error } });
    }
}

export class BadRequestError extends AppError {
    constructor(message = 'Bad Request', options = {}) {
        super({ name: 'BadRequestError', message, statusCode: 400, code: 'BAD_REQUEST', ...options });
    }
}

export class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized', options = {}) {
        super({ name: 'UnauthorizedError', message, statusCode: 401, code: 'UNAUTHORIZED', ...options });
    }
}

export class ForbiddenError extends AppError {
    constructor(message = 'Forbidden', options = {}) {
        super({ name: 'ForbiddenError', message, statusCode: 403, code: 'FORBIDDEN', ...options });
    }
}

export class NotFoundError extends AppError {
    constructor(message = 'Not Found', options = {}) {
        super({ name: 'NotFoundError', message, statusCode: 404, code: 'NOT_FOUND', ...options });
    }
}

export class ConflictError extends AppError {
    constructor(message = 'Conflict', options = {}) {
        super({ name: 'ConflictError', message, statusCode: 409, code: 'CONFLICT', ...options });
    }
}

export class UnprocessableEntityError extends AppError {
    constructor(message = 'Unprocessable Entity', options = {}) {
        super({ name: 'UnprocessableEntityError', message, statusCode: 422, code: 'UNPROCESSABLE_ENTITY', ...options });
    }
}

export class TooManyRequestsError extends AppError {
    constructor(message = 'Too Many Requests', options = {}) {
        super({ name: 'TooManyRequestsError', message, statusCode: 429, code: 'TOO_MANY_REQUESTS', ...options });
    }
}

export class NotImplementedError extends AppError {
    constructor(message = 'Not Implemented', options = {}) {
        super({ name: 'NotImplementedError', message, statusCode: 501, code: 'NOT_IMPLEMENTED', ...options });
    }
}

export class ServiceUnavailableError extends AppError {
    constructor(message = 'Service Unavailable', options = {}) {
        super({ name: 'ServiceUnavailableError', message, statusCode: 503, code: 'SERVICE_UNAVAILABLE', ...options });
    }
}

export class InternalServerError extends AppError {
    constructor(message = 'Internal Server Error', options = {}) {
        super({ name: 'InternalServerError', message, statusCode: 500, code: 'INTERNAL_SERVER_ERROR', ...options });
    }
}

export function isAppError(err) {
    return err instanceof AppError || (typeof err?.statusCode === 'number' && typeof err?.message === 'string');
}

export function validationError(details) {
    return new UnprocessableEntityError('Validation failed', { details });
}

export { AppError };

