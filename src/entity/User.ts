import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  OneToMany,
} from "typeorm";
import { Expose } from 'class-transformer';
import { Vehicle } from "./Vehicle";
@Entity("users")
@Unique(["email"])
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  fullName!: string;

  @Column()
  email!: string;

  @Column()
  password!: string;

  @Column()
  phoneNumber!: string;
  @Column({ nullable: true })
  verificationCode?: string;

  @Column({ type: "bigint", nullable: true })
  verificationCodeExpires?: number;
  @OneToMany(() => Vehicle, vehicle => vehicle.user, {
    cascade: true,
  })
   @Expose()
  vehicles!: Vehicle[];
}
