import { Router } from "express";
const router = Router();
//Auth Routes
import authRouter from "./authRoutes";
import userRouter from "./userRoutes";
//Vehicle Routes
import vehicleRouter from "./vehicleRouter";
//Order Routes
import orderRouter from "./orderRouter";
//Mount routes
router.use("/api/v1", authRouter);
router.use("/api/v1", userRouter);
router.use("/api/v1", vehicleRouter);
router.use("/api/v1", orderRouter);
export default router;
