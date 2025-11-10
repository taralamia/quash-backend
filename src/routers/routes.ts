import { Router } from "express";
import { authMiddleware } from "../middleware/users/AuthMiddleware";
const router = Router();
//Auth Routes
import authRouter from "./authRouter";
import userRouter from "./userRouter";
//Vehicle Routes
import vehicleRouter from "./vehicleRouter";
//Order Routes
import orderRouter from "./orderRouter";
//Mount routes
router.use("/api/v1/auth", authRouter);
router.use("/api/v1/users", userRouter);
router.use("/api/v1/vehicle",authMiddleware,vehicleRouter);
router.use("/api/v1/orders",authMiddleware,orderRouter);
export default router;
