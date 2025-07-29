import { Router } from "express";
import { AuthController } from "../../controllers/auth/authController";
import { validate } from "../../middleware/validate";
import { createUserSchema } from "../../schemas/userSchema";
import { AppDataSource } from "../../data-source";
import { authService } from "../../service/auth/authService";
import { MailService } from "../../service/mailService";
import { User } from "../../entity/User";

const authRouter = Router();

// Inject dependencies
const mailService = new MailService();
const userRepo = AppDataSource.getRepository(User);
const userServiceInstance = new authService(userRepo, mailService);
const authController = new AuthController(userServiceInstance);

const asyncHandler = (fn: Function) => (req: any, res: any, next: any) =>
  Promise.resolve(fn(req, res, next)).catch(next);

//authRouter.get("/", asyncHandler(authController.createUser.bind(authController)));
authRouter.post(
  "/create",
  validate(createUserSchema),
  asyncHandler(authController.createUser.bind(authController))
);
authRouter.post(
  "/verify-email",
  asyncHandler(authController.verifyEmail.bind(authController))
);
authRouter.get("/:id", asyncHandler(authController.findOne.bind(authController)));
authRouter.put("/:id", asyncHandler(authController.updateUser.bind(authController)));
authRouter.delete("/:id", asyncHandler(authController.deleteUser.bind(authController)));

export default authRouter;
