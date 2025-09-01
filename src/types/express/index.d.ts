// src/types/express/index.d.ts
import type { SafeUser } from "../interfaces/entity-helper";
declare global {
  namespace Express {
    interface Request {
      user?: SafeUser;
      token?: string;
    }
  }
}
export {};
