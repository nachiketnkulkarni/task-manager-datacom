import logger from "./loggerHandler.js";
import * as response from "./responseHandler.js";

/**
 * Central error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  const isCastError = err.name === "CastError";
  const isValidationError = err.name === "ValidationError";

  let statusCode = 500;
  let clientMessage =
    err.message || "An unexpected error occurred on the server.";
  let errorDetails = null;

  if (isCastError) {
    statusCode = 400;
    clientMessage = `Invalid ID format for ${err.path}: ${err.value}`;
  } else if (isValidationError) {
    statusCode = 400;
    clientMessage =
      "One or more validation errors occurred. Please check the 'error' field for details.";

    errorDetails = Object.fromEntries(
      Object.entries(err.errors).map(([key, val]) => [key, val.message])
    );
  } else if (err.statusCode) {
    statusCode = err.statusCode;
    clientMessage = err.message || clientMessage;
    errorDetails = err.details || null;
  }

  const isDuplicateKeyError = err.code === 11000;

  if (isDuplicateKeyError) {
    statusCode = 409;
    clientMessage = `Duplicate value for unique field(s): ${Object.keys(
      err.keyValue
    ).join(", ")}`;
    errorDetails = err.keyValue;
  }

  logger.error("Unhandled Error", {
    message: err.message,
    path: req.originalUrl,
    method: req.method,
    stack: err.stack,
  });

  if (statusCode >= 500) {
    return response.serverError(res, clientMessage);
  }

  return res.status(statusCode).json({
    success: false,
    status: statusCode,
    message: clientMessage,
    error: errorDetails,
  });
};

export default errorHandler;
