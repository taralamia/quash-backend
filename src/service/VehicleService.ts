import { Repository } from "typeorm";
import { Vehicle } from "../entity/Vehicle";
import { AppError } from "../utils/AppError";
import { IVehicleService } from "./interfaces/IVehicleService";
import { CreateVehicleInput, UpdateVehicleInput } from "../schemas/vehicleSchema";
const normalizePlate = (s: string) => s.trim().toUpperCase();
export class VehicleService implements IVehicleService {
    constructor(private readonly repo: Repository<Vehicle>) {}
    
  async createVehicle(userId: string, data: CreateVehicleInput): Promise<Vehicle> {
    const entity = this.repo.create({
      userId,
      licensePlate: normalizePlate(data.licensePlate),
      make: data.make?.trim(),
      model: data.model?.trim(),
      color: data.color?.trim(),
    });
  
    return this.repo.save(entity);
  }
 async getVehicle(userId: string, vehicleId: string): Promise<Vehicle> {
    const v = await this.repo.findOne({ where: { id: vehicleId, userId } });
    if (!v) throw new AppError("Vehicle not found", 404);
    return v;
  }   
  async updateVehicle(
    userId: string,
    vehicleId: string,
    patch: UpdateVehicleInput
  ): Promise<Vehicle> {
    const v = await this.repo.findOne({ where: { id: vehicleId, userId } });
    if (!v) throw new AppError("Vehicle not found", 404);

    if (patch.licensePlate !== undefined) v.licensePlate = normalizePlate(patch.licensePlate);
    if (patch.make !== undefined) v.make = patch.make?.trim();
    if (patch.model !== undefined) v.model = patch.model?.trim();
    if (patch.color !== undefined) v.color = patch.color?.trim();
    return this.repo.save(v);
  }
 async deleteVehicle(userId: string, vehicleId: string): Promise<void> {
    const v = await this.repo.findOne({ where: { id: vehicleId, userId } });
    if (!v) throw new AppError("Vehicle not found", 404);
    await this.repo.remove(v);
  }  
   async listVehicles(userId: string): Promise<Vehicle[]> {
    return this.repo.find({ where: { userId }, order: { createdAt: "DESC" } });
  }
}