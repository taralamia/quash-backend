import { Entity, PrimaryGeneratedColumn, Column, Unique } from "typeorm";
const bigintNumber = {
  to: (value?: number | null) => (value == null ? null : value.toString()),
  from: (value?: string | null) => (value == null ? null : parseInt(value, 10)),
};
export type UserRole = "USER" | "ADMIN";
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
  @Column({ type: "varchar", nullable: true })
  verificationCode?: string | null;
  @Column({
    type: "bigint",
    nullable: true,
    transformer: bigintNumber,
    select: false,
  })
  verificationCodeExpires?: number | null;
  @Column({ default: false })
  isVerified!: boolean;
  @Column({ type: "text", default: "USER" })
  role!: UserRole;
}
