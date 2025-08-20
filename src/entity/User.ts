import { Entity, PrimaryGeneratedColumn, Column, Unique } from "typeorm";
@Entity("users")
@Unique(["email"])
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;
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
  @Column({ default: false })
  isVerified!: boolean;
}
