import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

const db_url: string = process.env.DB_URL as string;
const port: string = process.env.PORT as string;

const connectToDatabase = async () => {
  try {
    await mongoose.connect(db_url);
    console.log("Connected to the db");
  } catch (err) {
    console.error("Failed to connect to the db", err);
  }
};

export { port, connectToDatabase };
