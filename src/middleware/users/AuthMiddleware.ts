import { RequestHandler } from "express";
import { verify } from "jsonwebtoken";
import { env } from "../../constants/envConfig";
import { userRepository } from "../../repository/userRepo";
import { AppError } from "../../utils/AppError";
import { validate as isUUID } from "uuid";

const getBearer = (header?: string | null) =>
  header && header.toLowerCase().startsWith("bearer ")
    ? header.slice(7).trim()
    : undefined;

export const authMiddleware: RequestHandler = async (req, _res, next) => {
  try {
    const token = getBearer(req.get("authorization"));
    if (!token) {
      console.log("-> no bearer token found");
      throw new AppError("Authorization token missing", 401);
    }

    let payload: any;
    try {
      payload = verify(token, env.JWT_SECRET) as { id: string };
    } catch (err) {
      console.log("-> token verify failed:", err && (err as Error).message);
      throw new AppError("Invalid token", 401);
    }
    if (!payload?.id || typeof payload.id !== "string" || !isUUID(payload.id)) {
      throw new AppError("Invalid token payload (bad id)", 401);
    }
    const user = await userRepository.findOne({ where: { id: payload.id } });
    if (!user) throw new AppError("User not found", 404);
    const { password, verificationCode, verificationCodeExpires, ...rest } = user;
    req.user = rest;
    req.token = token;
    return next();
  } catch (err) {
    return next(err);
  }
};
