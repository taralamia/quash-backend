import { Request, Response } from "express";
import { AuthService } from "../service/authService";
import { UserService } from "../service/userService";
import type { CreateUserInput, loginInput } from "../schemas/userSchema";
import { setRefreshCookie } from "../utils/cookies";
import { email } from "zod";
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  signUp = async (req: Request, res: Response): Promise<void> => {
    const result = await this.authService.signUp(req.body);
    res.status(201).json(result);
  };
  verifyEmail = async (req: Request, res: Response): Promise<void> => {
    const { email, code } = req.body;
    await this.authService.verifyEmail(email, code); // Just await, no return value
    res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  };
  signIn = async (
    req: Request<{}, {}, loginInput>,
    res: Response
  ): Promise<void> => {
    const { email, password } = req.body;
    const data = await this.authService.signIn(email, password);
    setRefreshCookie(res, data.refreshToken);
    res.status(200).json({
      success: true,
      accessToken: data.accessToken,
      user: data.user,
    });
  };
  refresh = async (req: Request, res: Response): Promise<void> => {
    const refreshToken = req.cookies?.rt as string;
    if (!refreshToken) {
      res
        .status(401)
        .json({ success: false, message: "Missing refresh token" });
    }
    const {
      accessToken,
      refreshToken: newRefreshToken,
      user,
    } = await this.authService.refresh(refreshToken); // soft rotation
    setRefreshCookie(res, newRefreshToken);
    res.status(200).json({ success: true, accessToken, user });
  };
}
