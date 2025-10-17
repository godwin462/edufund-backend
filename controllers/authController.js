const UserModel = require("../models/userModel");
const registrationTemplate = require("../templates/registrationTemplate");

const loginOtpTemplate = require("../templates/loginOtpTemplate");
const jwt = require("jsonwebtoken");
const OtpModel = require("../models/OtpModel");
const { nodemailerOtpHelper, sendEmail } = require("../email/brevo");
const { validateEmail } = require("../middlewares/validateEmail");
const constants = require("../utils/constants");
const { generateOtp } = require("../utils/otp");
const { generateJwt } = require("../utils/jwtUtil");

const otpLifeTime = process.env.OTP_EXPIRY_DATE;

exports.register = async (req, res) => {
  //   let file;
  try {
    const { firstName, lastName, email, role } = req.body;

    const existingEmail = await UserModel.findOne({ email });

    if (existingEmail) {
      return res
        .status(400)
        .json({ message: "User with the credentials already exists" });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Please provide a valid email!" });
    }

    const user = new UserModel({
      firstName,
      lastName,
      email,
      role,
    });

    let otp = generateOtp();

    const text = `EduFunds Account verification`;
    const html = registrationTemplate(otp);
    await sendEmail({
      email,
      subject: "EduFunds Account Registration",
      text,
      html,
    });

    otp = await generateJwt({ otp }, constants.otp_expiry);

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
      .status(500)
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
    // console.log(email);
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found, please create an account" });
    }

    // if (!user.isVerified) {
    //   return res.status(500).json({
    //     message: "User not verified, please verify account to continue",
    //   });
    // }

    let otp = await generateOtp();

    const text = `EduFunds Account verification`;
    const html = loginOtpTemplate(otp);
    await sendEmail({
      email,
      subject: "EduFunds Account Login",
      text,
      html,
    });

    otp = await generateJwt({ otp }, constants.otp_expiry);

    await OtpModel.deleteMany({ userId: user._id }); // Delete previous OTPs
    await OtpModel.create({
      userId: user._id,
      otp,
    });

    // console.log(otp);
    res
      .status(200)
      .json({ message: "OTP sent successfully, check your email" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { userId } = req.params;
    const { otp } = req.body;

    const user = await UserModel.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found, please create an account" });
    }

    res
      .status(200)
      .json({ message: "OTP verification successful ✅", data: user });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error verifying OTP",
      error: error.message,
    });
  }
};

exports.resendOtp = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await UserModel.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found, please create an account" });
    }

    let otp = generateOtp();

    const text = `EduFunds otp resend request`;
    const html = loginOtpTemplate(otp);
    await sendEmail({
      email: user.email,
      subject: "EduFunds Account Login",
      text,
      html,
    });

    otp = generateJwt({ otp }, constants.otp_expiry);

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
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

exports.verifyUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await UserModel.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found, please create an account" });
    }

    if (user.isVerified) {
      return res.status(403).json({
        message: "User already verified, please login to continue",
      });
    }
    Object.assign(user, { isVerified: true });
    await user.save();

    res
      .status(200)
      .json({ message: "User verification successful ✅", data: user });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error verifying user",
      error: error.message,
    });
  }
};
