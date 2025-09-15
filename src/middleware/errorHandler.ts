import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/AppError";
import {
  TokenExpiredError,
  JsonWebTokenError,
  NotBeforeError,
} from "jsonwebtoken";
import { pgError } from "../utils/pgError";
import { classifyPgError } from "../utils/pgErrorClassifier";
export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message = "Something went wrong";
  const pg = pgError(err);
  const classified = classifyPgError(pg);
  // Handle JWT Errors
  if (err instanceof TokenExpiredError) {
    res.status(401).json({
      success: false,
      error: "Token expired",
    });
    return;
  }
  if (err instanceof JsonWebTokenError) {
    res.status(401).json({
      success: false,
      error: "Invalid token",
    });
    return;
  }
  if (err instanceof NotBeforeError) {
    res.status(401).json({
      success: false,
      error: "Token not yet active",
    });
    return;
  }
  if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation error";
    const formatted = err.issues.map(e => ({
      field: e.path.join("."),
      message: e.message,
    }));
    res.status(statusCode).json({
      success: false,
      error: message,
      issues: formatted,
    });
    return;
  }
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
    return;
  }

  if (classified) {
    if (classified.code === "RESOURCE_EXISTS") {
      console.error("Unhandled UNIQUE constraint:", pg);
    }
    res.status(classified.httpStatus).json({
      success: false,
      error: classified.message,
      code: classified.code,
    });
    return;
  }
  res.status(statusCode).json({
    success: false,
    error: err.message || message,
    stack: err.stack,
  });
};
