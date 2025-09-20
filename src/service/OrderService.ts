import { Repository } from "typeorm";
import { Order } from "../entity/Order";
import { Vehicle } from "../entity/Vehicle";
import { AppError } from "../utils/AppError";
import { IOrderService } from "./interfaces/IOrderService";
import { CreateOrderInput } from "../schemas/orderSchema";
import { IVehicleService } from "./interfaces/IVehicleService";
export class OrderService implements IOrderService {
  constructor(
    private readonly orders: Repository<Order>,
    private readonly vehicleService: Repository<Vehicle>
  ) {}
  async createForUser(
    userId: string,
    createdById: string,
    data: CreateOrderInput
  ): Promise<Order> {
    if (!userId || !createdById) {
    throw new AppError("Unauthorized", 401);
    }
    if (!data.vehicleId){
    throw new AppError("vehicleId is required", 400);
    }
    if (data.appointmentDate.getTime() < Date.now()) {
      throw new AppError("appointmentDate must be in the future", 400);
    }
    const v = await this.vehicleService.findOne({
      where: { id: data.vehicleId, userId },
    });
    if (!v) throw new AppError("Vehicle not found", 404);
    const order = this.orders.create({
      userId,
      createdById,
      vehicleId: data.vehicleId,
      serviceType: data.serviceType,
      appointmentDate: data.appointmentDate,
      contactInfo: data.contactInfo,
      paymentStatus: "pending",
    });
    return this.orders.save(order);
  }
}
