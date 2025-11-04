import { Request, Response } from "express";
import { createOrderSchema } from "../schemas/orderSchema";
import { OrderService } from "../service/OrderService";
import { AppError } from "../utils/AppError";
import { sendNegotiated } from "../presentation/http/negotiation";
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  // POST /orders (user creates for self)
  createForUser = async (req: Request, res: Response): Promise<void> => {
    const profile = req.user;
    if (!profile?.id) throw new AppError("Unauthorized", 401);
    const parsed = createOrderSchema.parse(req.body);
    const actorId = profile.id;
    const customerUserId = actorId;
    const created = await this.orderService.createForUser(customerUserId, actorId, parsed);
    res.setHeader("Location", `/api/v1/orders/${created.id}`);
    res.status(201);
    await sendNegotiated(req, res, { success: true, order: created }, "Order Created");
  };
}
