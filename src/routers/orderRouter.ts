import { Router } from "express";
import asyncHandler from "../utils/asyncHandler";
import { authMiddleware } from "../middleware/users/AuthMiddleware";
import { AppDataSource } from "../data-source";
import { Order } from "../entity/Order";
import { Vehicle } from "../entity/Vehicle";
import { VehicleController } from "../controllers/VehicleController";
import { VehicleService } from "../service/VehicleService";
import { OrderController } from "../controllers/OrderController";
import { OrderService } from "../service/OrderService";
import { roleGuard } from "../middleware/users/roleGuard";
const orderRepo = AppDataSource.getRepository(Order);
const vehicleRepo = AppDataSource.getRepository(Vehicle);
const orderService = new OrderService(orderRepo, vehicleRepo);
const orderController = new OrderController(orderService);
const router = Router();
router.use(authMiddleware);
//USER creates order for self
router.post(
  "/orders",
  roleGuard("USER", "ADMIN"),
  asyncHandler(orderController.createForUser)
);
export default router;
