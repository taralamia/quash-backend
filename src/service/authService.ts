import { Repository } from "typeorm";
import { User } from "../entity/User";
import { IAuthService } from "./interfaces/IAuthService";
import { MailService } from "./mailService";
import { TokenService } from "./tokenService";
import { UserService } from "./userService";
import { SafeUser } from "../types/interfaces/entity-helper";
import type { CreateUserInput } from "../schemas/userSchema";
import { toSafe } from "../utils/authHelper";
import { AppError } from "../utils/AppError";
import { BcryptUtils } from "../utils/bcryptUtils";
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
    // 1. Check existing user
    const email = input.email.toLowerCase().trim();
    const existingUser = await this.users.findOne({
      where: { email: email },
    });

    if (existingUser) {
      throw new AppError("User with this email already exists");
    }

    // 2. Create via userService
    const safeUser = await this.userService.createUser({ ...input, email });

    // Generate Verification code
    const generatedVerificationCode = this.generateVerificationCode();
    const expiresAtMs = Date.now() + 20 * 60 * 1000;

    // 3. Update verification field without fetching password
    const { affected } = await this.users.update(safeUser.id, {
      verificationCode: generatedVerificationCode,
      verificationCodeExpires: expiresAtMs,
    });

    if (affected !== 1) {
      throw new AppError("Failed to set verification code", 500);
    }

    // 4. send the email
    await this.mailService.sendVerificationEmail({
      email,
      code: generatedVerificationCode,
    });

    return {
      user: safeUser,
    };
  }

  async verifyEmail(email: string, code: string): Promise<void> {
    // 1. Find user with necessary fields
    const userEmail = email.toLowerCase().trim();
    const user = await this.users.findOne({
      where: { email: userEmail },
      select: [
        "id",
        "verificationCode",
        "verificationCodeExpires",
        "isVerified",
      ],
    });
    // 2. If user not found
    if (!user) {
      throw new AppError("User not found", 404);
    }
    // 3. If already verified
    if (user.isVerified) {
      throw new AppError("Email already verified", 400);
    }
    // 4. Check if Verification code expires
    if (
      !user.verificationCode ||
      user.verificationCodeExpires == null ||
      user.verificationCodeExpires <= Date.now()
    ) {
      throw new AppError("Invalid or expired verification code", 400);
    }
    // 5. compare the user provided code and database code
    if (user.verificationCode !== code) {
      throw new AppError("Invalid verification code", 400);
    }
    // 6. Mark the user as verified and clear verification fields
    const updateResult = await this.users.update(user.id, {
      isVerified: true,
      verificationCode: undefined,
      verificationCodeExpires: undefined,
    });
    // 7. Email verification failed
    if (updateResult.affected === 0) {
      throw new AppError("Failed to verify email", 500);
    }
  }
  async signIn(
    email: string,
    password: string
  ): Promise<{ user: SafeUser; accessToken: string; refreshToken: string }> {
    // 1. Find User by Email
    const user = await this.users.findOne({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }
    // 2. Verify Email
    if (!user.isVerified) {
      throw new AppError("Please verify your email first", 403);
    }
    // 3. Verify Password
    const passwordMatch = await BcryptUtils.comparePassword(
      password,
      user.password
    );
    if (!passwordMatch) {
      throw new AppError("Invalid email or password", 401);
    }
    // 4. Generate Token
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
  
  const payload = this.tokenService.verifyRefresh<{ id: string }>(refreshToken);
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
