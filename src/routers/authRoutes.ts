import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { AuthService } from "../service/authService";
import { MailService } from "../service/mailService";
import { TokenService } from "../service/TokenService";
import { UserService } from "../service/userService";
import { User } from "../entity/User";
import { AppDataSource } from "../data-source";
import { Vehicle } from "../entity/Vehicle";

const router = Router();

const userRepo = AppDataSource.getRepository(User);
const vehicleRepo = AppDataSource.getRepository(Vehicle);
const mailService = new MailService();
const tokenService = new TokenService();
const userService = new UserService(userRepo, vehicleRepo);
const authService = new AuthService(
  userRepo,
  mailService,
  userService,
  tokenService
);
const authController = new AuthController(authService);
//Auth routes
router.post("/auth/signup", authController.signUp);
router.post("/auth/verify-email", authController.verifyEmail);
router.post("/auth/signin", authController.signIn);
router.post("/auth/refresh", authController.refresh);
export default router;
