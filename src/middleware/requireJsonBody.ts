import {Request, Response, NextFunction,RequestHandler}  from 'express';
export function requireJsonBody(): RequestHandler {
   return (req: Request, res: Response, next: NextFunction):  void=> {
    const contentType = String(req.headers["content-type"] || "").toLowerCase();
    if (!contentType.startsWith("application/json")) {
      res.setHeader("Vary", "Accept");
       res.status(415).json({ success: false, error: "Send JSON: Content-Type: application/json" });
    }
    next();
  };
}
