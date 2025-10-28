export const errorHandler = (err, req, res, next) => {
  console.error("Error : ", err.stack);
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    error: message,
    ...err(
      process.env.NODE_ENV === "development" && {
        stack: err.stack,
        details: err,
      }
    ),
  });
};

export class ApiError extends Error{
    constructor (statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.name = "ApiError";
    }
}

export const notFoundHandler = (req, res, next) => {
  const error = new ApiError(404, `Route ${req.originalUrl} not found`);
  next(error);
}