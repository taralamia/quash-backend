import { Order } from "../../entity/Order";
import { CreateOrderInput } from "../../schemas/orderSchema";
export interface IOrderService {
  createForUser(
    userId: string,
    createdById: string,
    data: CreateOrderInput
  ): Promise<Order>;
}
