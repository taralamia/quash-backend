import { Repository } from "typeorm";
import { User } from "../entity/User";
import { Vehicle } from "../entity/Vehicle";
import  bcrypt  from "bcrypt";
export class UserService {
  constructor(private readonly userRepository: Repository<User>) {}
  async findAll() {
    const users = await this.userRepository.find();
    return users;
  }
  async findOne(id: number) {
    const users = await this.userRepository.findOne({ where: { id } });
    return users;
  }

  async createUser(data: {
    fullName: string;
    email: string;
    password: string;
    phoneNumber: string;
    vehicles?: {
      licensePlate: string;
      make?: string;
      model?: string;
      color?: string;
    }[];
  }) {
    const existing = await this.userRepository.findOne({
      where: { email: data.email },
    });
    if (existing) throw new Error("Email already registered");

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);
    const user = new User();
    user.fullName = data.fullName;
    user.email = data.email;
    user.password = hashedPassword;
    user.phoneNumber = data.phoneNumber;

    if (data.vehicles?.length) {
      user.vehicles = data.vehicles.map(v => {
        const vehicle = new Vehicle();
        vehicle.licensePlate = v.licensePlate;
        vehicle.make = v.make;
        vehicle.model = v.model;
        vehicle.color = v.color;
        return vehicle;
      });
    }
    const savedUser = await this.userRepository.save(user);
    return savedUser;
  }

  async updateUser(id: number, data: Partial<User>) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (user) {
      this.userRepository.merge(user, data);
      await this.userRepository.save(user);
      return user;
    } else {
      return { message: "User not found" };
    }
  }

  async delete(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (user) {
      await this.userRepository.remove(user);
      return { message: "User Deleted successfully" };
    } else {
      return { message: "User not found" };
    }
  }
}
