import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/AppError";
export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message = "Something went wrong";

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
      error: message,
    });
    return;
  }
  res.status(statusCode).json({
    success: false,
    error: err.message || message,
    stack: err.stack,
  });
};
