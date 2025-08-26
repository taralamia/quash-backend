import bcrypt from "bcrypt";
import { AppError } from "./AppError";
export const BcryptUtils = {
  hashPassword: async (
    password: string,
    saltRounds: number = 10
  ): Promise<string> => {
    try {
      if (!password) {
        throw new AppError("Password is required for hashing", 400);
      }
      return await bcrypt.hash(password, saltRounds);
    } catch (error) {
      console.error("Password hashing error:", error);
      throw new AppError("Password processing failed", 500);
    }
  },
  comparePassword: async (
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> => {
    try {
      if (!plainPassword || !hashedPassword) {
        throw new AppError("Both passwords are required for comparison", 400);
      }
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      console.error("Password comparison error:", error);
      throw new AppError("Authentication failed", 500);
    }
  },
  generateSalt: async (rounds: number = 10): Promise<string> => {
    return await bcrypt.genSalt(rounds);
  },
};
