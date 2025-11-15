const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { verifyJwt } = require("../utils/jwtUtil");

const loginUrl = `https://edu-fund-gamma.vercel.app/login`;
const registerUrl = `https://edu-fund-gamma.vercel.app/account-type`;

exports.isAuthenticated = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      // return res.status(401).json({
      //   message: "User not authenticated, please login",
      // });
      return res.redirect(loginUrl);
    }
    const decoded = await verifyJwt(token);
    const user = await userModel.findById(decoded.id);

    if (!user) {
      // return res.status(404).json({
      //   message: "Cannot perform action please create an account",
      // });
      return res.redirect(registerUrl);
    }
    if (!user.isVerified) {
      return res.status(403).json({
        message:
          "You're not authorized perform this action. please verify your account",
      });
    }
    req.user = user;
    // req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      // return res.status(401).json({
      //   message: "Session expired, Please login again to continue",
      // });
      return res.redirect(loginUrl);
    }
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.adminAuth = async (req, res, next) => {
  if (req.user.isAdmin !== true) {
    return res.status(403).json({
      message: "You're not authorized perform this action.",
    });
  } else {
    next();
  }
};

exports.checkVerification = async (req, res, next) => {
  if (req.user.isVerified !== true) {
    return res.status(403).json({
      message: "You're not authorized perform this action.",
    });
  } else {
    next();
  }
};
