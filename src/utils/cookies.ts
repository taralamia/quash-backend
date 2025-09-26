import { Response } from "express";
export function setRefreshCookie(res: Response, token: string) {
  res.cookie("rt", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/api/v1/auth/refresh",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}
