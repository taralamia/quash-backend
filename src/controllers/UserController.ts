import { Request, Response } from "express";
import { UserService } from "../service/UserService";
import { AppError } from "../utils/AppError";
export class UserController {
  constructor(private readonly userService: UserService) {}
  // Create user
  createUser = async (req: Request, res: Response): Promise<void> => {
    const user = await this.userService.createUser(req.body);
    res.status(201).json(user);
  };
  getUser = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const user = await this.userService.getUser(id);
    res.locals.payload = user;
    res.locals.htmlTitle = "User Details";
  };
  updateUser = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const patch = req.body;
    const allowedFields = ["fullName", "phoneNumber"];
    const invalidFields = Object.keys(patch).filter(
      field => !allowedFields.includes(field)
    );
    if (invalidFields.length > 0) {
      throw new AppError(
        `Invalid fields: ${invalidFields.join(", ")}. Only fullName and phoneNumber are allowed.`,
        400
      );
    }
    const updatedUser = await this.userService.updateUser(id, patch);
    res.locals.payload = updatedUser;
    res.locals.htmlTitle = "User Updated";
  };
  deleteUser = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    await this.userService.deleteUser(id);
    res.status(204).send(); // No content
  };
}
