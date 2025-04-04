import { ApiError } from '../utils/ApiError.js'; // Import ApiError

const errorHandler = (err, req, res, next) => {
  // If the error is an instance of ApiError, return a structured response
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: err.success,
      message: err.message,
      errors: err.errors,
    });
  }

  // Otherwise, return a generic 500 Internal Server Error
  return res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    errors: [],
  });
};

export {
  errorHandler
};
