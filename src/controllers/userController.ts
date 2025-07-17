import { Request, Response } from "express";
import { UserService } from "../service/userService";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
const userService = new UserService(AppDataSource.getRepository(User));

export class UserController {
  static async all(request: Request, response: Response) {
    const data = await userService.findAll();
    return response.status(200).send(data);
  }

  static async create(request: Request, response: Response) {
    const data = await userService.createUser(request.body);
    return response.status(201).send(data);
  }

  static async findOne(request: Request, response: Response) {
    const id = Number(request.params.id);
    const data = await userService.findOne(id);
    return response.send(data);
  }

  static async update(request: Request, response: Response) {
    const id = Number(request.params.id);
    const data = await userService.updateUser(id, request.body);
    return response.send(data);
  }

  static async delete(request: Request, response: Response) {
    const id = Number(request.params.id);
    const data = await userService.delete(id);
    return response.send(data);
  }
}
