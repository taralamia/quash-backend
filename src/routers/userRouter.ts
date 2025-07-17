import { Router } from "express";
import { UserController } from "../controllers/userController";
import { validate } from "../middleware/validate";
import { createUserSchema } from "../schemas/userSchema";
const userRouter = Router();

const asyncHandler = (fn: Function) => (req: any, res: any, next: any) =>
  Promise.resolve(fn(req, res, next)).catch(next);

userRouter.get("/", asyncHandler(UserController.all));
userRouter.post("/create",validate(createUserSchema),asyncHandler(UserController.create));
userRouter.get("/:id", asyncHandler(UserController.findOne));
userRouter.put("/:id", asyncHandler(UserController.update));
userRouter.delete("/:id", asyncHandler(UserController.delete));

export default userRouter;
