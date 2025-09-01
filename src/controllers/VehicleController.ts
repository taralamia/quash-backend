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

    res.status(201).json({ success: true, vehicle });
  };
  list = async (req: Request, res: Response, _next: NextFunction) => {
    const profile = req.user;
    if (!profile?.id) throw new AppError("Unauthorized", 401);

    const vehicles = await this.service.listVehicles?.(profile.id) ??
                     []; 
    res.status(200).json({ success: true, vehicles });
  };
   get = async (req: Request, res: Response, _next: NextFunction) => {
    const profile = req.user;
    if (!profile?.id) throw new AppError("Unauthorized", 401);

    const { id } = req.params;
    const vehicle = await this.service.getVehicle(profile.id, id);

    res.status(200).json({ success: true, vehicle });
  };
   update = async (req: Request, res: Response, _next: NextFunction) => {
    const profile = req.user;
    if (!profile?.id) throw new AppError("Unauthorized", 401);

    const { id } = req.params;
    const patch = updateVehicleSchema.parse(req.body);
    const vehicle = await this.service.updateVehicle(profile.id, id, patch);

    res.status(200).json({ success: true, vehicle });
  };
   remove = async (req: Request, res: Response, _next: NextFunction) => {
    const profile = req.user;
    if (!profile?.id) throw new AppError("Unauthorized", 401);

    const { id } = req.params;
    await this.service.deleteVehicle(profile.id, id);

    res.status(204).send();
  };
}