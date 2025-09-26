import { Request, Response } from "express";
import { AuthService } from "../service/AuthService";
import type { loginInput } from "../schemas/userSchema";
import { setRefreshCookie } from "../utils/cookies";
import { setNoCache } from "../presentation/http/header";
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  signUp = async (req: Request, res: Response): Promise<void> => {
    const result = await this.authService.signUp(req.body);
    res.status(201);
    res.setHeader("Location", `/api/v1/users/${result.user.id}`);
    res.locals.payload = result;
    res.locals.htmlTitle = "User Created";
  };
  verifyEmail = async (req: Request, res: Response): Promise<void> => {
    const { email, code } = req.body;
    await this.authService.verifyEmail(email, code); // Just await, no return value
    res.locals.payload = {
       success: true,
      message: "Email verified successfully"
    };
    res.locals.htmlTitle = "Email Verified";
  };
  signIn = async (
    req: Request<{}, {}, loginInput>,
    res: Response
  ): Promise<void> => {
    const { email, password } = req.body;
    const data = await this.authService.signIn(email, password);
    setRefreshCookie(res, data.refreshToken);
    res.locals.payload={
      success: true,
      accessToken: data.accessToken,
      user: data.user,
    }
    res.locals.supportedTypes = ["application/json"];
  };
  refresh = async (req: Request, res: Response): Promise<void> => {
    const refreshToken = req.cookies?.rt as string;
    if (!refreshToken) {
      res
        .status(401);
        setNoCache(res);
        res.locals.payload = { success: false, message: "Missing refresh token" };
        res.locals.supportedTypes = ["application/json"];
        return;
    }
    const {
      accessToken,
      refreshToken: newRefreshToken,
      user,
    } = await this.authService.refresh(refreshToken); // soft rotation
    setRefreshCookie(res, newRefreshToken);
    res.status(200);
    setNoCache(res);
    res.locals.payload = { success: true, accessToken, user };
    res.locals.supportedTypes = ["application/json"];
  };
}
