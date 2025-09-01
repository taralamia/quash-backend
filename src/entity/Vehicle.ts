import { Entity, PrimaryGeneratedColumn, Column, Index, CreateDateColumn, UpdateDateColumn } from "typeorm";
<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
@Entity({ name: "vehicle" })
@Index(["userId", "licensePlate"], { unique: true })
export class Vehicle {
  @PrimaryGeneratedColumn("uuid")
<<<<<<< Updated upstream
  id!: string;
=======
  id!: string; // FIXED
>>>>>>> Stashed changes

  @Column({ length: 64 })
  licensePlate!: string;

  @Column({ nullable: true, length: 64 })
  make?: string;

  @Column({ nullable: true, length: 64 })
  model?: string;

  @Column({ nullable: true, length: 32 })
  color?: string;

  @Column({ type: "uuid" })
<<<<<<< Updated upstream
  userId!: string; 
=======
  userId!: string; // explicit uuid
>>>>>>> Stashed changes

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
