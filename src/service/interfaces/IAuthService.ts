import { SafeUser } from "../../types/interfaces/entity-helper";
import type { CreateUserInput } from "../../schemas/userSchema";
export interface IAuthService {
  signUp(input: CreateUserInput): Promise<{ user: SafeUser }>;
  signIn(
    email: string,
    password: string
  ): Promise<{
    user: SafeUser;
    accessToken: string;
    refreshToken: string;
  }>;
  verifyEmail(email: string, code: string): Promise<void>;
  refresh(refreshToken: string): Promise<{
    user: SafeUser;
    accessToken: string;
    refreshToken: string; // soft-rotation
  }>;
}
