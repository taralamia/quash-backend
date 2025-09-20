import { Request, Response, NextFunction } from "express";
import type { IVehicleService } from "../service/interfaces/IVehicleService";
import { createVehicleSchema, updateVehicleSchema } from "../schemas/vehicleSchema";
import { AppError } from "../utils/AppError";
export class VehicleController {
    constructor(private readonly service: IVehicleService) {}
     create = async (req: Request, res: Response, _next: NextFunction) => {
    const profile = req.user; 
    if (!profile?.id) throw new AppError("Unauthorized", 401); 
    const data = createVehicleSchema.parse(req.body);
    const vehicle = await this.service.createVehicle(profile.id, data);
    res.status(201);
    res.setHeader("Location", `/api/v1/vehicle/${vehicle.id}`);
    res.locals.payload = { success: true, vehicle };
    res.locals.htmlTitle = "Vehicle Created";
  };
  list = async (req: Request, res: Response, _next: NextFunction) => {
    const profile = req.user;
    if (!profile?.id) throw new AppError("Unauthorized", 401);
    const vehicles = await this.service.listVehicles?.(profile.id) ??[]; 
    res.locals.payload = { success: true, vehicles };
    res.locals.htmlTitle = "Vehicle List";
  };
   get = async (req: Request, res: Response, _next: NextFunction) => {
    const profile = req.user;
    if (!profile?.id) throw new AppError("Unauthorized", 401);

    const { id } = req.params;
    const vehicle = await this.service.getVehicle(profile.id, id);
    if (!vehicle) throw new AppError("Vehicle not found", 404);
    res.locals.payload = { success: true, vehicle };
    res.locals.htmlTitle = "Vehicle Details";
  };
   update = async (req: Request, res: Response, _next: NextFunction) => {
    const profile = req.user;
    if (!profile?.id) throw new AppError("Unauthorized", 401);
    const { id } = req.params;
    const patch = updateVehicleSchema.parse(req.body);
    const vehicle = await this.service.updateVehicle(profile.id, id, patch);
    res.locals.payload = { success: true, vehicle };
    res.locals.htmlTitle = "Vehicle Updated";
  };
   remove = async (req: Request, res: Response, _next: NextFunction) => {
    const profile = req.user;
    if (!profile?.id) throw new AppError("Unauthorized", 401);
    const { id } = req.params;
    const deletedVehicle= await this.service.deleteVehicle(profile.id, id);
    res.locals.payload = { success: true, vehicle: deletedVehicle };
    res.locals.htmlTitle = "Vehicle Deleted";
  };
}