import nodemailer from "nodemailer";
import { env } from "../../constants/envConfig";
export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASSWORD,
  },
});
