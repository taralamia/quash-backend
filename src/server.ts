import express from "express";
import { AppDataSource } from "./data-source";
import routes from "./routers/routes";
import { env } from "./constants/envConfig";
import { errorHandler } from "./middleware/errorHandler";
import cookieParser from "cookie-parser";
const app = express();
const PORT = env.PORT;
app.use(express.json());
app.use(cookieParser());
app.use(routes);
app.use(errorHandler);
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
