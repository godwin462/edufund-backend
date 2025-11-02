const OtpModel = require("../models/OtpModel");
const jwt = require("jsonwebtoken");
const {verifyOtpValidation} = require("../validations/authControllerValidations");
const UserModel = require("../models/userModel");
const {verifyJwt, decodeJwt} = require("../utils/jwtUtil");

const OTP_TRIALS = 3;
const OTP_BLOCK_MINUTES = 10;

exports.verifyOtpMiddleware = async (req, res, next) => {
  try {
    const {error} = verifyOtpValidation.validate({...req.body, ...req.params});
    if(error) {
      return res.status(400).json({message: error.details[0].message});
    }
    const {otp} = req.body || {};
    const {email} = req.params;

    const user = await UserModel.findOne({email});

    if(!user) {
      return res
        .status(404)
        .json({message: "User not found, please create an account"});
    }

    const dbOtp = await OtpModel.findOne({userId: user._id});
    // console.log(dbOtp);

    if(!dbOtp) {
      return res.status(400).json({message: "Invalid OTP, please request for a new one"});
    }

    const isValidOtp = await verifyJwt(dbOtp.otp);
    if(!isValidOtp.otp) {
      return res.status(400).json({message: "Invalid OTP, please ensure to get the correct token from your email"});
    }
    const decodeOtp = await decodeJwt(dbOtp.otp);
    // console.log(decodeOtp);

    if(decodeOtp.otp !== otp) {
      return res.status(400).json({message: "Wrong OTP, please check your email and try again"});
    }
    return next();
  } catch(error) {
    if(error.name === "TokenExpiredError") {
      // console.log("Token has expired", error.expiredAt);
      // if (auth.trials >= OTP_TRIALS) {
      //   auth.trials = 0;
      //   otp = jwt.sign({ otp: otpIsValid.otp }, process.env.JWT_SECRET, {
      //     expiresIn: `
      //   });
      //   auth.otp = otp;
      //   console.log(`reseting for otp to 0 `);
      //   await auth.save();
      // }
      return res
        .status(400)
        .json({message: "OTP expired, please request a new OTP"});
    }
    return res
      .status(500)
      .json({message: `Internal server error`, error: error.message});
  }
};
