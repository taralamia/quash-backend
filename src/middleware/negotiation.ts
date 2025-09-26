import { Request, Response, NextFunction } from "express";
import { SUPPORTED_TYPES,sendNegotiated } from "../presentation/http/negotiation";
export type NegotiationLocals = {
  payload?: unknown;
  supportedTypes?: ReadonlyArray<string>;
  htmlTitle?: string;
};
export function negotiationMiddleware(
  req: Request,
  res: Response<unknown, NegotiationLocals>,
  next: NextFunction
): void {
  if (res.headersSent) return next();
  if (res.locals.payload === undefined) return next();
  const supported = res.locals.supportedTypes?.length ? res.locals.supportedTypes : SUPPORTED_TYPES;
  const title = res.locals.htmlTitle ?? "Response";
  sendNegotiated(req, res, res.locals.payload, title, supported);
}