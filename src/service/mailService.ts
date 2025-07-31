import { transporter } from "../middleware/users/mailer";
import { env } from "../constants/envConfig";
import { readFileSync } from "fs";
import path from "path";
export class MailService {
  async sendVerificationEmail(params: { email: string; code: string }) {
    const templatePath = path.join(__dirname, "../templates/verificationEmail.html");
    let htmlContent = readFileSync(templatePath, "utf-8");
    htmlContent = htmlContent.replace("{{code}}", params.code);
    const mailOptions = {
      from: `"A1A Car Wash" <${env.EMAIL_FROM}>`,
      to: params.email,
      subject: "Verify Your Email",
      html: htmlContent,
    };
    await transporter.sendMail(mailOptions);
  }
}
