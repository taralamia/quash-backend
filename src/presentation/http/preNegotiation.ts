import { Request, Response, NextFunction } from "express";
import { negotiate, SUPPORTED_TYPES } from "./negotiation";
interface ResponseLocals {
  negotiatedType?: string;
}
export function preNegotiationMiddleware(supportedTypes = SUPPORTED_TYPES) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const chosen = negotiate(req, res, supportedTypes);
    if (!chosen) {
      res.status(406).json({
        success: false,
        error: `Not acceptable. Supported: ${supportedTypes.join(", ")}`,
      });
      return;
    }
    (res.locals as ResponseLocals).negotiatedType = chosen;
    next();
  };
}