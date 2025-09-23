import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

async function sendTestEmail() {
  try {
    // Log to confirm env variables are loaded
    console.log("EMAIL_USER:", process.env.EMAIL_USER);
    console.log("EMAIL_PASS length:", process.env.EMAIL_PASS?.length);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "anshkaushal92@gmail.com", // put any test email you own
      subject: "Test Email from College Connect",
      text: "This is a test email to verify Gmail SMTP with App Password works 🚀",
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.response);
  } catch (err) {
    console.error("❌ Email send failed:", err.message);
  }
}

sendTestEmail();
