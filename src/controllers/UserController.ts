import { Request, Response } from "express";
import { UserService } from "../service/UserService";
import { AppError } from "../utils/AppError";
export class UserController {
  constructor(private readonly userService: UserService) {}

  createUser = async (req: Request, res: Response): Promise<void> => {
    const user = await this.userService.createUser(req.body);
    res
      .status(201)
      .setHeader("Location", `/api/v1/users/${user.id}`)
      .json({ success: true, user });
  };

  getUser = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const user = await this.userService.getUser(id);
    if (!user) throw new AppError("User not found", 404);
    res.status(200).json({ success: true, user });
  };

  updateUser = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const patch = req.body;

    const allowedFields = ["fullName", "phoneNumber"];
    const invalidFields = Object.keys(patch).filter(
      (field) => !allowedFields.includes(field)
    );
    if (invalidFields.length > 0) {
      throw new AppError(
        `Invalid fields: ${invalidFields.join(", ")}. Only fullName and phoneNumber are allowed.`,
        400
      );
    }

    const updatedUser = await this.userService.updateUser(id, patch);
    res.status(200).json({ success: true, user: updatedUser });
  };

  deleteUser = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    await this.userService.deleteUser(id);
    res.status(204).json({ success: true, message: "User deleted successfully" });
  };
}
