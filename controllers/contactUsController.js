const { sendEmail } = require("../email/brevo");

exports.contactUs = async (req, res) => {
  /* #swagger.tags = ['Contact Us']
     #swagger.description = 'Contact Us Form Submission Handler'
     */
  try {
    const { email, message } = req.body || {};
    await sendEmail({
      email: process.env.EMAIL,
      subject: "Contact Us",
      text: `Email: ${email}\nMessage: ${message}`,
      html: `<p>Email: ${email}</p><p>Message: ${message}</p>`,
    });

    res.status(200).json({
      message: "Message sent successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
