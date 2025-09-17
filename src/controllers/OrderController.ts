import { Request, Response, NextFunction } from "express";
import { createOrderSchema } from "../schemas/orderSchema";
import { OrderService } from "../service/OrderService";
import { AppError } from "../utils/AppError";
import { sendNegotiated } from "../presentation/http/negotiation";
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  // POST /orders (user creates for self)
  createForUser = async (req: Request, res: Response, _next: NextFunction) => {
    const profile = req.user;
    const parsed = createOrderSchema.parse(req.body);
    if (!profile?.id) throw new AppError("Unauthorized", 401);
    const actorId = profile.id;
    const customerUserId = actorId;
    const created = await this.orderService.createForUser(
      customerUserId,
      actorId,
      parsed
    );
    res.status(201);
    res.setHeader("Location", `/api/v1/orders/${created.id}`);
    sendNegotiated(req, res, { success: true, order: created }, "Order Created");
  };
}
