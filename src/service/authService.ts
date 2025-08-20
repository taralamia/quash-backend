import { Repository } from "typeorm";
import { User } from "../entity/User";
import { IAuthService } from "./interfaces/IAuthService";
import { MailService } from "./MailService";
import { TokenService } from "./TokenService";
import { UserService } from "./UserService";
import { SafeUser } from "../types/interfaces/entity-helper";
import type { CreateUserInput } from "../schemas/userSchema";
import { toSafe } from "../utils/authHelper";
import { AppError } from "../utils/AppError";
import bcrypt from "bcrypt";
import crypto from "crypto";
export class AuthService implements IAuthService {
  constructor(
    private readonly users: Repository<User>,
    private readonly mailService: MailService,
    private readonly userService: UserService,
    private readonly tokenService: TokenService
  ) {}

  generateVerificationCode(): string {
    return crypto.randomInt(100000, 999999).toString();
  }
  async signUp(input: CreateUserInput): Promise<{ user: SafeUser }> {
    {
      //1. Check existing user
      const existingUser = await this.users.findOne({
        where: { email: input.email },
      });
      if (existingUser) {
        throw new AppError("User with this email already exists");
      }
      //2. Create via userService
      const safeUser = await this.userService.createUser(input);
      //3. Update verification field without fetching password
      await this.users.update(safeUser.id, {
        verificationCode: this.generateVerificationCode(),
        verificationCodeExpires: Date.now() + 24 * 60 * 60 * 1000,
      });
      //4. Get the verification code
      const { verificationCode } = (await this.users.findOne({
        where: { id: safeUser.id },
        select: ["verificationCode"],
      })) as { verificationCode: string };
      //5. send the email
      await this.mailService.sendVerificationEmail({
        email: input.email,
        code: verificationCode,
      });
      return {
        user: safeUser,
      };
    }
  }
  async verifyEmail(email: string, code: string): Promise<void> {
    //1. Find user with necessary fields
    const user = await this.users.findOne({
      where: { email },
      select: ["verificationCode", "verificationCodeExpires", "isVerified"],
    });
    //2. Validate user exists
    if (!user) {
      throw new AppError("User not found", 404);
    }
    //3. If already verified
    if (user.isVerified) {
      throw new AppError("Email already verified", 400);
    }
    //4. Invalid verification code
    if (user.verificationCode !== code) {
      throw new AppError("Invalid verification code", 400);
    }
    //5. Check if Verification code expires
    if (
      user.verificationCodeExpires &&
      user.verificationCodeExpires < Date.now()
    ) {
      throw new AppError("Verification code expired", 400);
    }
    //6. Mark the user as verified and clear verification fields
    await this.users.update(user.id, {
      isVerified: true,
      verificationCode: "",
      verificationCodeExpires: undefined,
    });
  }
  async signIn(
    email: string,
    password: string
  ): Promise<{ user: SafeUser; accessToken: string; refreshToken: string }> {
    //1. Find User by Email
    const user = await this.users.findOne({
      where: { email: email.toLowerCase().trim() },
    });
    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }
    //2. Verify Email
    if (!user.isVerified) {
      throw new AppError("Please verify your email first", 403);
    }
    //3. Verify Password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new AppError("Invalid email or password", 401);
    }
    //4. Generate Token
    const accessToken = this.tokenService.signAccess({ id: user.id });
    const refreshToken = this.tokenService.signRefresh({ id: user.id });
    return {
      user: toSafe(user),
      accessToken,
      refreshToken,
    };
  }
  async refresh(
    refreshToken: string
  ): Promise<{ user: SafeUser; accessToken: string; refreshToken: string }> {
    if (!refreshToken) throw new AppError("No Refresh Token Provided", 401);
    let payload: { id: string };
    try {
      payload = this.tokenService.verifyRefresh<{ id: string }>(refreshToken);
    } catch {
      throw new AppError("Invalid or expired refresh token", 401);
    }
    const user = await this.users.findOne({ where: { id: payload.id } });
    if (!user) throw new AppError("User not found", 404);
    const accessToken = this.tokenService.signAccess({ id: user.id }, "15m");
    const newRefreshToken = this.tokenService.signRefresh(
      { id: user.id },
      "7d"
    );
    const safeUser: SafeUser = toSafe(user);
    return { accessToken, refreshToken: newRefreshToken, user: safeUser };
  }
}
