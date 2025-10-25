const authRouter = require("express").Router();
const {
  register,
  login,
  resendOtp,
  verifyOtp,
  changePassword,
} = require("../controllers/OtpAuthController");
const passport = require("../middleware/passportMiddleware");
const {
  studentAccess,
  logInRoleValidationMiddleware,
} = require("../middleware/loginRoleValidationMiddleware");
const upload = require("../middleware/multerMiddleware");
const { assignRole } = require("../middleware/roleMiddleware");
const {isAuthenticated} = require("../middleware/authenticationMiddleware");

// Account registration routes
authRouter.post(
  "/register/student",
  upload.single("profilePicture"),
  assignRole,
  register
);
authRouter.post(
  "/register/sponsor/organization",
  upload.single("profilePicture"),
  assignRole,
  register
);
authRouter.post(
  "/register/sponsor/individual",
  upload.single("profilePicture"),
  assignRole,
  register
);
authRouter.post(
  "/register/admin",
  upload.single("profilePicture"),
  assignRole,
  register
);
// Account login routes
authRouter.post("/login/student", logInRoleValidationMiddleware, login);
authRouter.post(
  "/login/sponsor/individual",
  logInRoleValidationMiddleware,
  login
);
authRouter.post(
  "/login/sponsor/organization",
  logInRoleValidationMiddleware,
  login
);
authRouter.post("/login/admin", logInRoleValidationMiddleware, login);
// Account verification routes
authRouter.post("/resend-otp/", resendOtp);
authRouter.post("/verify/:email/", verifyOtp);
// Account Google login routes
authRouter.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);
authRouter.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    res.send({ message: "Authentication Success" });
  }
);

//  auth updates
authRouter.post("/change-password/:userId", isAuthenticated, changePassword);

module.exports = authRouter;
