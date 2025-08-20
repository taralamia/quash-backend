import { ITokenService } from "./interfaces/ITokenService";
import { sign, SignOptions, verify } from "jsonwebtoken";
import { env } from "../constants/envConfig";
const baseOpts: SignOptions = { algorithm: "HS256" };

export class TokenService implements ITokenService {
  signAccess(payload: { id: string }, exp = "15m"): string {
    return sign(payload, env.JWT_SECRET, { ...baseOpts, expiresIn: exp });
  }
  signRefresh(payload: { id: string }, exp = "7d"): string {
    return sign(payload, env.JWT_REFRESH_SECRET, {
      ...baseOpts,
      expiresIn: exp,
    });
  }
  verifyRefresh<T = { id: string }>(token: string): T {
    const secret = env.JWT_REFRESH_SECRET ?? env.JWT_SECRET;
    return verify(token, secret) as T;
  }
}
