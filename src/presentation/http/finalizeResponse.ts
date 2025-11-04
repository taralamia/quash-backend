import { Request, Response, NextFunction } from "express";
import { sendNegotiated, SUPPORTED_TYPES } from "./negotiation";
export function finalizeResponse() {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (res.headersSent) return next();
      const locals = res.locals as {
        payload?: unknown;
        supportedTypes?: readonly string[];
        htmlTitle?: string;
        negotiatedType?: string;
      };
      if (locals.payload === undefined) return next();
      const supported = locals.supportedTypes ?? SUPPORTED_TYPES;
      const title = locals.htmlTitle ?? "Response";
      console.log("Finalizing response, payload:", locals.payload);
      await sendNegotiated(req, res, locals.payload, title, supported);
      return;
    } catch (err) {
      return next(err);
    }
  };
}
