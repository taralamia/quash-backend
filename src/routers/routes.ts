import { Router } from "express";
const router = Router();
//Auth Routes
import authRouter from "./authRoutes";
import userRouter from "./userRoutes";
//Mount routes
router.use("/api/v1", authRouter);
router.use("/api/v1", userRouter);
export default router;
