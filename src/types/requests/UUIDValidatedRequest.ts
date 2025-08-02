import { Request } from "express";

export interface UUIDValidatedRequest extends Request {
  validatedId: string;
}
