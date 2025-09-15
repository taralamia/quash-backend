// src/middleware/roleGuard.ts
import { RequestHandler } from "express";
import { AppError } from "../../utils/AppError";
export const roleGuard = (
  ...allowed: Array<"USER" | "ADMIN">
): RequestHandler => {
  return (req, _res, next) => {
    if (!req.user) {
      return next(new AppError("Unauthorized", 401));
    }
    const role = req.user.role as "USER" | "ADMIN" | undefined;
    if (!role || !allowed.includes(role)) {
      return next(new AppError("Forbidden: insufficient role", 403));
    }
    next();
  };
};
