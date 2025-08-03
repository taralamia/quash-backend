import { Repository } from "typeorm";
import { User } from "../../entity/User";
import { Vehicle } from "../../entity/Vehicle";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { MailService } from "../mailService";
import { AppError } from "../../utils/AppError";
import type { CreateUserInput } from "../../schemas/userSchema";
export class authService {
  constructor(
    private readonly userRepository: Repository<User>,
    private readonly mailService: MailService,
    private readonly vehicleRepository: Repository<Vehicle>
  ) {}

  generateVerificationCode() {
    return crypto.randomInt(100000, 999999).toString();
  }
  async findAll() {
    const users = await this.userRepository.find();
    return users;
  }
  async findOne(id: string) {
    const users = await this.userRepository.findOne({ where: { id } });
    return users;
  }

  async createUser(data: CreateUserInput) {
    const existing = await this.userRepository.findOne({
      where: { email: data.email },
    });
    if (existing) throw new AppError("Email already registered", 409);

    const verificationCode = this.generateVerificationCode();
    const verificationCodeExpires = Date.now() + 24 * 60 * 60 * 1000;

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);
    const user = new User();
    user.fullName = data.fullName;
    user.email = data.email;
    user.password = hashedPassword;
    user.phoneNumber = data.phoneNumber;
    user.verificationCode = verificationCode;
    user.verificationCodeExpires = verificationCodeExpires;

    const savedUser = await this.userRepository.save(user);
    if (data.vehicles?.length) {
      const vehiclesToSave = data.vehicles.map(v => {
        const vehicle = new Vehicle();
        vehicle.licensePlate = v.licensePlate;
        vehicle.make = v.make;
        vehicle.model = v.model;
        vehicle.color = v.color;
        vehicle.userId = savedUser.id;
        return vehicle;
      });
      await this.vehicleRepository.save(vehiclesToSave);
    }
    // Send verification email using MailService
    await this.mailService.sendVerificationEmail({
      email: data.email,
      code: verificationCode,
    });
    return savedUser;
  }
  async verifyEmail(data: { email: string; code: string }) {
    const existing = await this.userRepository.findOne({
      where: { email: data.email },
    });
    if (!existing) throw new AppError("User not found!", 404);
    if (
      existing.verificationCode !== data.code ||
      existing.verificationCodeExpires! < Date.now()
    ) {
      throw new AppError("Invalid or expired verification code!", 400);
    }
    existing.verificationCode = "";
    existing.verificationCodeExpires = undefined;
    await this.userRepository.save(existing);

    return { message: "Email verified successfully!" };
  }
  async updateUser(id: string, data: Partial<User>) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (user) {
      this.userRepository.merge(user, data);
      await this.userRepository.save(user);
      return user;
    } else {
      return { message: "User not found" };
    }
  }

  async delete(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (user) {
      await this.userRepository.remove(user);
      return { message: "User Deleted successfully" };
    } else {
      return { message: "User not found" };
    }
  }
}
