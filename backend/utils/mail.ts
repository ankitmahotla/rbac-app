import Mailgen from "mailgen";
import nodemailer from "nodemailer";
import type { Content } from "mailgen";

interface SendEmailOptions {
  email: string;
  subject: string;
  mailgenContent: Content;
}

const mailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "RBAC",
    link: "https://rbac.app",
  },
});

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_SMTP_HOST,
  port: parseInt(process.env.MAILTRAP_SMTP_PORT || "2525"),
  auth: {
    user: process.env.MAILTRAP_SMTP_USER,
    pass: process.env.MAILTRAP_SMTP_PASS,
  },
});

const sendEmail = async (options: SendEmailOptions): Promise<void> => {
  try {
    const emailTextual = mailGenerator.generatePlaintext(
      options.mailgenContent,
    );
    const emailHtml = mailGenerator.generate(options.mailgenContent);

    await transporter.sendMail({
      from: "mail.rbac@example.com",
      to: options.email,
      subject: options.subject,
      text: emailTextual,
      html: emailHtml,
    });
  } catch (error) {
    console.error("Email service failed silently");
    console.error("Error: ", error);
  }
};

// Email verification content generator
const emailVerificationMailgenContent = (
  username: string,
  verificationUrl: string,
): Content => ({
  body: {
    name: username,
    intro: "Welcome to our app! We're very excited to have you on board.",
    action: {
      instructions:
        "To verify your email please click on the following button:",
      button: {
        color: "#22BC66",
        text: "Verify your email",
        link: verificationUrl,
      },
    },
    outro: "Need help, or have questions? Just reply to this email.",
  },
});

// Forgot password content generator
const forgotPasswordMailgenContent = (
  username: string,
  passwordResetUrl: string,
): Content => ({
  body: {
    name: username,
    intro: "We got a request to reset the password of our account",
    action: {
      instructions: "To reset your password click on the following button:",
      button: {
        color: "#22BC66",
        text: "Reset password",
        link: passwordResetUrl,
      },
    },
    outro: "Need help, or have questions? Just reply to this email.",
  },
});

export {
  sendEmail,
  emailVerificationMailgenContent,
  forgotPasswordMailgenContent,
};
