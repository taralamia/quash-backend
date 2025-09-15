// src/entity/Order.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from "typeorm";
@Entity({ name: "orders" })
@Index("idx_orders_user", ["userId"])
@Index("idx_orders_vehicle", ["vehicleId"])
@Index("idx_orders_appointment", ["appointmentDate"])
@Unique("uq_orders_vehicle_appointment", ["vehicleId", "appointmentDate"])
export class Order {
  @PrimaryGeneratedColumn("uuid")
  id!: string;
  @Column({ type: "uuid" })
  userId!: string;
  @Column({ type: "uuid" })
  createdById!: string;
  @Column({ type: "uuid" })
  vehicleId?: string;
  @Column({ type: "varchar", length: 32 })
  serviceType!: string;
  @Column({ type: "timestamptz" })
  appointmentDate!: Date;
  @Column({ type: "varchar", length: 128 })
  contactInfo!: string;
  @Column({ type: "varchar", length: 16, default: "pending" })
  paymentStatus!: "pending" | "paid";
  @CreateDateColumn()
  createdAt!: Date;
  @UpdateDateColumn()
  updatedAt!: Date;
}
