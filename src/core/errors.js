class AppError extends Error {
    constructor(message, statusCode, code, details) {
        super(message);
        this.statusCode = statusCode || 500;
        this.code = code || 'ERROR';
        this.details = details || null;
        this.isOperational = true;
    }
}

class ValidationError extends AppError {
    constructor(message, details) {
        super(message, 400, 'VALIDATION_ERROR', details);
    }
}

class AuthError extends AppError {
    constructor(message) {
        super(message, 401, 'AUTH_ERROR');
    }
}

class NotFoundError extends AppError {
    constructor(message) {
        super(message, 404, 'NOT_FOUND');
    }
}

class ConflictError extends AppError {
    constructor(message) {
        super(message, 409, 'CONFLICT');
    }
}

class ServerError extends AppError {
    constructor(message) {
        super(message, 500, 'SERVER_ERROR');
    }
}

module.exports = {
    AppError,
    ValidationError,
    AuthError,
    NotFoundError,
    ConflictError,
    ServerError
};
