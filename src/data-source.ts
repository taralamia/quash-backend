import "reflect-metadata";
import { DataSource } from "typeorm";
import "dotenv/config";
import path from "path";
import { User } from "./entity/User";
export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: !!process.env.POSTGRES_SYNC,
  logging: !!process.env.POSTGRES_LOGGING,
  entities: [User],
  migrations: [path.join(__dirname, "/migrations/*.js")],
  subscribers: [path.join(__dirname, "/subscriber/*.js")],
  ssl: !!process.env.POSTGRES_SSL,
});
