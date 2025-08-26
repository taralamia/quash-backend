// src/utils/authHelpers.ts
import { User } from "../entity/User";
import { SafeUser } from "../types/interfaces/entity-helper";

export const toSafe = (user: User): SafeUser => {
  const { password, verificationCode, verificationCodeExpires, ...safeUser } =
    user;

  return safeUser;
};
