import express, { Request, Response } from "express";
import { port, connectToDatabase } from "./config/db";
const app = express();
connectToDatabase();
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript Express!");
});
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
