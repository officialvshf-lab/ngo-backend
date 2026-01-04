const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, html, attachments = [] }) => {
  try {
    console.log("📧 Sending email to:", to);

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: true, // Hostinger SSL
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // 🔍 SMTP TEST
    await transporter.verify();
    console.log("✅ SMTP verified");

    const info = await transporter.sendMail({
      from: `"Vishwa Sanatan Hindu Foundation" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      attachments
    });

    console.log("✅ Email sent:", info.messageId);
  } catch (err) {
    console.error("❌ Email error:", err);
    throw err;
  }
};

module.exports = sendEmail;
