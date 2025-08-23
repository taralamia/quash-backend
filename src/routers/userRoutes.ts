import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { UserService } from "../service/UserService";
import { AuthService } from "../service/AuthService";
import { User } from "../entity/User";
import { AppDataSource } from "../data-source";
import { Vehicle } from "../entity/Vehicle";
const router = Router();
const userRepo = AppDataSource.getRepository(User);
const vehicleRepo = AppDataSource.getRepository(Vehicle);
const userService = new UserService(userRepo, vehicleRepo);
const userController = new UserController(userService);
//CRUD Routes
router.post("/create-user", userController.createUser);
router.get("/users/:id", userController.getUser);
router.patch("/users/:id", userController.updateUser);
router.delete("/users/:id", userController.deleteUser);
export default router;
