import { Vehicle } from "../../entity/Vehicle";
import { CreateVehicleInput, UpdateVehicleInput } from "../../schemas/vehicleSchema";
export interface IVehicleService {
  createVehicle(userId: string, data: CreateVehicleInput): Promise<Vehicle>;
  getVehicle(userId: string, vehicleId: string): Promise<Vehicle>;
  updateVehicle(
    userId: string,
    vehicleId: string,
    patch: UpdateVehicleInput
  ): Promise<Vehicle>;
  deleteVehicle(userId: string, vehicleId: string): Promise<void>;
  listVehicles?(userId: string): Promise<Vehicle[]>;
}