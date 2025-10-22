const axios = require("axios");
const NodemailerHelper = require("nodemailer-otp");

const nodemailer = require("nodemailer");

// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: true, // use SSL
  auth: {
    user: process.env.EMAIL,
    pass: process.env.MAIL_PASS,
  },
});

const nodemailerSendEmail = async (options) => {
  const info = await transporter.sendMail({
    from: process.env.EMAIL,
    to: options.email,
    subject: options.subject,
    text: options.text, // plain‑text body
    html: options.html, // HTML body
  });

  //   console.log("Message sent:", info.messageId);
};

const brevoSendEmail = async (options) => {
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: { email: `${process.env.EMAIL}`, name: "DawnEats" },
        to: [{ email: options.email }],
        subject: options.subject,
        htmlContent: options.html,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );
    if (response.data.error) {
      throw new Error(response.data.error.message);
    }
    console.log(
      "Email sent successfully:",
      response.data,
      options.email,
      process.env.EMAIL
    );
  } catch (error) {
    console.error(
      "Error sending email:",
      error.response ? error.response.data : error.message
    );
  }
};

const nodemailerOtpHelper = new NodemailerHelper(
  process.env.EMAIL,
  process.env.MAIL_PASS
);
const sendEmail =
  process.env.NODE_ENV !== "production" ? brevoSendEmail : nodemailerSendEmail;

module.exports = { sendEmail, nodemailerOtpHelper };
