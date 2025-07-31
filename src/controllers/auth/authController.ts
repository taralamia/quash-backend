import { Request, Response } from "express";
import { authService } from "../../service/auth/authService";
import { AppDataSource } from "../../data-source";
import { User } from "../../entity/User";
import { MailService } from "../../service/mailService";

export class AuthController {
  constructor(private readonly userService: authService) {}

  // Create a new user
  createUser = async (req: Request, res: Response) => {
    const data = await this.userService.createUser(req.body);
    return res.status(201).json(data);
  };
  verifyEmail = async (req: Request, res: Response) => {
    const result = await this.userService.verifyEmail(req.body);
    return res.status(200).json(result);
  };
  // Get a user by ID
  findOne = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID parameter" });
    }

    const user = await this.userService.findOne(id);
    return res.status(200).json(user);
  };

  // Update a user
  updateUser = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID parameter" });
    }

    const updated = await this.userService.updateUser(id, req.body);
    return res.status(200).json(updated);
  };

  // Delete a user
  deleteUser = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID parameter" });
    }
    const deleted = await this.userService.delete(id);
    return res.status(200).json(deleted);
  };
}
