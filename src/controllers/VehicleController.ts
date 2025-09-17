import { Request, Response, NextFunction } from "express";
import type { IVehicleService } from "../service/interfaces/IVehicleService";
import { createVehicleSchema, updateVehicleSchema } from "../schemas/vehicleSchema";
import { AppError } from "../utils/AppError";
import { sendNegotiated } from "../presentation/http/negotiation";
import { send } from "process";
export class VehicleController {
    constructor(private readonly service: IVehicleService) {}
     create = async (req: Request, res: Response, _next: NextFunction) => {
    const profile = req.user; 
    if (!profile?.id) throw new AppError("Unauthorized", 401); 
    const data = createVehicleSchema.parse(req.body);
    const vehicle = await this.service.createVehicle(profile.id, data);
    res.status(201);
    res.setHeader("Location", `/api/v1/vehicle/${vehicle.id}`);
    sendNegotiated(req, res, { success: true, vehicle }, "Vehicle Created");
  };
  list = async (req: Request, res: Response, _next: NextFunction) => {
    const profile = req.user;
    if (!profile?.id) throw new AppError("Unauthorized", 401);
    const vehicles = await this.service.listVehicles?.(profile.id) ??[]; 
    sendNegotiated(req, res, { success: true, vehicles }, "Vehicle List");                 
  };
   get = async (req: Request, res: Response, _next: NextFunction) => {
    const profile = req.user;
    if (!profile?.id) throw new AppError("Unauthorized", 401);

    const { id } = req.params;
    const vehicle = await this.service.getVehicle(profile.id, id);
    if (!vehicle) throw new AppError("Vehicle not found", 404);
    sendNegotiated(req, res, { success: true, vehicle }, "Vehicle Details");
  };
   update = async (req: Request, res: Response, _next: NextFunction) => {
    const profile = req.user;
    if (!profile?.id) throw new AppError("Unauthorized", 401);

    const { id } = req.params;
    const patch = updateVehicleSchema.parse(req.body);
    const vehicle = await this.service.updateVehicle(profile.id, id, patch);
    sendNegotiated(req, res, { success: true, vehicle }, "Vehicle Updated");
  };
   remove = async (req: Request, res: Response, _next: NextFunction) => {
    const profile = req.user;
    if (!profile?.id) throw new AppError("Unauthorized", 401);

    const { id } = req.params;
    const deletedVehicle= await this.service.deleteVehicle(profile.id, id);
    sendNegotiated(req, res, { success: true, vehicle: deletedVehicle }, "Vehicle Deleted");
  };
}