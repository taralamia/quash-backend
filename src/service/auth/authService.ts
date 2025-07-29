import { Repository } from "typeorm";
import { User } from "../../entity/User";
import { Vehicle } from "../../entity/Vehicle";
import  bcrypt  from "bcrypt";
import crypto from "crypto";
import { MailService } from "../mailService";
export class authService {
  constructor(
    private readonly userRepository: Repository<User>,
    private readonly mailService: MailService
  ) {}
  private validateId(id: number): void {
    if (isNaN(id)) {
      throw new Error(`Invalid ID: ${id}. Must be a valid number`);
    }
  }
    generateVerificationCode()
  {
    return crypto.randomInt(100000, 999999).toString();
  }
  async findAll() {
    const users = await this.userRepository.find();
    return users;
  }
  async findOne(id: number) {
     this.validateId(id);
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


    if (data.vehicles?.length) {
      user.vehicles = data.vehicles.map(v => {
        const vehicle = new Vehicle();
        vehicle.licensePlate = v.licensePlate;
        vehicle.make = v.make;
        vehicle.model = v.model;
        vehicle.color = v.color;
        vehicle.user = user;
        return vehicle;
      });
    }
    const savedUser = await this.userRepository.save(user);
    // Send verification email using MailService
    await this.mailService.sendVerificationEmail({
      email: data.email,
      code: verificationCode
    });
   const { password, verificationCode: _, verificationCodeExpires: __, ...safeUser } = savedUser;
   return {
    ...safeUser,
    vehicles: safeUser.vehicles?.map(({ user, ...rest }) => rest)
  };
    
  }
  async verifyEmail(data:{
    email: string,
    code: string
  })
  {
     const existing = await this.userRepository.findOne({
      where: { email: data.email },
    });
    if (!existing) throw new Error("User not found!");
    if (
    existing.verificationCode !== data.code ||
    existing.verificationCodeExpires! < Date.now()
  ) {
    throw new Error("Invalid or expired verification code!");
  }
  existing.verificationCode = "";
  existing.verificationCodeExpires = undefined;
  await this.userRepository.save(existing);

  return { message: "Email verified successfully!" };

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
