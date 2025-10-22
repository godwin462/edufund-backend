const UserModel = require("../models/userModel");
const registrationTemplate = require("../templates/registrationTemplate");

const loginOtpTemplate = require("../templates/loginOtpTemplate");
const jwt = require("jsonwebtoken");
const OtpModel = require("../models/OtpModel");
const { nodemailerOtpHelper, sendEmail } = require("../email/brevo");
const { validateEmail } = require("../middleware/validateEmail");
const constants = require("../utils/constants");
const { generateOtp } = require("../utils/otp");
const { generateJwt, verifyJwt, decodeJwt } = require("../utils/jwtUtil");
const { cloudinaryUpload } = require("../utils/cloudinaryUtil");
const passport = require("passport");
const { compareData, hashData } = require("../utils/bcryptUtil");

exports.register = async (req, res) => {
  /*
  #swagger.tags = ['Authentication']
  #swagger.description = 'Register user account.'
  */
  let file = null;
  try {
    const { firstName, lastName, email, role, password } = req.body;

    const existingEmail = await UserModel.findOne({ email });

    if (existingEmail) {
      return res
        .status(400)
        .json({ message: "User with the credentials already exists" });
    }
    let profilePicture;

    if (req.file && req.file.buffer) {
      file = await cloudinaryUpload(file.buffer);
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
    res.status(201).json({
      message: "OTP sent successfully, check your email to verify your account",
    });
  } catch (error) {
    console.log(error);
    // if (file && file.path) fs.unlinkSync(file.path);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

exports.login = async (req, res) => {
  /*
  #swagger.tags = ['Authentication']
  #swagger.description = 'Login user account.'
  */
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email }).select("+password");

    if (!user) {
      return res.status(404).json({
        message:
          "User not found, please check your credentials or create an account",
      });
    }

    if (!user.isVerified) {
      return res.status(500).json({
        message: "User not verified, please verify account to continue",
      });
    }

    if (!compareData(password, user.password)) {
      return res
        .status(400)
        .json({ message: "Please provide a valid account password" });
    }

    const token = await generateJwt({ id: user._id }, "1d");

    res.status(200).json({ message: "Success, user logged in", token });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

exports.verifyOtp = async (req, res) => {
  /*
  #swagger.tags = ['Authentication']
  #swagger.description = 'Verify OTP for user account.'
  #swagger.parameters['userId'] = {
    in: 'path',
    description: 'User ID.',
    required: true,
    type: 'string'
  }
  #swagger.parameters['obj'] = {
    in: 'body',
    description: 'OTP to be verified.',
    required: true,
    schema: {
      $otp: '123456'
    }
  }
*/
  try {
    const { otp } = req.body;
    const { userId } = req.params;

    const user = await UserModel.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found, please create an account" });
    }
    if (user.isVerified) {
      return res
        .status(400)
        .json({ message: "user already verified, please login to continue" });
    }
    const dbOtp = await OtpModel.findOne({ userId });
    // console.log(dbOtp);

    if (!dbOtp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const isValidOtp = await verifyJwt(dbOtp.otp);
    if (!isValidOtp.otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    const decodeOtp = await decodeJwt(dbOtp.otp);
    // console.log(decodeOtp);

    if (decodeOtp.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.isVerified = true;
    const token = await generateJwt({ id: user._id }, "1d");
    await user.save();

    res.status(200).json({ message: "OTP verification successful ✅", token });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(400).json({ message: "OTP expired, request new otp" });
    }
    console.log(error);
    res.status(500).json({
      message: "Internal server error verifying OTP",
      error: error.message,
    });
  }
};

exports.resendOtp = async (req, res) => {
  /*
  #swagger.tags = ['Authentication']
  #swagger.description = 'Resend OTP for user account.'
  */
  try {
    const { email } = req.body;

    const user = await UserModel.findOne({ email });

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

    otp = await generateJwt({ otp }, constants.otp_expiry);

    await OtpModel.deleteMany({ userId: user._id }); // Delete previous OTPs
    await OtpModel.create({
      userId: user._id,
      otp,
    });

    // console.log(otp);
    res
      .status(200)
      .json({ message: "New OTP sent, check your email", data: user });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
