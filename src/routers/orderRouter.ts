import { Router } from "express";
import { AppDataSource } from "../data-source";
import { Order } from "../entity/Order";
import { Vehicle } from "../entity/Vehicle";
import { OrderController } from "../controllers/OrderController";
import { OrderService } from "../service/OrderService";
import { roleGuard } from "../middleware/users/roleGuard";
import { requireJsonBody } from "../middleware/requireJsonBody";
const orderRepo = AppDataSource.getRepository(Order);
const vehicleRepo = AppDataSource.getRepository(Vehicle);
const orderService = new OrderService(orderRepo, vehicleRepo);
const orderController = new OrderController(orderService);
const router = Router();
router.use(requireJsonBody())
//USER creates order for self
router.post(
  "/",
  roleGuard("USER", "ADMIN"),
  orderController.createForUser
);
export default router;
