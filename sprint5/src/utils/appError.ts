class AppError extends Error {
  public status: number;
  public isOperational: boolean;

  constructor(message: string, status: number, isOperational = true) {
    super(message);
    this.status = status;
    this.isOperational = isOperational;
  }
}

class NotFoundError extends AppError {
  constructor(message: string = "Resource not found") {
    super(message, 404);
  }
}

class BadRequestError extends AppError {
  constructor(message: string = "Bad request") {
    super(message, 400);
  }
}

class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized") {
    super(message, 401);
  }
}

class ConflictError extends AppError {
  constructor(message: string = "Conflict", data?: any) {
    super(message, 409);
  }
}

export default {
  AppError,
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
  ConflictError
};
