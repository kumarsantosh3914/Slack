export class InternalServerError {
    constructor(message) {
        this.statusCode = 500;
        this.message = message;
        this.name = "InternalServerError";
    }
}

export class BadRequestError {
    constructor(message) {
        this.statusCode = 400;
        this.message = message;
        this.name = "BadRequestError";
    }
}

export class NotFoundError {
    constructor(message) {
        this.statusCode = 404;
        this.message = message;
        this.name = "NotFoundError";
    }
}

export class UnauthorizedError {
    constructor(message) {
        this.statusCode = 401;
        this.message = message;
        this.name = "UnauthorizedError";
    }
}

export class ForbiddenError {
    constructor(message) {
        this.statusCode = 403;
        this.message = message;
        this.name = "ForbiddenError";
    }
}

export class ConflictError {
    constructor(message) {
        this.statusCode = 409;
        this.message = message;
        this.name = "ConflictError";
    }
}

export class NotImplementedError {
    constructor(message) {
        this.statusCode = 501;
        this.message = message;
        this.name = "NotImplementedError";
    }
}


