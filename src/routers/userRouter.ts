import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { UserService } from "../service/UserService";
import { User } from "../entity/User";
import { AppDataSource } from "../data-source";
import { Vehicle } from "../entity/Vehicle";
import asyncHandler from "../utils/asyncHandler";
const router = Router();
const userRepo = AppDataSource.getRepository(User);
const vehicleRepo = AppDataSource.getRepository(Vehicle);
const userService = new UserService(userRepo, vehicleRepo);
const userController = new UserController(userService);
//CRUD Routes
router.get("/:id", asyncHandler(userController.getUser));
router.patch("/:id", asyncHandler(userController.updateUser));
router.delete("/:id", asyncHandler(userController.deleteUser));
export default router;
