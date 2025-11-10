import { Router } from "express";
import asyncHandler from "../utils/asyncHandler";
import { AppDataSource } from "../data-source";
import { Vehicle } from "../entity/Vehicle";
import { VehicleService } from "../service/VehicleService";
import { VehicleController } from "../controllers/VehicleController";
import { requireJsonBody } from "../middleware/requireJsonBody";
import { validateUUIDParam } from "../middleware/users/validateUUIDParam";
const vehicleRepo = AppDataSource.getRepository(Vehicle);
const vehicleService = new VehicleService(vehicleRepo);
const vehicleController = new VehicleController(vehicleService);
const router = Router();
//vehicle routes
router.post("/create", requireJsonBody(), vehicleController.create);
router.get("/list",vehicleController.list);
router.get("/:id",validateUUIDParam,vehicleController.get);
router.patch("/:id",validateUUIDParam,vehicleController.update);
router.delete("/:id",validateUUIDParam,vehicleController.remove);
export default router;
