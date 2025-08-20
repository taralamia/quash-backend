import { Repository } from "typeorm";
import { User } from "../entity/User";
import { Vehicle } from "../entity/Vehicle";
import { IUserService } from "./interfaces/IUserService";
import { SafeUser } from "../types/interfaces/entity-helper";
import bcrypt from "bcrypt";
import type { CreateUserInput } from "../schemas/userSchema";
import { toSafe } from "../utils/authHelper";
import { AppError } from "../utils/AppError";
export class UserService implements IUserService {
  constructor(
    private readonly users: Repository<User>,
    private readonly vehicles: Repository<Vehicle>
  ) {}
  async createUser(input: CreateUserInput): Promise<SafeUser> {
    const hashed = await bcrypt.hash(input.password, 10);
    const user = this.users.create({
      fullName: input.fullName,
      email: input.email.toLowerCase().trim(),
      password: hashed,
      phoneNumber: input.phoneNumber,
      isVerified: false,
    });
    const saved = await this.users.save(user);

    if (input.vehicles?.length) {
      const vs = input.vehicles.map(v =>
        this.vehicles.create({ ...v, userId: saved.id })
      );
      await this.vehicles.save(vs);
    }
    return toSafe(saved);
  }
  async getUser(id: string): Promise<SafeUser> {
    const user = await this.users.findOne({
      where: { id }, // Just find by ID, no relations
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return toSafe(user);
  }
  async updateUser(
    id: string,
    patch: Partial<Pick<User, "fullName" | "phoneNumber">>
  ): Promise<SafeUser> {
    const user = await this.users.findOne({ where: { id } });
    if (!user) throw new Error("User not found");
    Object.assign(user, patch);
    const updatedUser = await this.users.save(user);
    return toSafe(updatedUser);
  }
  async deleteUser(id: string): Promise<void> {
    const user = await this.users.findOne({ where: { id } });
    if (user) await this.users.remove(user);
  }
}
