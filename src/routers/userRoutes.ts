import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { UserService } from "../service/UserService";
import { User } from "../entity/User";
import { AppDataSource } from "../data-source";
import { Vehicle } from "../entity/Vehicle";
import { negotiationMiddleware } from "../middleware/negotiation";
const router = Router();
const userRepo = AppDataSource.getRepository(User);
const vehicleRepo = AppDataSource.getRepository(Vehicle);
const userService = new UserService(userRepo, vehicleRepo);
const userController = new UserController(userService);
//CRUD Routes
router.get("/users/:id", userController.getUser);
router.patch("/users/:id", userController.updateUser);
router.delete("/users/:id", userController.deleteUser);
router.use(negotiationMiddleware);
export default router;
