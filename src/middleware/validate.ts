import { ZodType, ZodError } from "zod";
import { Request, Response, NextFunction, RequestHandler } from "express";
export const validate =
  (
    schema: ZodType<any, any>,
    property: "body" | "query" | "params" = "body"
  ): RequestHandler =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      const result = schema.parse(req[property]);
      req[property] = result;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        res.status(400).json({
          message: "Validation failed",
          errors: err.issues,
        });
        return;
      }
      next(err);
    }
  };
