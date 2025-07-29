import { transporter } from "../middleware/users/mailer";export class MailService {
  async sendVerificationEmail(params: { email: string; code: string }) {
    const mailOptions = {
      from: `"A1A Car Wash" <${process.env.EMAIL_FROM}>`,
      to: params.email,
      subject: "Verify Your Email",
      html: `...`, // Your email template
    };
    await transporter.sendMail(mailOptions);
  }
}
