import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { AuthService } from "../service/AuthService";
import { MailService } from "../service/mailService";
import { TokenService } from "../service/TokenService";
import { UserService } from "../service/UserService";
import { User } from "../entity/User";
import { AppDataSource } from "../data-source";
import { Vehicle } from "../entity/Vehicle";
import { requireJsonBody } from "../middleware/requireJsonBody";
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
router.post("/auth/signup",requireJsonBody(), authController.signUp);
router.post("/auth/verify-email", requireJsonBody(),authController.verifyEmail);
router.post("/auth/signin", requireJsonBody(),authController.signIn);
router.post("/auth/refresh", requireJsonBody(),authController.refresh);
export default router;
