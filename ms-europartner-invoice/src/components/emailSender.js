require("dotenv").config();
const nodemailer = require("nodemailer");
const logger = require("../config/logger");

const sendEmail = async (emailTo, subject, message, attachments) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: emailTo,
    subject: subject,
    html: message,
    attachments: attachments.map(({ filename, fileBuffer }) => ({
      filename,
      content: fileBuffer,
    })),
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    logger.error(`${error.stack}`);
    throw new Error("Erro ao enviar e-mail");
  }
};

module.exports = { sendEmail };
