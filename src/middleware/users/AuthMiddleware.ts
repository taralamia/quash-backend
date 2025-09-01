// src/middleware/auth/authMiddleware.ts
import { RequestHandler } from "express";
import { verify } from "jsonwebtoken";
import { env } from "../../constants/envConfig";
import { userRepository } from "../../repository/userRepo";
import { AppError } from "../../utils/AppError";

const getBearer = (header?: string | null) =>
  header && header.toLowerCase().startsWith("bearer ") ? header.slice(7).trim() : undefined;

export const authMiddleware: RequestHandler = async (req, _res, next) => {
  const token = getBearer(req.get("authorization"));
  if (!token) throw new AppError("Authorization token missing", 401);
  const payload = verify(token, env.JWT_SECRET) as { id: string };
  const user = await userRepository.findOne({ where: { id: payload.id } });
  if (!user) throw new AppError("User not found", 404);
  const { password, verificationCode, verificationCodeExpires, ...rest } = user;
  req.user = rest;         
  req.token = token;

  next();
};
