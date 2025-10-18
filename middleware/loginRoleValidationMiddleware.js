const UserModel = require("../models/userModel");

exports.logInRoleValidationMiddleware = async (req, res, next) => {
  try {
    const endpoint = req.url;
    const { email } = req.body;
    const roles = ["admin", "sponsor", "student"];
    const user = await UserModel.findOne({ email });
    // console.log(user);
    if (!user) {
      return res.status(404).json({
        message: "User not found, please create an account",
      });
    }
    const role = roles.find((key) => endpoint.includes(key));
    if (role) {
      if (user.role === role) {
        return next();
      }
    }
    return res.status(401).json({
      message: `You're not authorized perform this action. please login as ${user.role}`,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error validating role on login",
      error: error.message,
    });
  }
};
