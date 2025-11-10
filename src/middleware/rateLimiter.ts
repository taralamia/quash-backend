import rateLimit from "express-rate-limit";
import { AppError} from "../utils/AppError";  
export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
    handler: (req, res, next) => { 
       const error = new AppError(
      "Too many requests from this IP, please try again after 15 minutes",
      429
    );
    next(error);
    },
}); 