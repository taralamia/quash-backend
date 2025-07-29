import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { authService } from "../service/auth/authService";

export const userRepository = AppDataSource.getRepository(User);
