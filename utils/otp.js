const { nodemailerOtpHelper } = require("../email/brevo");

exports.generateOtp = (length = 6) => nodemailerOtpHelper.generateOtp(length);
