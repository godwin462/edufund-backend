const UserModel = require("../models/userModel");
const registrationTemplate = require("../templates/registrationTemplate");

const loginOtpTemplate = require("../templates/loginOtpTemplate");
const jwt = require("jsonwebtoken");
const OtpModel = require("../models/OtpModel");
const { nodemailerOtpHelper, sendEmail } = require("../email/brevo");
const { validateEmail } = require("../middlewares/validateEmail");

const otpLifeTime = process.env.OTP_EXPIRY_DATE;

exports.register = async (req, res) => {
  //   let file;
  try {
    const { firstName, lastName, email, phone } = req.body;

    const existingEmail = await UserModel.findOne({ email });
    const existingPhone = await UserModel.findOne({ phone });

    if (existingEmail || existingPhone) {
      return res
        .status(400)
        .json({ message: "User with the credentials already exists" });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Please provide a vlide email!" });
    }

    const user = new UserModel({
      firstName,
      lastName,
      email,
      phone,
    });

    console.log("I am working!");

    let otp = nodemailerOtpHelper.generateOtp(4);

    const text = `EduFunds Account verification`;
    const html = registrationTemplate(otp);
    await sendEmail({
      email,
      subject: "EduFunds Account Registration",
      text,
      html,
    }); //console.log(otp);

    otp = jwt.sign({ otp }, process.env.JWT_SECRETE, { expiresIn: `${otpLifeTime}m` });

    await OtpModel.deleteMany({ userId: user._id }); // Delete previous OTPs
    await OtpModel.create({
      userId: user._id,
      otp,
    });

    await user.save();
    res.status(201).json({ message: "OTP sent successfully", data: user });
  } catch (error) {
    console.log(error);
    // if (file && file.path) fs.unlinkSync(file.path);
    res
      .status(400)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email } = req.body;

    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Please provide a vlide email!" });
    }

    const user = await UserModel.findOne({ email });
    console.log(email);
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found, please create an account" });
    }

    let otp = nodemailerOtpHelper.generateOtp(4);

    const text = `EduFunds Account verification`;
    const html = loginOtpTemplate(otp);
    await sendEmail({
      email,
      subject: "EduFunds Account Login",
      text,
      html,
    });

    otp = jwt.sign({ otp }, process.env.JWT_SECRETE, { expiresIn: `${otpLifeTime}m` });

    await OtpModel.deleteMany({ userId: user._id }); // Delete previous OTPs
    await OtpModel.create({
      userId: user._id,
      otp,
    });

    // console.log(otp);
    res.status(200).json({ message: "OTP sent successfully", data: user });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

exports.verifyAuth = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await UserModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found, please create an account" });
    }

    token = jwt.sign({ id: userId }, process.env.JWT_SECRETE, {
      expiresIn: `1d`,
    });

    if (!user.isVerified) user.isVerified = true;
    user.token = token;
    await user.save();

    res.status(200).json({ message: "User verified successful", data: user });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
