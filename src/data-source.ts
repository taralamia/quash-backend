import "reflect-metadata";
import { DataSource } from "typeorm";
import "dotenv/config";
import path from "path";
import { User } from "./entity/User";
import { Vehicle } from "./entity/Vehicle";
import { env } from "./constants/envConfig";
export const AppDataSource = new DataSource({
  type: "postgres",
  host: env.DB_HOST,
  port: Number(env.DB_PORT),
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  logging: !!env.POSTGRES_LOGGING,
  entities: [User, Vehicle],
  synchronize: true,
  migrations: [path.join(__dirname, "/migrations/*.js")],
  subscribers: [path.join(__dirname, "/subscriber/*.js")],
  ssl: !!env.POSTGRES_SSL,
});
