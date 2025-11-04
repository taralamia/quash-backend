import { Request, Response } from "express";
import { AuthService } from "../service/AuthService";
import type { loginInput } from "../schemas/userSchema";
import { setRefreshCookie } from "../utils/cookies";
import { sendNegotiated } from "../presentation/http/negotiation";
import { setNoCache } from "../presentation/http/header";
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  signUp = async (req: Request, res: Response): Promise<void> => {
    const result = await this.authService.signUp(req.body);
     res.setHeader("Location", `/api/v1/users/${result.user.id}`);
     res.status(201);
     await sendNegotiated(req, res, result, "User Created");
  };

  verifyEmail = async (req: Request, res: Response): Promise<void> => {
    const { email, code } = req.body;
    await this.authService.verifyEmail(email, code);
    await sendNegotiated(req, res, { success: true, message: "Email verified successfully" }, "Email Verified");
  };
  signIn = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body as loginInput;
    const data = await this.authService.signIn(email, password);
    setRefreshCookie(res, data.refreshToken);
    res.status(200);
    await sendNegotiated(req, res, { success: true, accessToken: data.accessToken, user: data.user }, "Signed In");
  };

  refresh = async (req: Request, res: Response): Promise<void> => {
  const refreshToken = req.cookies?.rt as string;
  if (!refreshToken) {
    setNoCache(res);
    res.status(401);
    await sendNegotiated(req, res, { success: false, message: "Missing refresh token" }, "Missing refresh token");
    return;
  }
  const { accessToken, refreshToken: newRefreshToken, user } = await this.authService.refresh(refreshToken);
  setRefreshCookie(res, newRefreshToken);
  setNoCache(res);
  res.status(200);
  await sendNegotiated(req, res, { success: true, accessToken, user }, "Token Refreshed");
  }; 
}
