const UserModel = require("../models/userModel");
const registrationTemplate = require("../templates/registrationTemplate");

const loginOtpTemplate = require("../templates/loginOtpTemplate");
const jwt = require("jsonwebtoken");

const { nodemailerOtpHelper, sendEmail } = require("../email/brevo");
const { validateEmail } = require("../middleware/validateEmail");
const constants = require("../utils/constants");
const { generateOtp } = require("../utils/otp");
const { generateJwt, verifyJwt, decodeJwt } = require("../utils/jwtUtil");
const { cloudinaryUpload } = require("../utils/cloudinaryUtil");
const VerificationTokenModel = require("../models/VerificationTokenModel");
const { compareData, hashData } = require("../utils/bcryptUtil");

exports.register = async (req, res) => {
  // console.log(req.body);
  let file = null;
  try {
    const { firstName, lastName, email, role, password } = req.body || {};

    const existingEmail = await UserModel.findOne({ email });

    if (existingEmail) {
      return res
        .status(400)
        .json({ message: "User with the credentials already exists" });
    }

    let profilePicture;
    if (req.file && req.file.buffer) {
      file = await cloudinaryUpload(req.file.buffer);
      profilePicture = {
        imageUrl: file.secure_url,
        publicId: file.public_id,
      };
    }

    const hashedPassword = hashData(password);

    const user = new UserModel({
      firstName,
      lastName,
      email,
      role,
      profilePicture,
      password: hashedPassword,
    });

    const token = await generateJwt({ id: user._id }, constants.jwt_expiry);
    let link = `${req.protocol}://${req.get("host")}/api/v1/auth/verify/${
      user._id
    }/?token=${token}`;

    const text = `EduFunds Account verification`;
    const html = registrationTemplate(link);
    await sendEmail({
      email,
      subject: "EduFunds Account Registration",
      text,
      html,
    });

    await VerificationTokenModel.deleteMany({ userId: user._id });
    await VerificationTokenModel.create({
      userId: user._id,
      token,
    });

    await user.save();
    res
      .status(201)
      .json({ message: "Success, check your email to verify your account" });
  } catch (error) {
    console.log(error);
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    const user = await UserModel.findOne({ email }).select("+password");

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found, please create an account" });
    }

    if (!user.isVerified) {
      return res.status(500).json({
        message: "User not verified, please verify account to continue",
      });
    }

    if (compareData(password, user.password)) {
      return res
        .status(400)
        .json({ message: "Please provide a valid account password" });
    }

    const token = await generateJwt({ id: user._id }, "1d");

    // console.log(otp);
    res.status(200).json({ message: "Success, user logged in", token });
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
    const { token } = req.query;

    const tokenDetails = await VerificationTokenModel.findOne({ token });
    if (!tokenDetails) {
      return res
        .status(404)
        .json({ message: "Token expired, please request a new verification" });
    }

    if ((await verifyJwt(tokenDetails.token)) === false) {
      return res
        .status(404)
        .json({ message: "Invalid token, please request a new verification" });
    }
    if (tokenDetails.userId.toString() !== userId) {
      return res
        .status(404)
        .json({ message: "Wrong user, please request a new verification" });
    }
    const user = await UserModel.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found, please create an account" });
    }

    const verificationToken = await VerificationTokenModel.findOne({
      userId,
    });

    if (!verificationToken) {
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
    console.log(error);
    res.status(500).json({
      message: "Internal server error verifying OTP",
      error: error.message,
    });
  }
};

exports.resendVerificationLink = async (req, res) => {
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
    let token;
    let verificationToken = await VerificationTokenModel.findOne({
      userId,
    });
    if (!verificationToken) {
      token = await generateJwt({ id: user._id }, constants.otp_expiry);
      verificationToken = await VerificationTokenModel.create({
        userId,
        token,
      });
    } else {
      token = verificationToken.token;
    }

    const link = `${req.protocol}://${req.get("host")}/api/v1/auth/verify/${
      user._id
    }?token=${token}`;

    const text = `EduFunds Account verification`;
    const html = registrationTemplate(link);
    await sendEmail({
      email: user.email,
      subject: "EduFunds Account Verification",
      text,
      html,
    });

    res.status(200).json({
      message: "Verification link sent successfully, check your email",
    });
  } catch (error) {
    console.log(error);
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { userId } = req.params;
    const { newPassword, oldPassword } = req.body || {};

    const user = await UserModel.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found, please create an account" });
    }

    if (user.isVerified === false) {
      return res
        .status(403)
        .json({ message: "User not verified, please verify your account" });
    }

    if (compareData(oldPassword, user.password)) {
      return res
        .status(400)
        .json({ message: "Please provide a valid initial account password" });
    }

    if (compareData(newPassword, oldPassword)) {
      return res
        .status(400)
        .json({ message: "New password cannot be same as old password" });
    }
    const hashedPassword = hashData(password);
    Object.assign(user, { password: hashedPassword });
    await user.save();
    res.status(200).json({ message: "Password reset successful", data: user });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

exports.forgotPassword = async (req, res) => {};
