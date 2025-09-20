import { Repository } from "typeorm";
import { Vehicle } from "../entity/Vehicle";
import { AppError } from "../utils/AppError";
import { IVehicleService } from "./interfaces/IVehicleService";
import { CreateVehicleInput, UpdateVehicleInput } from "../schemas/vehicleSchema";
export class VehicleService implements IVehicleService {
    constructor(private readonly repo: Repository<Vehicle>) {}
    
  async createVehicle(userId: string, data: CreateVehicleInput): Promise<Vehicle> {
    const entity = this.repo.create({
      userId,
      licensePlate: data.licensePlate,
      make: data.make,
      model: data.model,
      color: data.color,
    });
    return this.repo.save(entity);
  }
 async getVehicle(userId: string, vehicleId: string): Promise<Vehicle> {
    const vehicle = await this.repo.findOne({ where: { id: vehicleId, userId } });
    if (!vehicle) {
    throw new AppError("Vehicle not found", 404);
    }
    return vehicle;
  }   
  async updateVehicle(
    userId: string,
    vehicleId: string,
    patch: UpdateVehicleInput
  ): Promise<Vehicle> {
    const vehicle = await this.repo.findOne({ where: { id: vehicleId, userId } });
    if (!vehicle){ 
    throw new AppError("Vehicle not found", 404);
    }
    if (patch.licensePlate !== undefined) {
    vehicle.licensePlate = patch.licensePlate;
    }
    if (patch.make !== undefined) {
    vehicle.make = patch.make;
    }
    if (patch.model !== undefined) {
    vehicle.model = patch.model;
    }
    if (patch.color !== undefined) {
    vehicle.color = patch.color;
    }
    return this.repo.save(vehicle);
  }
 async deleteVehicle(userId: string, vehicleId: string): Promise<void> {
    const vehicle = await this.repo.findOne({ where: { id: vehicleId, userId } });
    if (!vehicle){
    throw new AppError("Vehicle not found", 404);
    }
    await this.repo.remove(vehicle);
  }  
   async listVehicles(userId: string): Promise<Vehicle[]> {
    return this.repo.find({ where: { userId }, order: { createdAt: "DESC" } });
  }
}