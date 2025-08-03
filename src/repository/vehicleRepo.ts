import { AppDataSource } from "../data-source";
import { Vehicle } from "../entity/Vehicle";

export const vehicleRepository = AppDataSource.getRepository(Vehicle);
