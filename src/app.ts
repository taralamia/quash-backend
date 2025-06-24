import express, { Request, Response } from "express";
const app = express();
app.use(express.json());
app.get("/", (req: Request, res: Response) => {
  res.send("Hello from setup file");
});
app.listen(process.env.PORT, () => {
  console.log(`Server is running at ${process.env.PORT}`);
});
export default app;
