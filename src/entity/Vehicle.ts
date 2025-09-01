import { Entity, PrimaryGeneratedColumn, Column, Index, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "vehicle" })
@Index(["userId", "licensePlate"], { unique: true })
export class Vehicle {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ length: 64 })
  licensePlate!: string;

  @Column({ nullable: true, length: 64 })
  make?: string;

  @Column({ nullable: true, length: 64 })
  model?: string;

  @Column({ nullable: true, length: 32 })
  color?: string;

  @Column({ type: "uuid" })
  userId!: string; 

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
