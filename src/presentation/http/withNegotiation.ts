import type { Request, Response, NextFunction, RequestHandler } from "express";
import { sendNegotiated, SUPPORTED_TYPES } from "./negotiation";
export interface NegotiationLocals {
  payload?: unknown;
  supportedTypes?: readonly string[];
  htmlTitle?: string;
}
export type ResponseWithNegotiationLocals = Response & {
  locals: NegotiationLocals;
};
type MaybeNextHandler =
  (req: Request, res: ResponseWithNegotiationLocals, next?: NextFunction) =>
    Promise<unknown> | unknown | void;
export function withNegotiation(handler: MaybeNextHandler): RequestHandler {
  return async (req, res: ResponseWithNegotiationLocals, next) => {
    try {
      const result = await Promise.resolve(handler(req, res, next));
      if (res.headersSent) return;

      const supported = res.locals.supportedTypes ?? SUPPORTED_TYPES;
      const title = res.locals.htmlTitle ?? "Response";
      if (result !== undefined) {
        await sendNegotiated(req, res, result, title, supported);
        return;
      }
      if (res.locals.payload !== undefined) {
        await sendNegotiated(req, res, res.locals.payload, title, supported);
        return;
      }
      return next();
    } catch (err) {
      return next(err);
    }
  };
}
