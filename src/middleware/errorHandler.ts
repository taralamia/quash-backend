import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/AppError";
import { TokenExpiredError, JsonWebTokenError, NotBeforeError } from "jsonwebtoken";
import { PgErrorInfo, pgError,PgCode } from "../utils/pgError";
export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message = "Something went wrong";
  const { code, table, constraint } = pgError(err);
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
 if (code === PgCode.UNIQUE_VIOLATION) {
  const isVehicleUnique = table === "vehicle" || constraint === "uq_vehicle_user_plate";
   res.status(409).json({
    success: false,
    error: isVehicleUnique ? "Vehicle already exists for this user" : "Resource already exists",
  });
  return;
}
  res.status(statusCode).json({
    success: false,
    error: err.message || message,
    stack: err.stack,
  });
};
