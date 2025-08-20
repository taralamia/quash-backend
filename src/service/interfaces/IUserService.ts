import {
  SafeUser,
  UpdateUserPatch,
} from "../../types/interfaces/entity-helper";
import { CreateUserInput } from "../../schemas/userSchema";
export interface IUserService {
  createUser(data: CreateUserInput): Promise<SafeUser>;
  getUser(id: string): Promise<SafeUser>;
  updateUser(id: string, patch: UpdateUserPatch): Promise<SafeUser>;
  deleteUser(id: string): Promise<void>;
}
