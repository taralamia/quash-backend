import express from "express";
import dotenv from "dotenv";
import { AppDataSource } from "./data-source";
import authRouter from "./routers/auth/authRouter";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use("/api/v1/users", authRouter);

app.get("/", (_req, res) => {
  res.send("Server is running!");
});

AppDataSource.initialize()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is listening at http://localhost:${PORT}`);
    });
  })
  .catch(error => {
    console.error(" Failed to connect to the database.");
    console.error(error);
    process.exit(1);
  });
