import rateLimit from "express-rate-limit";
import { AppError} from "../utils/AppError";  
export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 10 requests per windowMs
    handler: (req, res, next) => { 
       const error = new AppError(
      "Too many requests from this IP, please try again after 15 minutes",
      429
    );
    next(error);
    },
}); 