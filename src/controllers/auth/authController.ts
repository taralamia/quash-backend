import { Request, Response } from "express";
import { authService } from "../../service/auth/authService";
import { AppDataSource } from "../../data-source";
import { User } from "../../entity/User";
import { MailService } from "../../service/mailService";

export class AuthController {
  constructor(private readonly userService: authService) {}

  // Create a new user
  createUser = async (req: Request, res: Response) => {
    try {
      const data = await this.userService.createUser(req.body);
      return res.status(201).json(data);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  };
  verifyEmail = async (req: Request, res: Response) => {
    try {
      const result = await this.userService.verifyEmail(req.body);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  };
  // Get a user by ID
  findOne = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID parameter" });
    }
    try {
      const user = await this.userService.findOne(id);
      return res.status(200).json(user);
    } catch (error: any) {
      return res.status(404).json({ error: error.message });
    }
  };

  // Update a user
  updateUser = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID parameter" });
    }
    try {
      const updated = await this.userService.updateUser(id, req.body);
      return res.status(200).json(updated);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  };

  // Delete a user
  deleteUser = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID parameter" });
    }
    try {
      const deleted = await this.userService.delete(id);
      return res.status(200).json(deleted);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  };
}
