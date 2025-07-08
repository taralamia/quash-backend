import { Router } from "express";
import { UserController } from "../controllers/userController";
const userRouter = Router();

const asyncHandler = (fn: Function) => (req: any, res: any, next: any) =>
  Promise.resolve(fn(req, res, next)).catch(next);

userRouter.get("/", asyncHandler(UserController.all));
userRouter.post("/", asyncHandler(UserController.create));
userRouter.get("/:id", asyncHandler(UserController.findOne));
userRouter.put("/:id", asyncHandler(UserController.update));
userRouter.delete("/:id", asyncHandler(UserController.delete));



export default userRouter;
