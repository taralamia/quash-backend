import { transporter } from "../middleware/users/mailer";
export class MailService {
  async sendVerificationEmail(params: { email: string; code: string }) {
    const mailOptions = {
      from: `"A1A Car Wash" <${process.env.EMAIL_FROM}>`,
      to: params.email,
      subject: "Verify Your Email",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Welcome to A1A Car Wash 🚗</h2>
          <p>Hi there,</p>
          <p>Thank you for registering. Please verify your email using the following verification code:</p>
          <div style="font-size: 24px; font-weight: bold; margin: 20px 0;">${params.code}</div>
          <p>This code will expire in 24 hours.</p>
          <p>If you did not sign up, you can safely ignore this message.</p>
          <br />
          <p>– The A1A Car Wash Team</p>
        </div>
      `,
    };
    await transporter.sendMail(mailOptions);
  }
}
