const { getUser } = require("../controllers/userController");
const UserModel = require("../models/userModel");

exports.assignRole = (req, res, next) => {
  try {
    const endpoint = req.url;
    const roles = ["admin", "sponsor", "student"];

    const role = roles.find((key) => endpoint.includes(key));
    const sponsor = endpoint.includes("organization");
    if (role) {
      req.body.role = role;
      if (sponsor) {
        req.body.sponsorType = "organization";
        req.body.organizationName
          ? null
          : (req.body.organizationName = undefined);
      }
      return next();
    }
    return res.status(403).json({ message: "Access denied, invalid role" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

exports.studentAccess = async (req, res, next) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized, please login" });
    }
    const user = await UserModel.findById(userId);
    const role = user.role;
    const allowedRoles = ["student"];
    if (allowedRoles.includes(role)) {
      next();
    } else {
      return res.status(403).json({ message: "Access denied, invalid role" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

exports.adminAccess = async (req, res, next) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized, please login" });
    }
    const user = await UserModel.findById(userId);
    const role = user.role;
    const allowedRoles = ["admin", "sponsor", "student"];
    if (allowedRoles.includes(role)) {
      next();
    } else {
      return res.status(403).json({ message: "Access denied, invalid role" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

exports.sponsorAccess = async (req, res, next) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized, please login" });
    }
    const user = await UserModel.findById(userId);
    const role = user.role;
    const allowedRoles = ["sponsor"];
    if (allowedRoles.includes(role)) {
      next();
    } else {
      return res.status(403).json({ message: "Access denied, invalid role" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
