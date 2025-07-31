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
export default {
  AppError,
  NotFoundError,
  BadRequestError,
};
