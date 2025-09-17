import { type Request, type Response, type NextFunction, type RequestHandler } from "express";
import { toHtml, toXml } from "./renderer";
export const SUPPORTED_TYPES = ["application/json", "application/xml", "text/html"] as const;
export type Supported = typeof SUPPORTED_TYPES[number];
export function negotiate(req: Request, res: Response, supported: readonly string[] = SUPPORTED_TYPES): Supported | null {
  const chosen = req.accepts(supported as unknown as string[]) as string | false;
  if (!chosen) return null;
  res.setHeader("Vary", "Accept");
  res.type(chosen);
  return chosen as Supported;
}
export function sendNegotiated(
  req: Request,
  res: Response,
  payload: unknown,
  htmlTitle = "Response",
  supported: readonly string[] = SUPPORTED_TYPES
) {
  const type = negotiate(req, res, supported);
  if (!type) {
    return res.status(406).json({
      success: false,
      error: `Not acceptable. Supported: ${supported.join(", ")}`,
    });
  }
  if (type === "application/json") return res.send(payload);
  if (type === "application/xml") return res.send(toXml(payload));
  return res.send(toHtml(payload, htmlTitle)); // text/html
}