import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
@Entity()
export class Vehicle {
  @PrimaryGeneratedColumn("uuid")
  id!: number;

  @Column()
  licensePlate!: string;

  @Column({ nullable: true })
  make?: string;

  @Column({ nullable: true })
  model?: string;

  @Column({ nullable: true })
  color?: string;
  @Column()
  userId!: string;
}
