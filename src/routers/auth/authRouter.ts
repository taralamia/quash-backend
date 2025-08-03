import { Router } from "express";
import { AuthController } from "../../controllers/auth/authController";
import { validate } from "../../middleware/validate";
import { createUserSchema } from "../../schemas/userSchema";
import { AppDataSource } from "../../data-source";
import { authService } from "../../service/auth/authService";
import { MailService } from "../../service/mailService";
import { User } from "../../entity/User";
import { Vehicle } from "../../entity/Vehicle";
import { validateUUIDParam } from "../../middleware/users/validateUUIDParam";
const authRouter = Router();

// Inject dependencies
const mailService = new MailService();
const userRepo = AppDataSource.getRepository(User);
const vehicleRepo = AppDataSource.getRepository(Vehicle);
const userServiceInstance = new authService(userRepo, mailService, vehicleRepo);
const authController = new AuthController(userServiceInstance);

import { Request, Response, NextFunction, RequestHandler } from "express";

const asyncHandler =
  (
    fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
  ): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

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
authRouter.get(
  "/:id",
  validateUUIDParam,
  asyncHandler(authController.findOne.bind(authController))
);
authRouter.put(
  "/:id",
  asyncHandler(authController.updateUser.bind(authController))
);
authRouter.delete(
  "/:id",
  asyncHandler(authController.deleteUser.bind(authController))
);

export default authRouter;
