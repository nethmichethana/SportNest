import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

console.log("Gmail User Loaded:", !!process.env.EMAIL_USER);
console.log("Gmail App Password Loaded:", !!process.env.EMAIL_APP_PASSWORD);
const emailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD?.replace(/\s/g, ""),
  },
});

export const sendPasswordResetEmail = async (
  email: string,
  resetLink: string
) => {
  await emailTransporter.sendMail({
    from: `"SportNest" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "SportNest - Password Reset Request",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 12px;">
        <h2 style="color: #2563eb;">SportNest</h2>

        <h3>Password Reset Request</h3>

        <p>We received a request to reset your SportNest account password.</p>

        <p>Click the button below to create a new password:</p>

        <a href="${resetLink}"
          style="display: inline-block; padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">
          Reset My Password
        </a>

        <p style="margin-top: 25px; color: #64748b;">
          This password reset link will expire in 15 minutes.
        </p>

        <p style="color: #64748b;">
          If you did not request a password reset, please ignore this email.
        </p>

        <hr />

        <p style="color: #94a3b8; font-size: 12px;">
          © SportNest. All rights reserved.
        </p>
      </div>
    `,
  });
};