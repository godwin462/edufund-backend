const axios = require("axios");
const NodemailerHelper = require("nodemailer-otp");


const sendEmail = async (options) => {
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: { email:`${process.env.EMAIL}`, name: "DawnEats" },
        to: [{ email: options.email }],
        subject: options.subject,
        htmlContent: options.html,
      },
      {
        headers: {
          "api-key":
            process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );
    if (response.data.error) {
      throw new Error(response.data.error.message);
    }
    console.log("Email sent successfully:", response.data);
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

module.exports = { sendEmail, nodemailerOtpHelper };
