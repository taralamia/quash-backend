import {  Response, RequestHandler } from "express";
/** For auth/token endpoints: prevent storing sensitive responses */
export function setNoCache(res: Response): Response {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0"); 
  return res;
}
export const noStore: RequestHandler = (_req, res, next) => {
  setNoCache(res);
  next();
};
