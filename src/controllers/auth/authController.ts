import { Request, Response } from "express";
import { authService } from "../../service/auth/authService";
import { UUIDValidatedRequest } from "../../types/requests/UUIDValidatedRequest";
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
  findOne = async (req: UUIDValidatedRequest, res: Response) => {
    const id = req.validatedId;
    const user = await this.userService.findOne(id);
    return res.status(200).json(user);
  };
  // Update a user
  updateUser = async (req: UUIDValidatedRequest, res: Response) => {
    const id = req.validatedId;
    const updated = await this.userService.updateUser(id, req.body);
    return res.status(200).json(updated);
  };
  // Delete a user
  deleteUser = async (req: UUIDValidatedRequest, res: Response) => {
    const id = req.validatedId;
    const deleted = await this.userService.delete(id);
    return res.status(200).json(deleted);
  };
}
