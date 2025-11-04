import { Request, Response, NextFunction } from "express";
import { validate as isUUID } from "uuid";
export const validateUUIDParam = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  if (!isUUID(id)) {
    res.status(400).json({ error: "Invalid UUID format" });
  }
(req as unknown as { validatedId?: string }).validatedId = id;
  next();
};
