// const passport = require("passport");
const passport = require("../middleware/passportMiddleware");
// const profile = require("./middleware/passportMiddleware");
const authRouter = require("express").Router();
const { register, login, resendOtp } = require("../controllers/OtpAuthController");
const { verifyOtp } = require("../middlewares/verifyOtpMiddleware");
const { assignRole, studentAccess } = require("../middlewares/roleMiddleware");
const {
  logInRoleValidationMiddleware,
} = require("../middlewares/loginRoleValidationMiddleware");
const upload = require("../middleware/multerMiddleware");
/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Authentication endpoints
 */
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

authRouter.post("/login/student", logInRoleValidationMiddleware, login);
authRouter.post("/login/sponsor", logInRoleValidationMiddleware, login);
authRouter.post("/login/admin", logInRoleValidationMiddleware, login);

authRouter.post("/resend-otp/:userId", resendOtp);
authRouter.put("/verify-otp/:userId", verifyOtp, verifyOtp);

authRouter.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);
authRouter.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // console.log(req);
    res.send({ message: "Authentication Success" });
  }
);

module.exports = authRouter;
