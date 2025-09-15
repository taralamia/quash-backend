import { Router } from "express";
import asyncHandler from "../utils/asyncHandler";
import { authMiddleware } from "../middleware/users/AuthMiddleware";
import { AppDataSource } from "../data-source";
import { Vehicle } from "../entity/Vehicle";
import { VehicleService } from "../service/VehicleService";
import { VehicleController } from "../controllers/VehicleController";
const vehicleRepo = AppDataSource.getRepository(Vehicle);
const vehicleService = new VehicleService(vehicleRepo);
const vehicleController = new VehicleController(vehicleService);
const router = Router();
router.use(authMiddleware);
//vehicle routes
router.post("/vehicle/create", asyncHandler(vehicleController.create));
router.get("/vehicle/list", asyncHandler(vehicleController.list));
router.get("/vehicle/:id", asyncHandler(vehicleController.get));
router.patch("/vehicle/:id", asyncHandler(vehicleController.update));
router.delete("/vehicle/:id", asyncHandler(vehicleController.remove));
export default router;
