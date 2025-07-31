import dotenv from "dotenv";
import { envSchema } from "./schemas/envSchema";

dotenv.config(); // Load .env into process.env

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("Invalid environment variables!", parsedEnv.error.format()); //z.treeifyError(err)
  process.exit(1);
}

export const env = parsedEnv.data;
