// src/types/interfaces/entity-helper.ts
import { User } from "../../entity/User";
import { Vehicle } from "../../entity/Vehicle";

export type SafeUser = Omit<
  User,
  "password" | "refreshToken" | "verificationCode" | "verificationCodeExpires"
>;

export type UpdateUserPatch = Partial<Pick<User, "fullName" | "phoneNumber">>;
