"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AppError extends Error {
    constructor(message, status, isOperational = true) {
        super(message);
        this.status = status;
        this.isOperational = isOperational;
    }
}
class NotFoundError extends AppError {
    constructor(message = "Resource not found") {
        super(message, 404);
    }
}
class BadRequestError extends AppError {
    constructor(message = "Bad request") {
        super(message, 400);
    }
}
class UnauthorizedError extends AppError {
    constructor(message = "Unauthorized") {
        super(message, 401);
    }
}
class ConflictError extends AppError {
    constructor(message = "Conflict", data) {
        super(message, 409);
    }
}
exports.default = {
    AppError,
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
    ConflictError
};
