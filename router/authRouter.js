const authRouter = require("express").Router();
const {
  register,
  login,
  resendVerificationLink,
  verifyUser,
} = require("../controllers/emailUrlAuthController");
const passport = require("../middleware/passportMiddleware");
const {
  studentAccess,
  logInRoleValidationMiddleware,
} = require("../middleware/loginRoleValidationMiddleware");
const upload = require("../middleware/multerMiddleware");
const { assignRole } = require("../middleware/roleMiddleware");

// Account registration routes
authRouter.post(
  "/register/student",
  assignRole,
  upload.single("profilePicture"),
  register
);
authRouter.post(
  "/register/sponsor",
  assignRole,
  upload.single("profilePicture"),
  register
);
authRouter.post(
  "/register/admin",
  assignRole,
  upload.single("profilePicture"),
  register
);
// Account login routes
authRouter.post("/login/student", logInRoleValidationMiddleware, login);
authRouter.post("/login/sponsor", logInRoleValidationMiddleware, login);
authRouter.post("/login/admin", logInRoleValidationMiddleware, login);
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
// Account verification routes
authRouter.post("/resend-verification/:userId", resendVerificationLink);
authRouter.get("/verify/:userId/", verifyUser);

module.exports = authRouter;
