import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";
import { Exclude } from "class-transformer";
@Entity()
export class Vehicle {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  licensePlate!: string;

  @Column({ nullable: true })
  make?: string;

  @Column({ nullable: true })
  model?: string;

  @Column({ nullable: true })
  color?: string;

  @ManyToOne(() => User, user => user.vehicles, {
    onDelete: "CASCADE",
  })
  @Exclude()
  user!: User;
}
