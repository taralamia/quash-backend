import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  OneToMany,
} from "typeorm";
import { Vehicle } from "./Vehicle";
@Entity()
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

  @OneToMany(() => Vehicle, vehicle => vehicle.user, {
    cascade: true,
  })
  vehicles!: Vehicle[];
}
