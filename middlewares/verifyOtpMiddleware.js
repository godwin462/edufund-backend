const OtpModel = require("../models/OtpModel");
const jwt = require("jsonwebtoken");

const OTP_TRIALS = 3;
const OTP_BLOCK_MINUTES = 10;

exports.verifyOtp = async (req, res, next) => {
  let auth;
  try {
    const { userId } = req.params;
    const { otp } = req.body;
    // console.log("I am working");
    auth = await OtpModel.findOne({ userId });

    if (!auth) {
      return res
        .status(400)
        .json({ message: "invalid OTP, Please request a new OTP" });
    }

    const otpIsValid = jwt.verify(auth.otp, process.env.JWT_SECRETE);
    if (!otpIsValid.otp) {
      return res
        .status(400)
        .json({ message: "OTP expired, Please request a new OTP" });
    }

    if (auth.trials >= OTP_TRIALS) {
      return res
        .status(400)
        .json({ message: "Too many attempts, request new otp" });
    }

    if (otp !== otpIsValid.otp) {
      auth.trials += 1;
      await auth.save();
      return res.status(400).json({
        message: "Invalid OTP, check your email and try again",
      });
    }

    await OtpModel.deleteMany({ userId });
    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      console.log("Token has expired", error.expiredAt);
      // if (auth.trials >= OTP_TRIALS) {
      //   auth.trials = 0;
      //   otp = jwt.sign({ otp: otpIsValid.otp }, process.env.JWT_SECRETE, {
      //     expiresIn: `${otpLifeTime}m`,
      //   });
      //   auth.otp = otp;
      //   console.log(`reseting for otp to 0 `);
      //   await auth.save();
      // }
      return res
        .status(400)
        .json({ message: "OTP expired, please request a new OTP" });
    }
    return res
      .status(500)
      .json({ message: `Internal server error`, error: error.message });
  }
};
