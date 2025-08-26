import { z } from "zod";

// Define the schema
export const envSchema = z.object({
  DB_USER: z.string(),
  DB_HOST: z.string(),
  DB_NAME: z.string(),
  DB_PASSWORD: z.string(),
  DB_PORT: z.coerce.number(), // Converts string to number
  PORT: z.coerce.number().default(5000),
  POSTGRES_SYNC: z.enum(["true", "false"]),
  POSTGRES_LOGGING: z.enum(["true", "false"]),
  PGADMIN_DEFAULT_EMAIL: z.email(),
  PGADMIN_DEFAULT_PASSWORD: z.string(),
  EMAIL_USER: z.email(),
  EMAIL_PASSWORD: z.string(),
  EMAIL_FROM: z.email(),
  POSTGRES_SSL: z.string().optional().default("false"),
  JWT_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  JWT_ACCESS_TOKEN_EXPIRATION: z.string().default("15m"),
  JWT_REFRESH_TOKEN_EXPIRATION: z.string().default("7d"),
});
