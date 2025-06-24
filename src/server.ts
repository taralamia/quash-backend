import express, { Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

import pool from "./config/db";

const connectToDB = async () => {
  try {
    await pool.connect();
  } catch (err) {
    console.log(err);
  }
};

connectToDB();
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/test", (_, res) => {
  res.status(200).json({
    success: true,
    message: "Hello from the setup file",
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running at ${process.env.PORT}`);
});
