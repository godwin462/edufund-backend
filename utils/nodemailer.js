const nodemailer = require("nodemailer");

exports.sendMail = async (user) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    service: process.env.SERVEMAIL_SERVICEICE,
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.APP_USERNAME,
      pass: process.env.APP_PASSWORD,
    },
  });

  (async () => {
    const info = await transporter.sendMail({
      from: `EduFund <${process.env.APP_USERNAME}>`,
      to: user.email,
      subject: user.subject,
      html: user.html
    });

    console.log("Message sent to:", user.email);
  })();
};
